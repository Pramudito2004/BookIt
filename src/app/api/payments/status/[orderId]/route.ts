// src/app/api/payments/status/[orderId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createCoreApiInstance } from "@/lib/midtrans";
import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    
    // First, try to get payment status using the original order ID
    let midtransOrderId = orderId;
    let status;
    
    try {
      const coreApi = createCoreApiInstance();
      status = await coreApi.transaction.status(orderId);
    } catch (error: any) {
      // If original order ID fails, it might be because we need to check
      // for the most recent Midtrans transaction for this order
      console.log('Direct order ID lookup failed, checking database for Midtrans transactions');
      
      // Get current order from database first
      const currentOrder = await prisma.order.findUnique({
        where: { order_id: orderId },
        include: { pembayaran: true, tikets: true }
      });

      if (!currentOrder) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      // For now, return the current database status if Midtrans check fails
      return NextResponse.json({
        order_id: orderId,
        order_status: currentOrder.status,
        payment_status: Array.isArray(currentOrder.pembayaran) && currentOrder.pembayaran.length > 0 
          ? currentOrder.pembayaran[0].status 
          : 'UNKNOWN',
        error: 'Could not fetch latest status from payment gateway',
        fallback: true
      });
    }

    console.log('Midtrans payment status:', status);

    // Get current order from database
    const currentOrder = await prisma.order.findUnique({
      where: { order_id: orderId },
      include: {
        pembayaran: true,
        tikets: true
      }
    });

    if (!currentOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Determine new status based on Midtrans response
    let newOrderStatus: OrderStatus;
    let newPaymentStatus: string;

    switch (status.transaction_status) {
      case 'capture':
      case 'settlement':
        newOrderStatus = OrderStatus.PAID;
        newPaymentStatus = 'PAID';
        break;
      case 'pending':
        newOrderStatus = OrderStatus.PENDING;
        newPaymentStatus = 'PENDING';
        break;
      case 'deny':
      case 'cancel':
      case 'expire':
      case 'failure':
        newOrderStatus = OrderStatus.CANCELLED;
        newPaymentStatus = 'FAILED';
        break;
      default:
        newOrderStatus = currentOrder.status; // Keep current status
        newPaymentStatus = status.transaction_status.toUpperCase();
    }

    // Update order status if it has changed
    if (currentOrder.status !== newOrderStatus) {
      await prisma.order.update({
        where: { order_id: orderId },
        data: { 
          status: newOrderStatus,
          dibuat_di: currentOrder.dibuat_di // Keep original creation time
        },
      });

      console.log(`Order ${orderId} status updated from ${currentOrder.status} to ${newOrderStatus}`);
    }

    // Update payment status if payment exists
    if (Array.isArray(currentOrder.pembayaran) && currentOrder.pembayaran.length > 0) {
      const payment = currentOrder.pembayaran[0];
      
      await prisma.pembayaran.update({
        where: { payment_id: payment.payment_id },
        data: { 
          status: newPaymentStatus,
          // Add payment completion time if paid
          ...(newPaymentStatus === 'PAID' && {
            dibuat_di: new Date()
          })
        },
      });

      console.log(`Payment ${payment.payment_id} status updated to ${newPaymentStatus}`);
    }

    // If order is now paid, update ticket statuses to SOLD
    if (newOrderStatus === OrderStatus.PAID && currentOrder.status !== OrderStatus.PAID) {
      await prisma.tiket.updateMany({
        where: { order_id: orderId },
        data: { status: 'SOLD' }
      });

      console.log(`Tickets for order ${orderId} marked as SOLD`);
    }

    // If order is cancelled, restore ticket availability
    if (newOrderStatus === OrderStatus.CANCELLED && currentOrder.status !== OrderStatus.CANCELLED) {
      // Get ticket type to restore availability
      if (currentOrder.tikets.length > 0) {
        const ticketTypeId = currentOrder.tikets[0].tiket_type_id;
        const quantity = currentOrder.tikets.length;

        await prisma.tipeTiket.update({
          where: { tiket_type_id: ticketTypeId },
          data: {
            jumlah_tersedia: {
              increment: quantity
            }
          }
        });

        console.log(`Restored ${quantity} tickets to availability for type ${ticketTypeId}`);
      }
    }

    return NextResponse.json({
      order_id: orderId,
      order_status: newOrderStatus,
      payment_status: newPaymentStatus,
      midtrans_status: status.transaction_status,
      updated: currentOrder.status !== newOrderStatus,
      ...status
    });

  } catch (error: any) {
    console.error("Error checking payment status:", error);
    
    // If Midtrans API fails, return current database status
    try {
      const order = await prisma.order.findUnique({
        where: { order_id: await params.then(p => p.orderId) },
        include: { pembayaran: true }
      });

      if (order) {
        return NextResponse.json({
          order_id: order.order_id,
          order_status: order.status,
          payment_status: Array.isArray(order.pembayaran) && order.pembayaran.length > 0 
            ? order.pembayaran[0].status 
            : 'UNKNOWN',
          error: 'Could not fetch latest status from payment gateway',
          fallback: true
        });
      }
    } catch (dbError) {
      console.error("Database fallback also failed:", dbError);
    }

    return NextResponse.json(
      { 
        error: "Failed to check payment status",
        message: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Handle webhook from Midtrans
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const body = await request.json();
    
    console.log('Midtrans webhook received:', body);

    // Extract original order ID from webhook data
    // Check if order_id contains timestamp suffix and extract original ID
    let originalOrderId = body.order_id;
    if (body.order_id && body.order_id.includes('-')) {
      const parts = body.order_id.split('-');
      // If the last part is a timestamp (13 digits), remove it
      if (parts.length > 1 && parts[parts.length - 1].length === 13 && /^\d+$/.test(parts[parts.length - 1])) {
        originalOrderId = parts.slice(0, -1).join('-');
      }
    }

    // Also check custom_field1 if available
    if (body.custom_field1) {
      originalOrderId = body.custom_field1;
    }

    console.log('Processing webhook for original order ID:', originalOrderId);

    // Get current order
    const order = await prisma.order.findUnique({
      where: { order_id: originalOrderId },
      include: { pembayaran: true, tikets: true }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Process status update based on webhook data
    let newOrderStatus: OrderStatus;
    let newPaymentStatus: string;

    switch (body.transaction_status) {
      case 'capture':
      case 'settlement':
        newOrderStatus = OrderStatus.PAID;
        newPaymentStatus = 'PAID';
        break;
      case 'pending':
        newOrderStatus = OrderStatus.PENDING;
        newPaymentStatus = 'PENDING';
        break;
      case 'deny':
      case 'cancel':
      case 'expire':
      case 'failure':
        newOrderStatus = OrderStatus.CANCELLED;
        newPaymentStatus = 'FAILED';
        break;
      default:
        return NextResponse.json({ message: 'Status not processed' });
    }

    // Update order and payment status
    await prisma.$transaction(async (tx) => {
      // Update order
      if (order.status !== newOrderStatus) {
        await tx.order.update({
          where: { order_id: originalOrderId },
          data: { status: newOrderStatus }
        });
      }

      // Update payment
      if (Array.isArray(order.pembayaran) && order.pembayaran.length > 0) {
        await tx.pembayaran.update({
          where: { payment_id: order.pembayaran[0].payment_id },
          data: { status: newPaymentStatus }
        });
      }

      // Update tickets if paid
      if (newOrderStatus === OrderStatus.PAID) {
        await tx.tiket.updateMany({
          where: { order_id: originalOrderId },
          data: { status: 'SOLD' }
        });
      }
    });

    return NextResponse.json({ 
      message: 'Webhook processed successfully',
      order_id: originalOrderId,
      midtrans_order_id: body.order_id,
      new_status: newOrderStatus
    });

  } catch (error: any) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}