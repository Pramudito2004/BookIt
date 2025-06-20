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
    const coreApi = createCoreApiInstance();
    const status = await coreApi.transaction.status(orderId);

    // Update status berdasarkan response
    if (status.transaction_status === "settlement") {
      await prisma.order.update({
        where: { order_id: orderId },
        data: { status: OrderStatus.PAID },
      });
    } else if (["deny", "cancel", "expire"].includes(status.transaction_status)) {
      await prisma.order.update({
        where: { order_id: orderId },
        data: { status: OrderStatus.CANCELLED },
      });
    }

    return NextResponse.json(status);
  } catch (error) {
    console.error("Error checking payment status:", error);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    );
  }
}