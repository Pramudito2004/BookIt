// src/app/api/reports/creator/[creatorId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Gunakan format parameters yang benar untuk Next.js 15
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ creatorId: string }> }
) {
  try {
    // Sekarang kita perlu await params karena itu adalah Promise
    const { creatorId } = await params;

    // Dapatkan semua event yang dibuat oleh creator
    const events = await prisma.event.findMany({
      where: {
        creator_id: creatorId
      },
      include: {
        tipe_tikets: true
      }
    });

    // Kalkulasi metrik untuk laporan
    let totalEvents = events.length;
    let totalTicketsCreated = 0;
    let totalTicketsSold = 0;
    let totalRevenue = 0;

    // Dapatkan semua ticket type dan hitung total yang tersedia
    for (const event of events) {
      if (event.tipe_tikets && Array.isArray(event.tipe_tikets)) {
        for (const ticketType of event.tipe_tikets) {
          // Periksa apakah ticketType valid dan memiliki jumlah_tersedia
          if (ticketType && typeof ticketType.jumlah_tersedia === 'number') {
            // Hitung total ticket yang dibuat
            totalTicketsCreated += ticketType.jumlah_tersedia;
            
            try {
              // Dapatkan jumlah tiket yang terjual untuk ticket type ini
              const ticketsSold = await prisma.tiket.count({
                where: {
                  tiket_type_id: ticketType.tiket_type_id,
                  status: 'SOLD'
                }
              });
              
              // Pastikan ticketsSold dan harga valid sebelum ditambahkan
              if (ticketsSold && typeof ticketsSold === 'number' && 
                  ticketType.harga && typeof ticketType.harga === 'number') {
                totalTicketsSold += ticketsSold;
                totalRevenue += ticketsSold * ticketType.harga;
              }
            } catch (err) {
              console.error(`Error counting sold tickets for type ${ticketType.tiket_type_id}:`, err);
              // Lanjutkan ke ticketType berikutnya jika terjadi error
              continue;
            }
          }
        }
      }
    }

    // Hitung tiket yang tersisa
    const remainingTickets = totalTicketsCreated - totalTicketsSold;
    
    // Dapatkan event terakhir
    const latestEvent = events.length > 0 
      ? events.sort((a, b) => {
          const dateA = a.tanggal_mulai instanceof Date ? a.tanggal_mulai : new Date(a.tanggal_mulai);
          const dateB = b.tanggal_mulai instanceof Date ? b.tanggal_mulai : new Date(b.tanggal_mulai);
          return dateB.getTime() - dateA.getTime();
        })[0]
      : null;

    // Buat summary laporan
    const report = {
      totalEvents,
      totalTicketsCreated,
      totalTicketsSold,
      totalRevenue,
      remainingTickets,
      latestEvent: latestEvent ? {
        event_id: latestEvent.event_id,
        nama_event: latestEvent.nama_event,
        tanggal_mulai: latestEvent.tanggal_mulai,
        lokasi: latestEvent.lokasi
      } : null,
      ticketSalesPercentage: totalTicketsCreated > 0 
        ? Math.round((totalTicketsSold / totalTicketsCreated) * 100) 
        : 0
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}