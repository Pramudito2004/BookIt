"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { z } from 'zod';
import Link from 'next/link';

// Use the same validation schema from the backend but with proper date handling
const EventSchema = z.object({
  nama_event: z.string().min(1, "Event name is required"),
  deskripsi: z.string().optional(),
  lokasi: z.string().min(1, "Location is required"),
  tanggal_mulai: z.string().transform(val => new Date(val).toISOString()),
  tanggal_selesai: z.string().transform(val => new Date(val).toISOString()),
  foto_event: z.string().optional(),
  kategori_event: z.string().min(1, "Event category is required"),
  creator_id: z.string().min(1, "Creator ID is required"),
  tipe_tikets: z.array(z.object({
    tiket_type_id: z.string().optional(),
    nama: z.string().min(1, "Ticket type name is required"),
    harga: z.number().positive("Price must be positive"),
    jumlah_tersedia: z.number().int().positive("Available tickets must be positive")
  })).optional()
});

interface Ticket {
  tiket_type_id?: string;
  nama: string;
  harga: number;
  jumlah_tersedia: number;
}

interface Event {
  event_id: string;
  nama_event: string;
  deskripsi: string;
  lokasi: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  foto_event?: string;
  kategori_event: string;
  creator_id: string;
  tipe_tikets: Ticket[];
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formData, setFormData] = useState<Event>({
    event_id: '',
    nama_event: '',
    deskripsi: '',
    lokasi: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    foto_event: '',
    kategori_event: '',
    creator_id: '',
    tipe_tikets: [{ nama: '', harga: 0, jumlah_tersedia: 0 }]
  });

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/events/${eventId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch event');
        }
        
        const eventData = await response.json();
        
        // Format dates for datetime-local input
        const formattedData = {
          ...eventData,
          tanggal_mulai: formatDateTimeForInput(eventData.tanggal_mulai),
          tanggal_selesai: formatDateTimeForInput(eventData.tanggal_selesai),
        };
        
        // Ensure tipe_tikets exists and values are numbers
        if (!formattedData.tipe_tikets || formattedData.tipe_tikets.length === 0) {
          formattedData.tipe_tikets = [{ nama: '', harga: 0, jumlah_tersedia: 0 }];
        } else {
          // Ensure harga and jumlah_tersedia are numbers
          formattedData.tipe_tikets = formattedData.tipe_tikets.map((ticket: Ticket) => ({
            ...ticket,
            harga: Number(ticket.harga),
            jumlah_tersedia: Number(ticket.jumlah_tersedia)
          }));
        }
        
        setFormData(formattedData);
      } catch (error) {
        console.error('Error fetching event:', error);
        alert('Failed to load event data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEvent();
  }, [eventId]);

  const formatDateTimeForInput = (dateString: string) => {
    const date = new Date(dateString);
    // Format as YYYY-MM-DDThh:mm
    return date.toISOString().slice(0, 16);
  };

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
    
    // Convert values to correct type
    const processedValue = name === 'harga' || name === 'jumlah_tersedia' 
      ? Number(value) // Ensure numerical values
      : value;
    
    updatedTickets[index] = {
      ...updatedTickets[index],
      [name]: processedValue
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
    setIsSaving(true);
    setErrors({});
    
    try {
      // Prepare data for submission - ensure all numbers are really numbers
      const submitData = {
        nama_event: formData.nama_event,
        deskripsi: formData.deskripsi || "",
        lokasi: formData.lokasi,
        tanggal_mulai: formData.tanggal_mulai,
        tanggal_selesai: formData.tanggal_selesai,
        foto_event: formData.foto_event || "",
        kategori_event: formData.kategori_event,
        creator_id: formData.creator_id,
        tipe_tikets: formData.tipe_tikets.map(ticket => ({
          tiket_type_id: ticket.tiket_type_id,
          nama: ticket.nama,
          harga: Number(ticket.harga), // Ensure it's a number
          jumlah_tersedia: Number(ticket.jumlah_tersedia) // Ensure it's a number
        }))
      };

      // Debug output before validation
      console.log("Pre-validation data:", JSON.stringify(submitData, null, 2));
      
      // Check types before validation
      submitData.tipe_tikets.forEach((ticket, index) => {
        console.log(`Ticket ${index} harga type:`, typeof ticket.harga);
        console.log(`Ticket ${index} jumlah_tersedia type:`, typeof ticket.jumlah_tersedia);
      });

      // Validate data
      const parsedData = EventSchema.parse(submitData);
      
      // Debug output to console after validation
      console.log("Submitting data:", JSON.stringify(parsedData, null, 2));

      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parsedData)
      });      

      const responseData = await response.json();
      
      if (response.ok) {
        // Show success message
        alert('Event updated successfully!');
        // Redirect to events list
        router.push('/admin/events');
      } else {
        // Handle error
        console.error('Error updating event:', responseData);
        alert(`Failed to update event: ${responseData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error in update:', error);
      
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errorMap: { [key: string]: string } = {};
        error.errors.forEach(err => {
          const path = err.path.join('.');
          errorMap[path] = `${path}: ${err.message}`;
          console.error(`Validation error at ${path}:`, err);
        });
        setErrors(errorMap);
        alert(`Validation failed: ${Object.values(errorMap).join(', ')}`);
      } else {
        console.error('Unexpected error:', error);
        alert('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Edit Event</h1>
        <Link 
          href="/admin/events" 
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back to Events
        </Link>
      </div>
      
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
              value={formData.foto_event || ''}
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
            value={formData.deskripsi || ''}
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
                {errors[`tipe_tikets.${index}.harga`] && (
                  <p className="text-red-500 text-sm">{errors[`tipe_tikets.${index}.harga`]}</p>
                )}
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
                  {errors[`tipe_tikets.${index}.jumlah_tersedia`] && (
                    <p className="text-red-500 text-sm">{errors[`tipe_tikets.${index}.jumlah_tersedia`]}</p>
                  )}
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
              {/* Add hidden input for ticket type ID if exists */}
              {ticket.tiket_type_id && (
                <input 
                  type="hidden" 
                  name="tiket_type_id" 
                  value={ticket.tiket_type_id} 
                />
              )}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-between">
          <Link
            href="/admin/events"
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className={`${
              isSaving ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white px-6 py-3 rounded-lg transition-colors flex items-center`}
          >
            {isSaving ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                Updating...
              </>
            ) : (
              'Update Event'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}