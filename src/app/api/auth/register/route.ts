import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, 'Nama harus minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password harus minimal 6 karakter'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email sudah terdaftar' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create new user in transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
        }
      });

      // Create pembeli (buyer) profile
      const pembeli = await tx.pembeli.create({
        data: {
          user_id: newUser.user_id,
          nama_pembeli: validatedData.name,
          jenis_kelamin: 'LAKI_LAKI', // Default value, should be provided by the form
          tanggal_lahir: new Date('2000-01-01'), // Default value, should be provided by the form
        }
      });

      return { newUser, pembeli };
    });

    // Return success response without sensitive data
    return NextResponse.json(
      { 
        message: 'Pendaftaran berhasil',
        user: { 
          id: result.newUser.user_id,
          email: result.newUser.email,
          name: result.pembeli.nama_pembeli
        } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.issues },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Pendaftaran gagal' },
      { status: 500 }
    );
  }
}