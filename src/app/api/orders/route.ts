import { NextRequest, NextResponse } from 'next/server'
import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { z } from 'zod'
import { createSnapInstance } from '@/lib/midtrans';
import { OrderStatus } from "@prisma/client";

// Validation Schema for orders
const OrderSchema = z.object({
  user_id: z.string().uuid("Invalid user ID"),
  event_id: z.string().uuid("Invalid event ID"),
  tiket_type_id: z.string().uuid("Invalid ticket type ID"),
  quantity: z.number().int().positive("Quantity must be positive"),
  jumlah_total: z.number().positive("Total amount must be positive"),
  buyer_info: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone is required")
  }),
  payment_method: z.string().min(1, "Payment method is required")
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = OrderSchema.parse(body)

    // Begin a transaction
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Check if ticket type exists and has enough availability
      const ticketType = await tx.tipeTiket.findUnique({
        where: { tiket_type_id: validatedData.tiket_type_id }
      })

      if (!ticketType) {
        throw new Error('Ticket type not found')
      }

      if (ticketType.jumlah_tersedia < validatedData.quantity) {
        throw new Error('Not enough tickets available')
      }

      // Update jumlah_tersedia by subtracting the quantity being purchased
      await tx.tipeTiket.update({
        where: { tiket_type_id: validatedData.tiket_type_id },
        data: {
          jumlah_tersedia: ticketType.jumlah_tersedia - validatedData.quantity
        }
      });
      
      // Get event information for payment description
      const event = await tx.event.findUnique({
        where: { event_id: validatedData.event_id }
      });
      
      if (!event) {
        throw new Error('Event not found');
      }

      // 2. Create the order with PENDING status
      const order = await tx.order.create({
        data: {
          user_id: validatedData.user_id,
          jumlah_total: validatedData.jumlah_total,
          status: OrderStatus.PENDING, // Mulai dengan PENDING
        }
      })

      // 3. Create the tickets with AVAILABLE status initially
      const tickets = [];
      for (let i = 0; i < validatedData.quantity; i++) {
        const ticket = await tx.tiket.create({
          data: {
            tiket_type_id: validatedData.tiket_type_id,
            order_id: order.order_id,
            status: 'AVAILABLE', // Ubah dari 'SOLD' ke 'AVAILABLE'
            kode_qr: `TICKET-${Date.now()}-${i}` // Generate a simple QR code reference
          }
        })
        tickets.push(ticket)
      }

      // 4. Create payment record with PENDING status
      const payment = await tx.pembayaran.create({
        data: {
          order_id: order.order_id,
          jumlah: validatedData.jumlah_total,
          status: 'PENDING', // Ubah dari 'PAID' ke 'PENDING'
        }
      })

      // 5. Create invoice
      const invoiceNumber = `INV-${Date.now()}`;
      const invoice = await tx.invoice.create({
        data: {
          pembayaran_id: payment.payment_id,
          nomor_invoice: invoiceNumber,
          jumlah: validatedData.jumlah_total,
        }
      })

      // 6. Generate Midtrans Snap token
      const snap = createSnapInstance();
      
      // Calculate the exact amount
      const price = Number(ticketType.harga);
      const quantity = validatedData.quantity;
      const total = price * quantity;
      
      // Make sure the ticket name is not too long (max 50 characters)
      const ticketName = ticketType.nama.length > 20 
        ? ticketType.nama.substring(0, 20) 
        : ticketType.nama;
      
      const eventName = event.nama_event.length > 20
        ? event.nama_event.substring(0, 20)
        : event.nama_event;
        
      const itemName = `${ticketName} - ${eventName}`;
      
      const parameter = {
        transaction_details: {
          order_id: order.order_id,
          gross_amount: Math.round(total) // Ensure it's an integer
        },
        item_details: [{
          id: ticketType.tiket_type_id,
          price: Math.round(price), // Ensure it's an integer
          quantity: quantity,
          name: itemName
        }],
        customer_details: {
          first_name: validatedData.buyer_info.name,
          email: validatedData.buyer_info.email,
          phone: validatedData.buyer_info.phone,
        },
        callbacks: {
          finish: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?order_id=${order.order_id}`,
          error: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/error?order_id=${order.order_id}`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/pending?order_id=${order.order_id}`
        }
      };

      console.log('Midtrans parameter:', JSON.stringify(parameter));

      const snapResponse = await snap.createTransaction(parameter);

      return {
        order,
        tickets,
        payment,
        invoice,
        snap_token: snapResponse.token,
        redirect_url: snapResponse.redirect_url
      }
    })

    return NextResponse.json({
      message: 'Order created successfully',
      data: result
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating order:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 })
    }

    // Add more specific error handling
    if (error.message === 'Not enough tickets available') {
      return NextResponse.json({ 
        error: 'Insufficient tickets', 
        message: 'The requested number of tickets is not available' 
      }, { status: 400 })
    }

    return NextResponse.json({ 
      error: 'Failed to create order', 
      message: error.message || 'Unknown error' 
    }, { status: 500 })
  }
}