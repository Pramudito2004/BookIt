// app/admin/events/create/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';

// Use the same validation schema from the backend
const EventSchema = z.object({
  nama_event: z.string().min(1, "Event name is required"),
  deskripsi: z.string().optional(),
  lokasi: z.string().min(1, "Location is required"),
  tanggal_mulai: z.string().transform((val) => new Date(val).toISOString()),
  tanggal_selesai: z.string().transform((val) => new Date(val).toISOString()),
  foto_event: z.string().optional(),
  kategori_event: z.string().min(1, "Event category is required"),
  creator_id: z.string().min(1, "Creator ID is required"),
  tipe_tikets: z.array(z.object({
    nama: z.string().min(1, "Ticket type name is required"),
    harga: z.number().positive("Price must be positive"),
    jumlah_tersedia: z.number().int().positive("Available tickets must be positive")
  })).optional()
});

export default function CreateEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama_event: '',
    deskripsi: '',
    lokasi: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    foto_event: '',
    kategori_event: '',
    creator_id: '550e8400-e29b-41d4-a716-446655440000',
    tipe_tikets: [{ nama: '', harga: 0, jumlah_tersedia: 0 }]
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTicketChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedTickets = [...formData.tipe_tikets];
    updatedTickets[index] = {
      ...updatedTickets[index],
      [name]: name === 'harga' || name === 'jumlah_tersedia' ? Number(value) : value
    };
    setFormData(prev => ({
      ...prev,
      tipe_tikets: updatedTickets
    }));
  };

  const addTicketType = () => {
    setFormData(prev => ({
      ...prev,
      tipe_tikets: [
        ...prev.tipe_tikets,
        { nama: '', harga: 0, jumlah_tersedia: 0 }
      ]
    }));
  };

  const removeTicketType = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tipe_tikets: prev.tipe_tikets.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const parsedData = EventSchema.parse(formData);

      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parsedData)
      });      

      if (response.ok) {
        // Redirect to events list
        router.push('/admin/events');
      } else {
        // Handle error
        const errorData = await response.json();
        console.error('Error creating event:', errorData);
        alert('Failed to create event');
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errorMap: { [key: string]: string } = {};
        error.errors.forEach(err => {
          errorMap[err.path[0]] = err.message;
        });
        setErrors(errorMap);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Event</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
        {/* Basic Event Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Event Name</label>
            <input
              type="text"
              name="nama_event"
              value={formData.nama_event}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            {errors.nama_event && <p className="text-red-500 text-sm">{errors.nama_event}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Location</label>
            <input
              type="text"
              name="lokasi"
              value={formData.lokasi}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            {errors.lokasi && <p className="text-red-500 text-sm">{errors.lokasi}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Start Date</label>
            <input
              type="datetime-local"
              name="tanggal_mulai"
              value={formData.tanggal_mulai}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            {errors.tanggal_mulai && <p className="text-red-500 text-sm">{errors.tanggal_mulai}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">End Date</label>
            <input
              type="datetime-local"
              name="tanggal_selesai"
              value={formData.tanggal_selesai}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            {errors.tanggal_selesai && <p className="text-red-500 text-sm">{errors.tanggal_selesai}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Event Category</label>
            <input
              type="text"
              name="kategori_event"
              value={formData.kategori_event}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            {errors.kategori_event && <p className="text-red-500 text-sm">{errors.kategori_event}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Event Image URL</label>
            <input
              type="text"
              name="foto_event"
              value={formData.foto_event}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            rows={4}
          />
        </div>

        {/* Ticket Types */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Ticket Types</h2>
            <button
              type="button"
              onClick={addTicketType}
              className="bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700"
            >
              Add Ticket Type
            </button>
          </div>

          {formData.tipe_tikets.map((ticket, index) => (
            <div key={index} className="grid md:grid-cols-3 gap-4 mb-4 p-4 border rounded-lg">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Ticket Name</label>
                <input
                  type="text"
                  name="nama"
                  value={ticket.nama}
                  onChange={(e) => handleTicketChange(index, e)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Price (IDR)</label>
                <input
                  type="number"
                  name="harga"
                  value={ticket.harga}
                  onChange={(e) => handleTicketChange(index, e)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Available Tickets</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    name="jumlah_tersedia"
                    value={ticket.jumlah_tersedia}
                    onChange={(e) => handleTicketChange(index, e)}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                  {formData.tipe_tikets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTicketType(index)}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-right">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
}