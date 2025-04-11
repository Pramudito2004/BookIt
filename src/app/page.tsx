// src\app\page.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { format } from "date-fns";

// Define the Event interface based on your API response
interface Event {
  event_id: string;
  nama_event: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  lokasi: string;
  kategori_event: string;
  foto_event?: string;
  deskripsi?: string;
  tipe_tikets?: Array<{
    nama: string;
    harga: number;
    jumlah_tersedia: number;
  }>;
}

export default function HomePage() {
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // States
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeCity, setActiveCity] = useState("All Cities");

  // Categories from your system
  const categories = [
    { name: "All", icon: "🌟" },
    { name: "Music", icon: "🎵" },
    { name: "Sports", icon: "⚽" },
    { name: "Exhibitions", icon: "🖼️" },
    { name: "Theater", icon: "🎭" },
    { name: "Education", icon: "📚" },
    { name: "Food & Beverage", icon: "🍔" },
    { name: "Fashion", icon: "👗" },
    { name: "Wellness", icon: "🧘" },
  ];

  const cities = [
    "All Cities",
    "Jakarta",
    "Surabaya",
    "Bandung",
    "Yogyakarta",
    "Bali",
    "Medan",
    "Makassar",
    "Semarang",
  ];

  // Fetch events when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch events from API
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      // Fetch all events with larger limit to have enough data
      const response = await fetch('/api/events?limit=20');
      const data = await response.json();
      
      if (data.events && data.events.length > 0) {
        // Sort events by date (newest first)
        const sortedEvents = [...data.events].sort((a, b) => 
          new Date(a.tanggal_mulai).getTime() - new Date(b.tanggal_mulai).getTime()
        );
        
        // Take 4 events for featured slider (or less if we don't have enough)
        setFeaturedEvents(sortedEvents.slice(0, Math.min(4, sortedEvents.length)));
        
        // Take up to 6 events for the upcoming events section
        setUpcomingEvents(sortedEvents.slice(0, Math.min(6, sortedEvents.length)));
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter events by category
  const filterByCategory = (category: string) => {
    setActiveCategory(category);
    filterEvents(category, activeCity);
  };

  // Filter events by city
  const filterByCity = (city: string) => {
    setActiveCity(city);
    filterEvents(activeCategory, city);
  };

  // Apply both filters
  const filterEvents = async (category: string, city: string) => {
    setIsLoading(true);
    try {
      // Base URL
      let url = '/api/events?limit=20';
      
      // Add filters if needed (you'll need to implement these filters in your API)
      // This is a simplified example - your actual API might need different parameters
      if (category !== "All") {
        url += `&category=${encodeURIComponent(category)}`;
      }
      
      if (city !== "All Cities") {
        url += `&city=${encodeURIComponent(city)}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.events && data.events.length > 0) {
        setUpcomingEvents(data.events.slice(0, Math.min(6, data.events.length)));
      } else {
        setUpcomingEvents([]);
      }
    } catch (error) {
      console.error('Failed to filter events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-sliding every 2 seconds for featured events
  useEffect(() => {
    if (featuredEvents.length === 0) return;
    
    const interval = setInterval(() => {
      const nextSlide =
        currentSlide === featuredEvents.length - 1 ? 0 : currentSlide + 1;
      setCurrentSlide(nextSlide);

      // Scroll the slider smoothly
      if (sliderRef.current) {
        const scrollAmount = sliderRef.current.offsetWidth;
        sliderRef.current.scrollTo({
          left: scrollAmount * nextSlide,
          behavior: "smooth",
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentSlide, featuredEvents.length]);

  // Get ticket price range text
  const getTicketPriceText = (event: Event) => {
    if (!event.tipe_tikets || event.tipe_tikets.length === 0) {
      return "Gratis";
    }
    
    const prices = event.tipe_tikets.map(ticket => ticket.harga);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    
    if (minPrice === maxPrice) {
      return `Rp ${minPrice.toLocaleString('id-ID')}`;
    }
    
    return `Rp ${minPrice.toLocaleString('id-ID')} - ${maxPrice.toLocaleString('id-ID')}`;
  };

  // Format date for display
  const formatEventDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start.toDateString() === end.toDateString()) {
      return format(start, 'dd MMMM yyyy');
    }
    
    return `${format(start, 'dd')} - ${format(end, 'dd MMMM yyyy')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Header with modern gradient background */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 pt-16 relative">
        {/* Search Bar Section with improved aesthetics */}
        <div className="container mx-auto px-4 py-8 pb-16">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h1 className="text-2xl md:text-4xl font-bold mb-3 text-white">
              Temukan Event Menarik di Sekitarmu
            </h1>
            <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto">
              Jelajahi ratusan event konser, workshop, pameran, dan festival di
              seluruh Indonesia
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-2xl p-4 max-w-3xl mx-auto transform translate-y-6">
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0">
              <div className="flex-grow md:mr-2 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Cari event, konser, pameran..."
                  className="w-full pl-10 pr-4 py-3 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-md">
                Cari
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Auto-sliding carousel with background image */}
      {featuredEvents.length > 0 && (
        <div className="mt-20 mb-12 overflow-hidden">
          <div className="container mx-auto px-4 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <svg
                className="w-6 h-6 mr-2 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                ></path>
              </svg>
              Featured Events
            </h2>
            <div ref={sliderRef} className="flex overflow-x-hidden scroll-smooth">
              {featuredEvents.map((event, index) => (
                <div
                  key={event.event_id}
                  className="min-w-full md:min-w-[50%] lg:min-w-[100%] flex-shrink-0 px-2 relative h-72 rounded-xl overflow-hidden"
                >
                  {/* Background image */}
                  <Image
                    src={event.foto_event || '/placeholder-event.jpg'}
                    alt={event.nama_event}
                    fill
                    className="object-cover"
                  />
                  {/* Gradient overlay for better text visibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                  {/* Content slider */}
                  <div className="relative z-10 flex flex-col justify-end h-full p-8 text-white">
                    <h3 className="text-2xl font-bold mb-2">{event.nama_event}</h3>
                    <p className="text-white/90 mb-6 max-w-lg">
                      {event.deskripsi?.slice(0, 120) || `${event.kategori_event} event in ${event.lokasi}`}
                      {event.deskripsi && event.deskripsi.length > 120 ? '...' : ''}
                    </p>
                    <div className="flex">
                      <Link href={`/ticket/${event.event_id}`}>
                        <button className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-2.5 rounded-full font-medium transition-all duration-300 shadow-lg">
                          Learn more
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              {featuredEvents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index);
                    if (sliderRef.current) {
                      const scrollAmount = sliderRef.current.offsetWidth;
                      sliderRef.current.scrollTo({
                        left: scrollAmount * index,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className={`w-3 h-3 mx-1 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "bg-indigo-600 scale-110"
                      : "bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Category Chips - Enhanced */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex overflow-x-auto pb-2 -mx-2 scrollbar-hide">
          {categories.map((category, index) => (
            <div key={index} className="flex-shrink-0 px-2">
              <button 
                className={`flex items-center space-x-2 ${
                  activeCategory === category.name 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-200 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600'
                } rounded-full px-5 py-2.5 text-sm transition-all duration-200 shadow-sm`}
                onClick={() => filterByCategory(category.name)}
              >
                <span className="text-xl">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Location Filter - Enhanced */}
      <div className="container mx-auto px-4 pb-6">
        <div className="flex overflow-x-auto pb-2 -mx-2 scrollbar-hide">
          {cities.map((city, index) => (
            <div key={index} className="flex-shrink-0 px-2">
              <button 
                className={`flex items-center space-x-1 ${
                  activeCity === city
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                    : 'bg-white text-gray-800 border border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
                } rounded-full px-5 py-2.5 text-sm transition-all duration-200 font-medium shadow-sm`}
                onClick={() => filterByCity(city)}
              >
                <span>{city}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Event Cards - Enhanced with Click Navigation */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <svg
            className="w-6 h-6 mr-2 text-indigo-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Upcoming Events
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mb-1">No events found</h3>
            <p className="text-gray-500">Try changing your filters or check back later</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <Link
                key={event.event_id}
                href={`/ticket/${event.event_id}`}
                className="block group"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full">
                  <div className="relative h-48">
                    <Image
                      src={event.foto_event || '/placeholder-event.jpg'}
                      alt={event.nama_event}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-0 left-0 m-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                      {event.kategori_event}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-800 group-hover:text-indigo-600 transition-colors">
                      {event.nama_event}
                    </h3>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-4 h-4 mr-2 text-indigo-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {formatEventDate(event.tanggal_mulai, event.tanggal_selesai)}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm mb-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-4 h-4 mr-2 text-indigo-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {event.lokasi}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-indigo-600">
                        {getTicketPriceText(event)}
                      </span>
                      <div className="px-4 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-medium group-hover:from-indigo-700 group-hover:to-purple-700 transition-all duration-300 shadow-md">
                        View Details
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link href="/events">
            <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-full hover:bg-indigo-50 transition-all duration-300 font-medium">
              Lihat Semua Event
            </button>
          </Link>
        </div>
      </div>

      {/* Promo Section - Enhanced */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 py-16 mt-12">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center text-white">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <Image
              src="/api/placeholder/500/400"
              alt="Create event illustration"
              width={500}
              height={400}
              className="max-w-md mx-auto rounded-lg shadow-2xl"
            />
          </div>
          <div className="md:w-1/2 md:pl-12">
            <h2 className="text-3xl font-bold mb-4">Make your own Event</h2>
            <p className="mb-6 max-w-md text-white/90">
              Create and manage your own events. Reach more attendees and grow your community.
            </p>
            <Link href="/admin/events/create">
              <button className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-full px-8 py-3 font-medium transition-all duration-300 shadow-lg">
                Create Events
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}