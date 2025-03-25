"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TicketPage() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);

  const sliderItems = [
    {
      id: 1,
      title: "Music Festival 2025",
      description: "Experience the best live performances from top artists",
      image: "/image/bali.jpeg",
    },
    {
      id: 2,
      title: "Food & Wine Expo",
      description:
        "Taste exquisite cuisine and premium wines from around the world",
      image: "/image/bali.jpeg",
    },
    {
      id: 3,
      title: "Tech Conference 2025",
      description: "Discover the latest innovations and trends in technology",
      image: "/image/bali.jpeg",
    },
    {
      id: 4,
      title: "Art Exhibition",
      description: "Explore creative masterpieces from renowned artists",
      image: "/image/bali.jpeg",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Java Jazz Festival 2025",
      date: "24-26 March 2025",
      location: "JIExpo Kemayoran, Jakarta",
      category: "Music",
      image: "/image/bali.jpeg",
      price: "Rp 850.000",
    },
    {
      id: 2,
      title: "Jakarta International Food Festival",
      date: "15-17 April 2025",
      location: "Senayan City, Jakarta",
      category: "Food & Beverage",
      image: "/api/placeholder/500/300",
      price: "Rp 150.000",
    },
    {
      id: 3,
      title: "Indonesia Comic Con 2025",
      date: "5-6 May 2025",
      location: "ICE BSD, Tangerang",
      category: "Exhibition",
      image: "/api/placeholder/500/300",
      price: "Rp 250.000",
    },
    {
      id: 4,
      title: "Bali Spirit Festival",
      date: "10-14 June 2025",
      location: "Ubud, Bali",
      category: "Wellness",
      image: "/api/placeholder/500/300",
      price: "Rp 1.200.000",
    },
    {
      id: 5,
      title: "Jakarta Fashion Week",
      date: "20-26 July 2025",
      location: "Senayan City, Jakarta",
      category: "Fashion",
      image: "/api/placeholder/500/300",
      price: "Rp 350.000",
    },
    {
      id: 6,
      title: "Konser Akbar Nostalgia 90an",
      date: "8 August 2025",
      location: "Stadion GBK, Jakarta",
      category: "Music",
      image: "/api/placeholder/500/300",
      price: "Rp 750.000",
    },
  ];

  const categories = [
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
    "Jakarta",
    "Surabaya",
    "Bandung",
    "Yogyakarta",
    "Bali",
    "Medan",
    "Makassar",
    "Semarang",
  ];

  // State untuk slider
  const [currentSlide, setCurrentSlide] = useState(0);

  // State untuk mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State for navbar scrolling
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll event to make navbar sticky
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Pindah slide otomatis setiap 2 detik
  // Auto-sliding every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const nextSlide =
        currentSlide === sliderItems.length - 1 ? 0 : currentSlide + 1;
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
  }, [currentSlide, sliderItems.length]);

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
            {sliderItems.map((item, index) => (
              <div
                key={item.id}
                className="min-w-full md:min-w-[50%] lg:min-w-[100%] flex-shrink-0 px-2 relative h-72 rounded-xl overflow-hidden"
              >
                {/* Background image */}
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                {/* Gradient overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                {/* Content slider */}
                <div className="relative z-10 flex flex-col justify-end h-full p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-white/90 mb-6 max-w-lg">
                    {item.description}
                  </p>
                  <div className="flex">
                    <button className="bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-2.5 rounded-full font-medium transition-all duration-300 shadow-lg">
                      Learn more
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            {sliderItems.map((_, index) => (
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

      {/* Category Chips - Enhanced */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex overflow-x-auto pb-2 -mx-2 scrollbar-hide">
          {categories.map((category, index) => (
            <div key={index} className="flex-shrink-0 px-2">
              <button className="flex items-center space-x-2 bg-white text-gray-800 border border-gray-200 rounded-full px-5 py-2.5 text-sm hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200 shadow-sm">
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
          <div className="flex-shrink-0 px-2">
            <button className="flex items-center space-x-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full px-5 py-2.5 text-sm font-medium shadow-md">
              <span>All Cities</span>
            </button>
          </div>
          {cities.map((city, index) => (
            <div key={index} className="flex-shrink-0 px-2">
              <button className="flex items-center space-x-1 bg-white text-gray-800 border border-gray-200 rounded-full px-5 py-2.5 text-sm hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-200 font-medium shadow-sm">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingEvents.map((event) => (
            <Link
              key={event.id}
              href={`/ticket/${event.id}`}
              className="block group"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full cursor-pointer">
                <div className="relative h-48">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-0 left-0 m-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    {event.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-800 group-hover:text-indigo-600 transition-colors">
                    {event.title}
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
                    {event.date}
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
                    {event.location}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-indigo-600">
                      {event.price}
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
        <div className="text-center mt-10">
          <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-full hover:bg-indigo-50 transition-all duration-300 font-medium">
            Lihat Semua Event
          </button>
        </div>
      </div>

      {/* Promo Section - Enhanced */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 py-16">
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Reach
              more attendees and grow your community.
            </p>
            <button className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-full px-8 py-3 font-medium transition-all duration-300 shadow-lg">
              Create Events
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
