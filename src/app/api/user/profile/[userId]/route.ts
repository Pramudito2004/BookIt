// app/api/user/profile/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Fetch user profile
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        user_id: userId,
        deleted_at: null, // Only get non-deleted users
      },
      include: {
        pembeli: true,
        event_creator: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const body = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { nama, email, kontak, jenis_kelamin, tanggal_lahir } = body;

    // Validate required fields
    if (!nama || !email || !jenis_kelamin) {
      return NextResponse.json(
        { error: 'Name, email, and gender are required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        user_id: userId,
        deleted_at: null,
      },
      include: {
        pembeli: true,
        event_creator: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if email is already taken by another user
    if (email !== existingUser.email) {
      const emailExists = await prisma.user.findFirst({
        where: {
          email: email,
          user_id: {
            not: userId,
          },
          deleted_at: null,
        },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Email is already taken' },
          { status: 400 }
        );
      }
    }

    // Start transaction to update user and related data
    const updatedUser = await prisma.$transaction(async (tx) => {
      // Update user basic info
      const user = await tx.user.update({
        where: { user_id: userId },
        data: {
          email,
          kontak,
          jenis_kelamin,
          tanggal_lahir: tanggal_lahir ? new Date(tanggal_lahir) : undefined,
        },
      });

      // Update pembeli name if exists
      if (existingUser.pembeli) {
        await tx.pembeli.update({
          where: { user_id: userId },
          data: {
            nama_pembeli: nama,
          },
        });
      }

      // Update event creator name if exists
      if (existingUser.event_creator) {
        await tx.eventCreator.update({
          where: { user_id: userId },
          data: {
            nama_brand: nama,
          },
        });
      }

      // Return updated user with relations
      return await tx.user.findUnique({
        where: { user_id: userId },
        include: {
          pembeli: true,
          event_creator: true,
        },
      });
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete user (mark as deleted)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: {
        user_id: userId,
        deleted_at: null,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Soft delete user
    const deletedUser = await prisma.user.update({
      where: { user_id: userId },
      data: {
        deleted_at: new Date(),
      },
    });

    return NextResponse.json({
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}