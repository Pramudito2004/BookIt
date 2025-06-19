// src/app/api/auth/register/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import type { JenisKelamin, Prisma } from '@prisma/client'; 

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, 'Nama harus minimal 2 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password harus minimal 8 karakter'),
  phoneNumber: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  gender: z.enum(['MALE', 'FEMALE']),
  dateOfBirth: z.string().refine(val => !isNaN(new Date(val).getTime()), {
    message: "Tanggal lahir tidak valid"
  })
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Request body:', body); // Debug log
    
    const validatedData = registerSchema.parse(body);
    console.log('Validated data:', validatedData); // Debug log

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ 
          error: 'EMAIL_EXISTS',
          message: 'Email sudah terdaftar' 
        }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create all accounts in transaction
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create user - make sure field names match your schema exactly
      const newUser = await tx.user.create({
        data: {
          email: validatedData.email,
          password: hashedPassword,
          kontak: validatedData.phoneNumber, // This should match your schema
          jenis_kelamin: validatedData.gender as JenisKelamin,
          tanggal_lahir: new Date(validatedData.dateOfBirth),
        }
      });

      console.log('User created:', newUser); // Debug log

      // Create pembeli profile
      const pembeli = await tx.pembeli.create({
        data: {
          user_id: newUser.user_id,
          nama_pembeli: validatedData.name,
        }
      });

      console.log('Pembeli created:', pembeli); // Debug log

      // Create event creator profile
      const eventCreator = await tx.eventCreator.create({
        data: {
          user_id: newUser.user_id,
          nama_brand: validatedData.name,
          deskripsi_creator: '',
        }
      });

      console.log('Event creator created:', eventCreator); // Debug log

      return { newUser, pembeli, eventCreator };
    });

    return NextResponse.json(
      { message: 'Pendaftaran berhasil' },
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

    // More specific error handling for Prisma errors
    if (error instanceof Error && error.message.includes('Unknown argument')) {
      return NextResponse.json(
        { error: 'Database schema error. Please regenerate Prisma client.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Pendaftaran gagal' },
      { status: 500 }
    );
  }
}