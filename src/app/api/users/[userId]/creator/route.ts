// src/app/api/users/[userId]/creator/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const segments = url.pathname.split('/');
    // Path: /api/users/[userId]/creator
    // segments: ['', 'api', 'users', userId, 'creator']
    const userId = segments[segments.indexOf('users') + 1];

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const creator = await prisma.eventCreator.findFirst({
      where: {
        user_id: userId,
      },
      select: {
        creator_id: true,
      },
    });

    if (!creator) {
      return NextResponse.json({ error: 'Creator not found' }, { status: 404 });
    }

    return NextResponse.json(creator);
  } catch (error) {
    console.error('Error fetching creator:', error);
    return NextResponse.json(
      { error: 'Failed to fetch creator information' },
      { status: 500 }
    );
  }
}
