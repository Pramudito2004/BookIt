"use client";

import Link from 'next/link';
import { useState } from 'react';
import Sidebar from '@/app/components/sidebar';


export default function EventSayaPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('events');
  const [activeEventTab, setActiveEventTab] = useState('active');

  // Mock data for events
  const activeEvents = [
    { id: 1, title: "Konser Band Indie", date: "15 Juni 2024", status: "active" },
    { id: 2, title: "Workshop Digital Marketing", date: "20 Juni 2024", status: "active" },
  ];

  const draftEvents = [
    { id: 3, title: "Seminar Kewirausahaan", date: "Draft", status: "draft" },
  ];

  const pastEvents = [
    { id: 4, title: "Festival Musik Jazz", date: "10 Mei 2024", status: "past" },
    { id: 5, title: "Bazaar UMKM", date: "5 April 2024", status: "past" },
  ];

  const currentEvents = activeEventTab === 'active' 
    ? activeEvents 
    : activeEventTab === 'draft' 
      ? draftEvents 
      : pastEvents;

  return (
    <div className="flex h-screen bg-gray-100">
          <Sidebar />
          
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Mobile header */}
            <header className="lg:hidden bg-white shadow-sm">
              <div className="flex items-center justify-between p-4">
                <button 
                  onClick={() => setMobileMenuOpen(true)}
                  className="text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-xl font-semibold text-gray-800">Pengaturan</h1>
                <div className="w-6"></div>
              </div>
            </header>
    
      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden lg:ml-0`}>
      {/* Mobile header */}
        <header className="lg:hidden bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="text-gray-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Event Saya</h1>
            <div className="w-6"></div> {/* Spacer for alignment */}
          </div>
        </header>

        { }
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          <div className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Cari Event Saya</h1>
              <Link 
                href="/organizer/create-event" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
              >
                Buat Event
              </Link>
            </div>

            <div className="mb-6">
              <div className="flex space-x-4 border-b border-gray-200">
                <button 
                  onClick={() => setActiveEventTab('active')}
                  className={`px-4 py-2 font-medium ${
                    activeEventTab === 'active' 
                      ? 'text-indigo-600 border-b-2 border-indigo-600' 
                      : 'text-gray-500 hover:text-indigo-600'
                  }`}
                >
                  EVENT AKTIF
                </button>
                <button 
                  onClick={() => setActiveEventTab('draft')}
                  className={`px-4 py-2 font-medium ${
                    activeEventTab === 'draft' 
                      ? 'text-indigo-600 border-b-2 border-indigo-600' 
                      : 'text-gray-500 hover:text-indigo-600'
                  }`}
                >
                  EVENT DRAF
                </button>
                <button 
                  onClick={() => setActiveEventTab('past')}
                  className={`px-4 py-2 font-medium ${
                    activeEventTab === 'past' 
                      ? 'text-indigo-600 border-b-2 border-indigo-600' 
                      : 'text-gray-500 hover:text-indigo-600'
                  }`}
                >
                  EVENT LALU
                </button>
              </div>
            </div>

            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Menampilkan {currentEvents.length} event
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Urutkan:</span>
                <select className="border border-gray-300 rounded-md px-3 py-1 text-sm">
                  <option>Waktu Mulai (Terdekat)</option>
                  <option>Waktu Mulai (Terjauh)</option>
                  <option>Nama Event (A-Z)</option>
                  <option>Nama Event (Z-A)</option>
                </select>
              </div>
            </div>

            {/* Events Section */}
            <div className="mb-8">
              {currentEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentEvents.map((event) => (
                    <div key={event.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="bg-gray-100 h-40"></div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{event.date}</p>
                        <div className="flex justify-between items-center">
                          <span className={`${
                            event.status === 'active' ? 'bg-green-100 text-green-800' :
                            event.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          } text-xs px-2 py-1 rounded`}>
                            {event.status === 'active' ? 'Aktif' : 
                             event.status === 'draft' ? 'Draft' : 'Selesai'}
                          </span>
                          <Link 
                            href={`/organizer/event/${event.id}`} 
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            Kelola
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-8 text-center">
                  <p className="text-gray-500 mb-4">
                    Hai, terima kasih telah menggunakan layanan LOKET
                  </p>
                  <p className="text-gray-500">
                    Silakan buat eventmu dengan klik button "Buat Event" di atas.
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
    </div>

  );
}