import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createSnapInstance } from "@/lib/midtrans";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params;

    // Get order details with all necessary relations
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
        user: {
          include: {
            pembeli: true
          }
        }
      }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "PENDING") {
      return NextResponse.json({ error: "Order is not pending" }, { status: 400 });
    }

    // Create Snap instance
    const snap = createSnapInstance();

    // Get ticket and event details from the first ticket
    const ticket = order.tikets[0];
    const ticketType = ticket.tipe_tiket;
    const event = ticketType.event;

    // Prepare transaction parameters
    const parameter = {
      transaction_details: {
        order_id: order.order_id,
        gross_amount: Number(order.jumlah_total)
      },
      item_details: [{
        id: ticketType.tiket_type_id,
        price: Number(ticketType.harga),
        quantity: order.tikets.length,
        name: `${ticketType.nama} - ${event.nama_event}`.substring(0, 50)
      }],
      customer_details: {
        first_name: order.user.pembeli?.nama_pembeli || order.user.email,
        email: order.user.email,
      },
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?order_id=${orderId}`,
        error: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/error?order_id=${orderId}`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/pending?order_id=${orderId}`
      }
    };

    // Generate new token
    const transaction = await snap.createTransaction(parameter);

    return NextResponse.json({
      token: transaction.token,
      redirect_url: transaction.redirect_url
    });

  } catch (error) {
    console.error("Error generating payment token:", error);
    return NextResponse.json(
      { error: "Failed to generate payment token" },
      { status: 500 }
    );
  }
}