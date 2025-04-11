// src/app/api/tickets/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticketId = params.id;
    
    // Ini implementasi sementara
    // Seharusnya kamu mengambil data ticket dari database
    const mockTicket = {
      tiket_id: ticketId,
      tiket_type_id: "type-123",
      order_id: "order-456",
      status: "BOOKED",
      kode_qr: `TICKET-${ticketId.substring(0, 8)}`,
      dibuat_di: new Date().toISOString(),
      tipe_tiket: {
        nama: "VIP Pass",
        harga: 450000,
        event: {
          event_id: "event-789",
          nama_event: "Concert Event",
          lokasi: "Jakarta Convention Center",
          tanggal_mulai: new Date().toISOString(),
          tanggal_selesai: new Date(Date.now() + 86400000).toISOString(),
          foto_event: "/api/placeholder/500/300"
        }
      },
      order: {
        jumlah_total: 450000,
        status: "COMPLETED",
        buyer_info: {
          name: "Test User",
          email: "test@example.com"
        },
        created_at: new Date().toISOString()
      }
    };

    return NextResponse.json({ ticket: mockTicket }, { status: 200 });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { error: "Failed to fetch ticket details" },
      { status: 500 }
    );
  }
}