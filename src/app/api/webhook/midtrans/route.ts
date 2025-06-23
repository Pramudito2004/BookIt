// src/app/api/webhooks/midtrans/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { OrderStatus, TiketStatus } from "@prisma/client";
import crypto from 'crypto';

// Function to verify Midtrans signature
function verifySignature(payload: any, serverKey: string): boolean {
  const orderId = payload.order_id;
  const statusCode = payload.status_code;
  const grossAmount = payload.gross_amount;
  
  const hash = crypto
    .createHash('sha512')
    .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
    .digest('hex');
  
  return hash === payload.signature_key;
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    console.log('Received Midtrans webhook:', payload);

    // Verify signature (recommended for production)
    const serverKey = process.env.MIDTRANS_SERVER_KEY || '';
    if (!verifySignature(payload, serverKey)) {
      console.error('Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Extract order ID (handle both original and suffixed IDs)
    let orderId = payload.order_id;
    
    // If the order ID has timestamp suffix, extract the original
    if (orderId.includes('-') && orderId.match(/-\d{13}$/)) {
      orderId = orderId.replace(/-\d{13}$/, '');
    }

    console.log('Processing order ID:', orderId);

    // Handle successful payment
    if (payload.transaction_status === 'settlement' || payload.transaction_status === 'capture') {
      const order = await prisma.order.findUnique({
        where: { order_id: orderId },
        include: {
          tikets: true,
          pembayaran: true
        }
      });

      if (!order) {
        console.error('Order not found:', orderId);
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      // Update payment status
      if (order.pembayaran) {
        await prisma.pembayaran.update({
          where: { payment_id: order.pembayaran.payment_id },
          data: { 
            status: 'settlement',
            waktu_transaksi: new Date()
          }
        });
      }

      // Update order status to PAID
      await prisma.order.update({
        where: { order_id: orderId },
        data: { status: OrderStatus.PAID }
      });

      // Update all tickets in the order to SOLD status
      await prisma.tiket.updateMany({
        where: { order_id: orderId },
        data: { status: TiketStatus.SOLD }
      });

      console.log(`Payment successful for order: ${orderId}`);
      return NextResponse.json({ message: 'Payment processed successfully' });
    }
    
    // Handle pending payment
    else if (payload.transaction_status === 'pending') {
      const order = await prisma.order.findUnique({
        where: { order_id: orderId },
        include: { pembayaran: true }
      });

      if (order && order.pembayaran) {
        await prisma.pembayaran.update({
          where: { payment_id: order.pembayaran.payment_id },
          data: { 
            status: 'pending',
            waktu_transaksi: new Date()
          }
        });
      }

      console.log(`Payment pending for order: ${orderId}`);
      return NextResponse.json({ message: 'Payment pending' });
    }
    
    // Handle failed payments
    else if (payload.transaction_status === 'deny' || 
             payload.transaction_status === 'cancel' || 
             payload.transaction_status === 'expire' ||
             payload.transaction_status === 'failure') {
      
      const order = await prisma.order.findUnique({
        where: { order_id: orderId },
        include: { pembayaran: true }
      });

      if (order) {
        // Update payment status
        if (order.pembayaran) {
          await prisma.pembayaran.update({
            where: { payment_id: order.pembayaran.payment_id },
            data: { 
              status: payload.transaction_status,
              waktu_transaksi: new Date()
            }
          });
        }

        // Only cancel order if it's expired, not for deny/cancel (allow retry)
        if (payload.transaction_status === 'expire') {
          await prisma.order.update({
            where: { order_id: orderId },
            data: { status: OrderStatus.CANCELLED }
          });
        }
      }
      
      console.log(`Payment ${payload.transaction_status} for order: ${orderId}`);
      return NextResponse.json({ message: `Payment ${payload.transaction_status}` });
    }

    console.log(`Unhandled transaction status: ${payload.transaction_status} for order: ${orderId}`);
    return NextResponse.json({ message: 'Notification received' });
    
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}