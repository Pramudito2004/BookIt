// src/app/api/orders/[orderId]/payment/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from "@/lib/prisma";
import { createSnapInstance } from '@/lib/midtrans';
import { OrderStatus } from "@prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

    // Get order details
    const order = await prisma.order.findUnique({
      where: { order_id: orderId },
      include: {
        tikets: {
          include: {
            tipe_tiket: {
              include: {
                event: true
              }
            }
          }
        },
        pembayaran: true,
        user: {
          include: {
            pembeli: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order is still pending
    if (order.status !== OrderStatus.PENDING) {
      return NextResponse.json(
        { error: 'Order is not pending payment' },
        { status: 400 }
      );
    }

    // Get the first ticket to extract event and ticket info
    const firstTicket = order.tikets[0];
    if (!firstTicket) {
      return NextResponse.json(
        { error: 'No tickets found for this order' },
        { status: 400 }
      );
    }

    const event = firstTicket.tipe_tiket.event;
    const ticketType = firstTicket.tipe_tiket;

    // Calculate total details
    const quantity = order.tikets.length;
    const price = Number(ticketType.harga);
    const total = Number(order.jumlah_total);

    // Create Midtrans Snap instance
    const snap = createSnapInstance();

    // Use the SAME order ID for Midtrans (not create new one)
    const midtransOrderId = orderId;

    // Prepare item name (limit to 50 characters for Midtrans)
    const ticketName = ticketType.nama.length > 20 
      ? ticketType.nama.substring(0, 20) 
      : ticketType.nama;
    
    const eventName = event.nama_event.length > 20
      ? event.nama_event.substring(0, 20)
      : event.nama_event;
      
    const itemName = `${ticketName} - ${eventName}`;

    // Get customer details from user data
    const customerFirstName = order.user.pembeli?.nama_pembeli?.split(' ')[0] || 'Customer';
    const customerEmail = order.user.email || 'customer@example.com';

    // Format start_time sesuai dengan format yang diminta Midtrans
    const now = new Date();
    const jakartaTime = new Date(now.getTime() + (7 * 60 * 60 * 1000)); // UTC+7 untuk Jakarta
    const formattedStartTime = jakartaTime.toISOString()
      .replace('T', ' ')
      .replace(/\.\d{3}Z$/, ' +0700');

    const parameter = {
      transaction_details: {
        order_id: midtransOrderId, // Use SAME order ID
        gross_amount: Math.round(total)
      },
      item_details: [{
        id: ticketType.tiket_type_id,
        price: Math.round(price),
        quantity: quantity,
        name: itemName
      }],
      customer_details: {
        first_name: customerFirstName,
        email: customerEmail,
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?order_id=${orderId}`,
        error: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/error?order_id=${orderId}`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/pending?order_id=${orderId}`
      },
      expiry: {
        start_time: formattedStartTime, // Format: "2025-06-23 22:20:06 +0700"
        unit: "minutes",
        duration: 60 // Payment expires in 60 minutes
      }
    };

    console.log('Continue payment parameter:', JSON.stringify(parameter));

    const snapResponse = await snap.createTransaction(parameter);

    // Update existing payment record or create new one
    if (order.pembayaran) {
      await prisma.pembayaran.update({
        where: { payment_id: order.pembayaran.payment_id },
        data: {
          status: 'PENDING',
          waktu_transaksi: new Date() // Update transaction time
        }
      });
    } else {
      // Create payment record if it doesn't exist
      await prisma.pembayaran.create({
        data: {
          order_id: orderId,
          jumlah: order.jumlah_total,
          status: 'PENDING'
        }
      });
    }

    return NextResponse.json({
      order_id: orderId, // Return SAME order ID
      snap_token: snapResponse.token,
      redirect_url: snapResponse.redirect_url,
      total_amount: Number(total),
      event_title: event.nama_event
    });

  } catch (error: any) {
    console.error('Error generating payment token:', error);
    
    // Handle specific Midtrans errors
    if (error.message && error.message.includes('Order ID already exists')) {
      // If order ID already exists in Midtrans, we can still proceed
      // This is expected behavior for retry payments
      console.log('Order ID already exists in Midtrans, this is normal for retry payments');
      
      // Try to get existing transaction status from Midtrans
      try {
        const snap = createSnapInstance();
        // You might want to check transaction status here
        // For now, return error asking user to wait or contact support
        return NextResponse.json(
          { 
            error: 'Payment session already exists',
            message: 'Please wait a moment before trying again, or contact support if the issue persists'
          },
          { status: 409 }
        );
      } catch (statusError) {
        console.error('Error checking transaction status:', statusError);
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to generate payment token',
        message: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
}