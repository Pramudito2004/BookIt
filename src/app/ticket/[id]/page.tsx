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
  const [selectedTicketType, setSelectedTicketType] = useState("regular");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Mock event data - in a real app you would fetch this based on eventId
  const event = {
    id: eventId,
    title: "Java Jazz Festival 2025",
    date: "24-26 March 2025",
    time: "18:00 - 23:00",
    location: "JIExpo Kemayoran, Jakarta",
    address:
      "Jl. Benyamin Sueb, Pademangan Tim., Jakarta Utara, DKI Jakarta 14410",
    category: "Music",
    image: "/image/bali.jpeg",
    organizer: "Java Festival Production",
    description:
      "Java Jazz Festival is one of the biggest jazz festivals in the world, showcasing more than 100 performances on several stages by jazz artists from around the globe. Experience the magic of world-class jazz performances in the heart of Jakarta.",
    features: [
      "100+ local and international jazz artists",
      "Multiple stages with simultaneous performances",
      "Food and beverage stands",
      "Merchandise booths",
      "Meet & Greet sessions with selected artists",
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

  // Calculate ticket price based on selected ticket type and quantity
  const selectedTicket = event.ticketTypes.find(
    (t) => t.id === selectedTicketType
  );
  const totalPrice = selectedTicket
    ? selectedTicket.priceValue * ticketQuantity
    : 0;
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(totalPrice);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Event Header with Image */}
      <div className="w-full h-[50vh] relative pt-16">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto">
          <div className="flex items-center mb-2">
            <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full mr-3">
              {event.category}
            </span>
            <span className="text-white/90 text-sm">
              {event.date} • {event.time}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {event.title}
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
            {event.location}
          </div>
          <div className="flex items-center text-white/90">
            <span className="mr-2">Organized by:</span>
            <span className="font-medium">{event.organizer}</span>
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
                { id: "reviews", label: "Reviews" },
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
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    About This Event
                  </h2>
                  <p className="text-gray-700 mb-6">{event.description}</p>

                  <h3 className="text-xl font-bold mb-3 text-gray-800">
                    What to Expect
                  </h3>
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

                  <h3 className="text-xl font-bold mb-3 text-gray-800">
                    Event Gallery
                  </h3>
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
                    <h3 className="font-bold mb-2 text-gray-800">
                      {event.location}
                    </h3>
                    <p className="text-gray-700 mb-4 text-gray-800">
                      {event.address}
                    </p>
                    <div className="relative w-full h-64 rounded-lg overflow-hidden">
                      <Image
                        src="/api/placeholder/800/400"
                        alt="Map location"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="px-4 py-2 bg-white/80 rounded-lg text-sm font-medium text-gray-800">
                          Interactive map would be displayed here
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-gray-800">
                    Getting There
                  </h3>
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
                        <h4 className="font-bold mb-1 text-gray-800">
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
                        <h4 className="font-bold mb-1 text-gray-800">
                          Parking
                        </h4>
                        <p className="text-gray-700">
                          On-site parking available for Rp 25.000 per entry
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === "reviews" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                      Reviews & Ratings
                    </h2>
                    <button className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
                      Write a Review
                    </button>
                  </div>

                  <div className="space-y-6">
                    {event.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="text-gray-800 border-b border-gray-200 pb-6 last:border-0"
                      >
                        <div className="flex justify-between mb-2">
                          <h3 className="font-bold">{review.name}</h3>
                          <span className="text-sm text-gray-500">
                            {review.date}
                          </span>
                        </div>
                        <div className="flex items-center mb-3">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${
                                i < review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
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
                {event.ticketTypes.map((ticket) => (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicketType(ticket.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedTicketType === ticket.id
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-bold text-gray-800">{ticket.name}</h3>
                      <span className="font-bold text-indigo-600">
                        {ticket.price}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {ticket.description}
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
                  <span>{selectedTicket?.price}</span>
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
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md"
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl">
            <div className="p-6">
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

              <div className="mb-6">
                <h4 className="font-bold mb-2">{event.title}</h4>
                <div className="text-sm text-gray-600 mb-4">
                  <p>
                    {event.date} • {event.time}
                  </p>
                  <p>{event.location}</p>
                </div>

                <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                  <div className="flex justify-between mb-1">
                    <span>{selectedTicket?.name}</span>
                    <span>x {ticketQuantity}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formattedPrice}</span>
                  </div>
                </div>
              </div>

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

      <Footer />
    </div>
  );
}
