import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Ambil creatorId dari URL path
    const url = new URL(request.url);
    const segments = url.pathname.split("/");
    const creatorId = segments[segments.length - 1];

    // Fetch all events with their tickets and orders
    const events = await prisma.event.findMany({
      where: { creator_id: creatorId },
      include: {
        tipe_tikets: {
          include: {
            tikets: {
              include: {
                order: {
                  include: {
                    pembayaran: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    type EventWithDetails = (typeof events)[number];
    type TipeTiketWithDetails = EventWithDetails["tipe_tikets"][number];
    type TiketWithDetails = TipeTiketWithDetails["tikets"][number];

    let totalPendapatan = 0;
    let totalTiketTerjual = 0;
    let totalHargaTiket = 0;
    let jumlahTiket = 0;

    // Initialize monthly data arrays
    const monthlyData = {
      sales: new Array(12).fill(0),
      tickets: new Array(12).fill(0),
    };

    // Process each event and calculate statistics
    const eventReports = events.map((event: EventWithDetails) => {
      let eventPendapatan = 0;
      let eventTiketTerjual = 0;

      event.tipe_tikets.forEach((tipe: TipeTiketWithDetails) => {
        const soldTickets = tipe.tikets.filter(
          (tiket: TiketWithDetails) => tiket.status === "SOLD"
        );

        eventTiketTerjual += soldTickets.length;
        const tipePendapatan = Number(tipe.harga) * soldTickets.length;
        eventPendapatan += tipePendapatan;

        totalHargaTiket += Number(tipe.harga);
        jumlahTiket++;

        // Aggregate monthly data
        soldTickets.forEach((tiket: TiketWithDetails) => {
          const month = new Date(tiket.dibuat_di).getMonth();
          monthlyData.sales[month] += Number(tipe.harga);
          monthlyData.tickets[month] += 1;
        });
      });

      totalPendapatan += eventPendapatan;
      totalTiketTerjual += eventTiketTerjual;

      return {
        event_id: event.event_id,
        nama_event: event.nama_event,
        tanggal_mulai: event.tanggal_mulai,
        tanggal_selesai: event.tanggal_selesai,
        tiketTerjual: eventTiketTerjual,
        pendapatan: eventPendapatan,
        status:
          new Date(event.tanggal_selesai) < new Date()
            ? "Selesai"
            : "Berlangsung",
      };
    });

    return NextResponse.json({
      statistics: {
        totalPendapatan,
        totalTiketTerjual,
        eventAktif: events.filter(
          (e: EventWithDetails) => new Date(e.tanggal_selesai) > new Date()
        ).length,

        rataRataHargaTiket: jumlahTiket > 0 ? totalHargaTiket / jumlahTiket : 0,
      },
      events: eventReports,
      monthlyData,
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
