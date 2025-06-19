import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { ticketCode } = await request.json();

    if (!ticketCode) {
      return NextResponse.json(
        { valid: false, message: 'Ticket code is required' },
        { status: 400 }
      );
    }

    const ticket = await prisma.tiket.findFirst({
      where: { kode_qr: ticketCode },
      include: {
        tipe_tiket: {
          include: {
            event: true
          }
        },
        order: {
          include: {
            user: true
          }
        }
      }
    });

    if (!ticket) {
      return NextResponse.json(
        { valid: false, message: 'Invalid ticket code' },
        { status: 404 }
      );
    }

    // ✅ CEK apakah sudah digunakan
    if (ticket.is_used) {
      return NextResponse.json({
        valid: false,
        message: 'This ticket has already been used'
      });
    }

    // ✅ Tandai sebagai sudah digunakan
    await prisma.tiket.update({
      where: { tiket_id: ticket.tiket_id },
      data: { is_used: true }
    });

    return NextResponse.json({
      valid: true,
      message: 'Ticket is valid',
      details: {
        eventName: ticket.tipe_tiket.event.nama_event,
        eventLocation: ticket.tipe_tiket.event.lokasi,
        ticketType: ticket.tipe_tiket.nama,
        buyerName: ticket.order.user.email,
        purchaseDate: ticket.dibuat_di,
        status: ticket.order.status
      }
    });

  } catch (error) {
    console.error('Ticket verification error:', error);
    return NextResponse.json(
      { valid: false, message: 'Ticket verification failed' },
      { status: 500 }
    );
  }
}