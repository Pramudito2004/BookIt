// src\app\ticket\[id]\page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.id;
  const [activeTab, setActiveTab] = useState("description");
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedTicketType, setSelectedTicketType] = useState<string | null>(
    null
  );
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Mock event data based on Prisma schema
  const event = {
    event_id: eventId,
    nama_event: "Java Jazz Festival 2025",
    deskripsi:
      "Java Jazz Festival is one of the biggest jazz festivals in the world, showcasing more than 100 performances on several stages by jazz artists from around the globe. Experience the magic of world-class jazz performances in the heart of Jakarta.",
    lokasi: "JIExpo Kemayoran, Jakarta",
    tanggal_mulai: new Date("2025-03-24T18:00:00"),
    tanggal_selesai: new Date("2025-03-26T23:00:00"),
    foto_event: "/image/bali.jpeg",
    kategori_event: "Music",
    creator: {
      nama_brand: "Java Festival Production",
      kontak: "+62 812-3456-7890",
    },
    tipe_tikets: [
      {
        tiket_type_id: "regular",
        nama: "Regular Pass",
        harga: 850000,
        jumlah_tersedia: 500,
        deskripsi: "Access to all stages for one day of your choice",
      },
      {
        tiket_type_id: "vip",
        nama: "Special VIP",
        harga: 1250000,
        jumlah_tersedia: 200,
        deskripsi:
          "Access to all stages for one day plus exclusive lounge access",
      },
      {
        tiket_type_id: "exclusive",
        nama: "Exclusive",
        harga: 2100000,
        jumlah_tersedia: 100,
        deskripsi: "Access to all stages for all three days",
      },
    ],
    lineup: [
      { name: "Diana Krall", time: "21:00 - 22:30", day: "Friday, 24 March" },
      { name: "John Legend", time: "19:30 - 21:00", day: "Saturday, 25 March" },
      { name: "Norah Jones", time: "20:00 - 21:30", day: "Sunday, 26 March" },
      {
        name: "Joey Alexander",
        time: "18:00 - 19:00",
        day: "Friday, 24 March",
      },
      {
        name: "Jamie Cullum",
        time: "18:30 - 19:30",
        day: "Saturday, 25 March",
      },
    ],
    ticketTypes: [
      {
        id: "regular",
        name: "Regular Pass",
        price: "Rp 850.000",
        priceValue: 850000,
        description: "Access to all stages for one day of your choice",
      },
      {
        id: "daily-special",
        name: "Daily Special",
        price: "Rp 1.250.000",
        priceValue: 1250000,
        description:
          "Access to all stages for one day plus exclusive lounge access",
      },
      {
        id: "3-day",
        name: "3-Day Pass",
        price: "Rp 2.100.000",
        priceValue: 2100000,
        description: "Access to all stages for all three days",
      },
    ],
    gallery: ["/image/bali.jpeg", "/image/bali.jpeg", "/image/bali.jpeg"],
    reviews: [
      {
        id: 1,
        name: "Budi Santoso",
        rating: 5,
        date: "March 2024",
        comment:
          "Amazing performances and great atmosphere! Will definitely come back next year.",
      },
      {
        id: 2,
        name: "Anissa Wijaya",
        rating: 4,
        date: "March 2024",
        comment:
          "Great lineup and organization. Food options could be better though.",
      },
    ],
  };

  // Handle scroll events for sticky header
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

  // Calculate ticket price based on selected ticket type and quantity
  const selectedTicket = event.tipe_tikets.find(
    (t) => t.tiket_type_id === selectedTicketType
  );
  const totalPrice = selectedTicket
    ? Number(selectedTicket.harga) * ticketQuantity
    : 0;
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(totalPrice);

  // Rest of the component remains the same as the previous implementation
  // ... (copy the entire previous implementation, replacing event references)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Event Header with Image */}
      <div className="w-full h-[50vh] relative pt-16">
        <Image
          src={event.foto_event}
          alt={event.nama_event}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto">
          <div className="flex items-center mb-2">
            <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full mr-3">
              {event.kategori_event}
            </span>
            <span className="text-white/90 text-sm">
              {event.tanggal_mulai.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              •{" "}
              {event.tanggal_mulai.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              -{" "}
              {event.tanggal_selesai.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {event.nama_event}
          </h1>
          <div className="flex items-center text-white/90 mb-4">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {event.lokasi}
          </div>
          <div className="flex items-center text-white/90">
            <span className="mr-2">Organized by:</span>
            <span className="font-medium">{event.creator.nama_brand}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Event Details */}
          <div className="lg:w-2/3">
            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              {[
                { id: "description", label: "Description" },
                { id: "lineup", label: "Lineup" },
                { id: "location", label: "Location" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 px-5 font-medium text-sm transition-all ${
                    activeTab === tab.id
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              {/* Description Tab */}
              {activeTab === "description" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                  <p className="text-gray-700 mb-6">{event.description}</p>

                  <h3 className="text-xl font-bold mb-3">What to Expect</h3>
                  <ul className="space-y-2 mb-6">
                    {event.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-indigo-600 mr-2 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-xl font-bold mb-3">Event Gallery</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {event.gallery.map((image, index) => (
                      <div
                        key={index}
                        className="relative h-48 rounded-lg overflow-hidden"
                      >
                        <Image
                          src={image}
                          alt={`Event image ${index + 1}`}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lineup Tab */}
              {activeTab === "lineup" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    Event Lineup
                  </h2>
                  <div className="space-y-4">
                    {event.lineup.map((artist, index) => (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
                      >
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">
                            {artist.name}
                          </h3>
                          <p className="text-gray-600">{artist.day}</p>
                        </div>
                        <div className="flex items-center text-indigo-600 font-medium mt-2 md:mt-0">
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {artist.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Tab */}
              {activeTab === "location" && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Event Location
                  </h2>
                  <div className="bg-gray-100 p-4 rounded-lg mb-6">
                    <h3 className="font-bold mb-2">{event.location}</h3>
                    <p className="text-gray-700 mb-4">{event.address}</p>
                    <div className="relative w-full h-64 rounded-lg overflow-hidden">
                      <Image
                        src="/api/placeholder/800/400"
                        alt="Map location"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="px-4 py-2 bg-white/80 rounded-lg text-sm font-medium">
                          Interactive map would be displayed here
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3">Getting There</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                        <svg
                          className="w-5 h-5 text-indigo-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">
                          Public Transportation
                        </h4>
                        <p className="text-gray-700">
                          TransJakarta Bus: Route 3K from Harmoni to Pademangan
                        </p>
                        <p className="text-gray-700">
                          MRT: Get off at Bundaran HI station, then take a taxi
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                        <svg
                          className="w-5 h-5 text-indigo-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold mb-1">Parking</h4>
                        <p className="text-gray-700">
                          On-site parking available for Rp 25.000 per entry
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Ticket Selection */}
          <div className="lg:w-1/3 mt-8 lg:mt-0">
            <div className="bg-white p-6 rounded-xl shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Select Tickets
              </h2>

              {/* Ticket Type Selection */}
              <div className="space-y-4 mb-6">
                {event.tipe_tikets.map((ticket) => (
                  <div
                    key={ticket.tiket_type_id}
                    onClick={() => setSelectedTicketType(ticket.tiket_type_id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedTicketType === ticket.tiket_type_id
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold">{ticket.name}</h3>
                      <span className="font-bold text-indigo-600">
                        Rp{ticket.harga.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{ticket.deskripsi}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {ticket.jumlah_tersedia} tickets available
                    </p>
                  </div>
                ))}
              </div>

              {/* Ticket Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 ">
                  Number of Tickets
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      setTicketQuantity(Math.max(1, ticketQuantity - 1))
                    }
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-l-lg border border-gray-300 hover:bg-gray-200 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 12H4"
                      />
                    </svg>
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={ticketQuantity}
                    onChange={(e) =>
                      setTicketQuantity(
                        Math.max(1, parseInt(e.target.value) || 1)
                      )
                    }
                    className="w-16 h-10 text-center border-t border-b text-gray-800 border-gray-300 focus:outline-none focus:ring-0 focus:border-gray-300"
                  />
                  <button
                    onClick={() => setTicketQuantity(ticketQuantity + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-r-lg border border-gray-300 hover:bg-gray-200 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Price Summary */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between mb-2 text-gray-800">
                  <span className="text-gray-600">Price per ticket</span>
                  <span>
                    {selectedTicket
                      ? `Rp${selectedTicket.harga.toLocaleString()}`
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between mb-2 text-gray-800">
                  <span className="text-gray-600">Quantity</span>
                  <span>{ticketQuantity}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-800">
                  <span>Total</span>
                  <span>{formattedPrice}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => setIsCheckoutOpen(true)}
                disabled={!selectedTicketType}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-md ${
                  selectedTicketType
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Buy Tickets
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-screen overflow-y-auto p-4">
            <div className="p-6 flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Complete Your Purchase</h3>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Event Details */}
              <div className="mb-6">
                <h4 className="font-bold mb-2">{event.nama_event}</h4>
                <div className="text-sm text-gray-600 mb-4">
                  <p>
                    {event.tanggal_mulai.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    •{" "}
                    {event.tanggal_mulai.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    -{" "}
                    {event.tanggal_selesai.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p>{event.lokasi}</p>
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between mb-1">
                    <span>x {ticketQuantity}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formattedPrice}</span>
                  </div>
                </div>
              </div>

              {/* Form Input */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Payment Method</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Credit Card",
                    "Bank Transfer",
                    "E-Wallet",
                    "Virtual Account",
                  ].map((method) => (
                    <div
                      key={method}
                      className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                    >
                      <input
                        type="radio"
                        name="payment"
                        id={method.toLowerCase().replace(/\s+/g, "-")}
                        className="mr-2"
                      />
                      <label
                        htmlFor={method.toLowerCase().replace(/\s+/g, "-")}
                        className="cursor-pointer"
                      >
                        {method}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md">
                Pay Now
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                By completing this purchase, you agree to our Terms and
                Conditions.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Related Events */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-gray-800">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white text-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-48">
                  <Image
                    src="/image/bali.jpeg"
                    alt="Related event"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-0 left-0 m-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Music
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">
                    Another Amazing Concert
                  </h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <svg
                      className="w-4 h-4 mr-1 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    15 April 2025
                  </div>
                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <svg
                      className="w-4 h-4 mr-1 text-indigo-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
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
                    Jakarta
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-indigo-600">
                      Rp 500.000
                    </span>
                    <Link
                      href={`/ticket/${item}`}
                      className="text-sm text-indigo-600 font-medium hover:text-indigo-800"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center mb-6">
                <svg
                  className="w-8 h-8 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 13L12 16L15 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8V16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-xl font-bold">BookIt</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Platform pembelian tiket online terpercaya untuk berbagai event
                di seluruh Indonesia.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-indigo-600 transition-all duration-300"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                  >
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-500 transition-all duration-300"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                  >
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="bg-gray-800 w-10 h-10 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all duration-300"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Bantuan</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors duration-200 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                    Cara Pembelian
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors duration-200 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                    Cara Pembayaran
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors duration-200 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors duration-200 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                    Hubungi Kami
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Tentang</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors duration-200 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors duration-200 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                    Karir
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors duration-200 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                    Kebijakan Privasi
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-indigo-400 transition-colors duration-200 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                    Syarat dan Ketentuan
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Ikuti Kami</h4>
              <p className="text-gray-400 text-sm mb-4">
                Dapatkan info terbaru tentang event dan promo spesial
              </p>
              <div className="flex items-center">
                <input
                  type="email"
                  placeholder="Email Kamu"
                  className="py-2 px-4 bg-gray-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white text-sm flex-grow"
                />
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-4 rounded-r-lg font-medium text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 BookIt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
