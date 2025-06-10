// src\app\api\events\creator\[creatorId]\route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ creatorId: string }> }
) {
  try {
    const { creatorId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Get total count
    const total = await prisma.event.count({
      where: {
        creator_id: creatorId,
      },
    });

    // Get events for current page
    const events = await prisma.event.findMany({
      where: {
        creator_id: creatorId,
      },
      select: {
        event_id: true,
        nama_event: true,
        tanggal_mulai: true,
        tanggal_selesai: true,
        foto_event: true,
        lokasi: true,
        kategori_event: true,
      },
      orderBy: {
        tanggal_mulai: 'desc',
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}