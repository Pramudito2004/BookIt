// app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// Validation Schema (reuse from previous route)
const EventSchema = z.object({
  nama_event: z.string().min(1, "Event name is required").optional(),
  deskripsi: z.string().optional(),
  lokasi: z.string().min(1, "Location is required").optional(),
  tanggal_mulai: z.string().datetime().optional(),
  tanggal_selesai: z.string().datetime().optional(),
  foto_event: z.string().optional(),
  kategori_event: z.string().min(1, "Event category is required").optional(),
  tipe_tikets: z.array(z.object({
    tiket_type_id: z.string().optional(),
    nama: z.string().min(1, "Ticket type name is required"),
    harga: z.number().positive("Price must be positive"),
    jumlah_tersedia: z.number().int().positive("Available tickets must be positive")
  })).optional()
})

export async function GET(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { event_id: params.id },
      include: {
        creator: true,
        tipe_tikets: true
      }
    })

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = EventSchema.parse(body)

    // Update event and ticket types
    const updatedEvent = await prisma.$transaction(async (prisma) => {
      // First, update the main event
      const event = await prisma.event.update({
        where: { event_id: params.id },
        data: {
          nama_event: validatedData.nama_event,
          deskripsi: validatedData.deskripsi,
          lokasi: validatedData.lokasi,
          tanggal_mulai: validatedData.tanggal_mulai,
          tanggal_selesai: validatedData.tanggal_selesai,
          foto_event: validatedData.foto_event,
          kategori_event: validatedData.kategori_event
        }
      })

      // If ticket types are provided, update or create them
      if (validatedData.tipe_tikets) {
        // Delete existing ticket types not in the new list
        await prisma.tipeTiket.deleteMany({
          where: {
            event_id: params.id,
            tiket_type_id: {
              notIn: validatedData.tipe_tikets
                .filter(t => t.tiket_type_id)
                .map(t => t.tiket_type_id!)
            }
          }
        })

        // Upsert ticket types
        for (const ticketType of validatedData.tipe_tikets) {
          await prisma.tipeTiket.upsert({
            where: { 
              tiket_type_id: ticketType.tiket_type_id || ''
            },
            update: {
              nama: ticketType.nama,
              harga: ticketType.harga,
              jumlah_tersedia: ticketType.jumlah_tersedia
            },
            create: {
              event_id: params.id,
              nama: ticketType.nama,
              harga: ticketType.harga,
              jumlah_tersedia: ticketType.jumlah_tersedia
            }
          })
        }
      }

      return event
    })

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error('Error updating event:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    await prisma.$transaction(async (prisma) => {
      // First, delete associated ticket types
      await prisma.tipeTiket.deleteMany({
        where: { event_id: params.id }
      })

      // Then delete the event
      await prisma.event.delete({
        where: { event_id: params.id }
      })
    })

    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 })
  }
}