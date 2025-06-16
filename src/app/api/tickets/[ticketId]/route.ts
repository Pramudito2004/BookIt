// src/app/api/tickets/[ticketId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const segments = url.pathname.split('/');
    const ticketId = segments[segments.length - 1];

    if (!ticketId) {
      return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
    }

    const ticket = await prisma.tiket.findUnique({
      where: { tiket_id: ticketId },
      include: {
        tipe_tiket: {
          include: {
            event: true,
          },
        },
        order: {
          include: {
            pembayaran: true,
          }
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    // Update ticket status if payment is settled
    if (ticket.order.pembayaran?.status === 'settlement') {
      await prisma.tiket.update({
        where: { tiket_id: ticketId },
        data: { status: 'SOLD' }
      });
      ticket.status = 'SOLD';
    }

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json({ error: 'Failed to fetch ticket' }, { status: 500 });
  }
}

// PUT handler - update ticket info
export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const segments = url.pathname.split('/');
    const ticketId = segments[segments.length - 1];

    if (!ticketId) {
      return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
    }

    const body = await request.json();

    // Example: update status and some other fields (adjust as needed)
    const updatedTicket = await prisma.tiket.update({
      where: { tiket_id: ticketId },
      data: {
        status: body.status,
        // add other fields to update here if needed
      },
    });

    return NextResponse.json({ updatedTicket });
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}

// DELETE handler - delete ticket
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const segments = url.pathname.split('/');
    const ticketId = segments[segments.length - 1];

    if (!ticketId) {
      return NextResponse.json({ error: 'Ticket ID is required' }, { status: 400 });
    }

    await prisma.tiket.delete({
      where: { tiket_id: ticketId },
    });

    return NextResponse.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error deleting ticket:', error);
    return NextResponse.json({ error: 'Failed to delete ticket' }, { status: 500 });
  }
}
