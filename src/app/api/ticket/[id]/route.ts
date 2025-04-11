// src/app/api/tickets/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ticketId = params.id;
    
    // This is a mock implementation. In a real app, you would:
    // 1. Connect to your database
    // 2. Query for the ticket with the given ID
    // 3. Return the ticket data or a 404 if not found
    
    // For testing purposes, let's return a mock ticket
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
          tanggal_selesai: new Date(Date.now() + 86400000).toISOString(), // 1 day later
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