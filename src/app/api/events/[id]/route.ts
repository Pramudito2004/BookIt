import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

// Validation Schema
const EventSchema = z.object({
  nama_event: z.string().min(1, "Event name is required"),
  deskripsi: z.string().optional(),
  kota_kabupaten: z.string().min(1, "City/Regency is required"),
  lokasi: z.string().min(1, "Location is required"),
  tanggal_mulai: z.string().datetime(),
  tanggal_selesai: z.string().datetime(),
  foto_event: z.string().optional(),
  kategori_event: z.string().min(1, "Event category is required"),
  creator_id: z.string().min(1, "Creator ID is required"),
  tipe_tikets: z
    .array(
      z.object({
        tiket_type_id: z.string().optional(),
        nama: z.string().min(1, "Ticket type name is required"),
        harga: z.number().positive("Price must be positive"),
        jumlah_tersedia: z
          .number()
          .int()
          .positive("Available tickets must be positive"),
      })
    )
    .optional(),
});

interface TiketType {
  tiket_type_id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const event = await prisma.event.findUnique({
      where: { event_id: id },
      include: {
        creator: true,
        tipe_tikets: true,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    const body = await request.json();
    console.log("Received update data:", JSON.stringify(body, null, 2));

    const validatedData = EventSchema.parse(body);

    const result = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const updatedEvent = await tx.event.update({
          where: { event_id: id },
          data: {
            nama_event: validatedData.nama_event,
            deskripsi: validatedData.deskripsi,
            kota_kabupaten: validatedData.kota_kabupaten,
            lokasi: validatedData.lokasi,
            tanggal_mulai: validatedData.tanggal_mulai,
            tanggal_selesai: validatedData.tanggal_selesai,
            foto_event: validatedData.foto_event,
            kategori_event: validatedData.kategori_event,
          },
          include: {
            tipe_tikets: true,
          },
        });

        if (validatedData.tipe_tikets && validatedData.tipe_tikets.length > 0) {
          const existingTicketIds = updatedEvent.tipe_tikets.map(
            (t: TiketType) => t.tiket_type_id
          );

          const updatedTicketIds = validatedData.tipe_tikets
            .filter((t) => t.tiket_type_id)
            .map((t) => t.tiket_type_id!);

          const ticketIdsToDelete = existingTicketIds.filter(
            (tid: string) => !updatedTicketIds.includes(tid)
          );

          if (ticketIdsToDelete.length > 0) {
            await tx.tipeTiket.deleteMany({
              where: { tiket_type_id: { in: ticketIdsToDelete } },
            });
          }

          for (const ticket of validatedData.tipe_tikets) {
            if (ticket.tiket_type_id) {
              await tx.tipeTiket.update({
                where: { tiket_type_id: ticket.tiket_type_id },
                data: {
                  nama: ticket.nama,
                  harga: ticket.harga,
                  jumlah_tersedia: ticket.jumlah_tersedia,
                },
              });
            } else {
              await tx.tipeTiket.create({
                data: {
                  event_id: id,
                  nama: ticket.nama,
                  harga: ticket.harga,
                  jumlah_tersedia: ticket.jumlah_tersedia,
                },
              });
            }
          }
        }

        return await tx.event.findUnique({
          where: { event_id: id },
          include: {
            tipe_tikets: true,
          },
        });
      }
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating event:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.tipeTiket.deleteMany({
        where: { event_id: id },
      });

      await tx.event.delete({
        where: { event_id: id },
      });
    });

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}