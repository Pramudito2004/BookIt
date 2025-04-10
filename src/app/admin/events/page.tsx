// app/admin/events/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';

interface Event {
  event_id: string;
  nama_event: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  lokasi: string;
  kategori_event: string;
  foto_event?: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [page]);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/events?page=${page}&limit=10`);
      const data = await response.json();
      setEvents(data.events);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`/api/events/${eventId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          // Refresh the events list
          fetchEvents();
        } else {
          const errorData = await response.json();
          alert(`Failed to delete event: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Event Management</h1>
        <Link 
          href="/admin/events/create" 
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Create New Event
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading events...</div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div 
                key={event.event_id} 
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="relative h-48">
                  <Image 
                    src={event.foto_event || '/placeholder-event.jpg'} 
                    alt={event.nama_event}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2">{event.nama_event}</h2>
                  <div className="text-sm text-gray-600 mb-2">
                    <p>{format(new Date(event.tanggal_mulai), 'PP')} - {format(new Date(event.tanggal_selesai), 'PP')}</p>
                    <p>{event.lokasi}</p>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs">
                      {event.kategori_event}
                    </span>
                    <div className="flex space-x-2">
                      <Link 
                        href={`/admin/events/edit/${event.event_id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDeleteEvent(event.event_id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-4 py-2 rounded-lg ${
                  page === pageNum 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {pageNum}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}