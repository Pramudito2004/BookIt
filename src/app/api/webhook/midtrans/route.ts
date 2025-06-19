import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    console.log('Received Midtrans webhook:', payload);

    // Verify the transaction status
    if (payload.transaction_status === 'settlement' || payload.transaction_status === 'capture') {
      // Get order details
      const order = await prisma.order.findFirst({
        where: {
          order_id: payload.order_id
        },
        include: {
          tikets: true,
          pembayaran: true
        }
      });

      if (!order) {
        console.error('Order not found:', payload.order_id);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // Update payment status
      await prisma.pembayaran.update({
        where: { payment_id: order.pembayaran?.payment_id },
        data: { status: 'settlement' }
      });

      // Update order status to PAID
      await prisma.order.update({
        where: { order_id: order.order_id },
        data: { status: OrderStatus.PAID }
      });

      // Update all tickets in the order to SOLD status
      await prisma.tiket.updateMany({
        where: { order_id: order.order_id },
        data: { status: 'SOLD' }
      });

      return NextResponse.json({ message: 'Payment processed successfully' });
    } else if (payload.transaction_status === 'deny' || payload.transaction_status === 'cancel' || payload.transaction_status === 'expire') {
      // Handle failed payments
      const order = await prisma.order.findFirst({
        where: {
          order_id: payload.order_id
        }
      });

      if (order) {
        // Update order status to CANCELLED
        await prisma.order.update({
          where: { order_id: order.order_id },
          data: { status: OrderStatus.CANCELLED }
        });
      }
      
      return NextResponse.json({ message: 'Payment cancelled' });
    }

    return NextResponse.json({ message: 'Notification received' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}