"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
// Define ticket type
interface Ticket {
  id: number;
  eventTitle: string;
  date: string;
  time: string;
  location: string;
  ticketType: string;
  ticketCode: string;
  price: string;
  image: string;
  status: string;
}

// Define tickets data structure
interface TicketsData {
  active: Ticket[];
  past: Ticket[];
  [key: string]: Ticket[]; // Index signature to allow string indexing
}

// Define user profile type
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  ticketsCount: {
    active: number;
    past: number;
  };
}


export default function CustomerDashboard() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  const [userProfile, setUserProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+62 812 3456 7890",
    avatar: "/api/placeholder/100/100",
    ticketsCount: {
      active: 3,
      past: 8
    }
  });

  // Mock data for tickets
  const tickets = {
    active: [
      {
        id: 1,
        eventTitle: "Java Jazz Festival 2025",
        date: "24-26 March 2025",
        time: "18:00 - 23:00",
        location: "JIExpo Kemayoran, Jakarta",
        ticketType: "Regular Pass",
        ticketCode: "JJF-X7A9B2",
        price: "Rp 850.000",
        image: "/image/bali.jpeg",
        status: "Confirmed"
      },
      {
        id: 2,
        eventTitle: "Indonesia Comic Con 2025",
        date: "5-6 May 2025",
        time: "10:00 - 20:00",
        location: "ICE BSD, Tangerang",
        ticketType: "Day-1 Pass",
        ticketCode: "ICC-Y8C2D4",
        price: "Rp 250.000",
        image: "/api/placeholder/500/300",
        status: "Confirmed"
      },
      {
        id: 3,
        eventTitle: "Bali Spirit Festival",
        date: "10-14 June 2025",
        time: "All Day",
        location: "Ubud, Bali",
        ticketType: "5-Day Pass",
        ticketCode: "BSF-Z5E3F7",
        price: "Rp 1.200.000",
        image: "/api/placeholder/500/300",
        status: "Pending"
      }
    ],
    past: [
      {
        id: 4,
        eventTitle: "Java Jazz Festival 2024",
        date: "24-26 March 2024",
        time: "18:00 - 23:00",
        location: "JIExpo Kemayoran, Jakarta",
        ticketType: "Regular Pass",
        ticketCode: "JJF-A1B2C3",
        price: "Rp 800.000",
        image: "/image/bali.jpeg",
        status: "Completed"
      },
      {
        id: 5,
        eventTitle: "Jakarta Food Festival 2024",
        date: "12-14 January 2024",
        time: "10:00 - 21:00",
        location: "Senayan City, Jakarta",
        ticketType: "Weekend Pass",
        ticketCode: "JFF-D4E5F6",
        price: "Rp 120.000",
        image: "/api/placeholder/500/300",
        status: "Completed"
      },
      {
        id: 6,
        eventTitle: "Indonesia Comic Con 2024",
        date: "5-6 May 2024",
        time: "10:00 - 20:00",
        location: "ICE BSD, Tangerang",
        ticketType: "Weekend Pass",
        ticketCode: "ICC-G7H8I9",
        price: "Rp 250.000",
        image: "/api/placeholder/500/300",
        status: "Completed"
      },
      {
        id: 7,
        eventTitle: "Music Festival 2024",
        date: "15 February 2024",
        time: "18:00 - 23:00",
        location: "Stadion GBK, Jakarta",
        ticketType: "VIP Pass",
        ticketCode: "MF-J1K2L3",
        price: "Rp 1.500.000",
        image: "/api/placeholder/500/300",
        status: "Completed"
      },
      {
        id: 8,
        eventTitle: "Tech Conference 2023",
        date: "10-11 November 2023",
        time: "09:00 - 17:00",
        location: "Grand Hyatt, Jakarta",
        ticketType: "2-Day Pass",
        ticketCode: "TC-M4N5P6",
        price: "Rp 350.000",
        image: "/api/placeholder/500/300",
        status: "Completed"
      }
    ]
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

  // Get the ticket count based on the active tab
  const getTicketCount = () => {
    return activeTab === "active" ? tickets.active.length : tickets.past.length;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Navbar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white text-gray-800 shadow-lg"
            : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <Link href="/" className="font-bold text-2xl flex items-center">
                <svg
                  className={`w-8 h-8 mr-2 ${
                    isScrolled ? "text-indigo-600" : "text-white"
                  }`}
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
                <span
                  className={
                    isScrolled ? "text-indigo-600" : "text-white tracking-wider"
                  }
                >
                  BookIt
                </span>
              </Link>
              <nav className="hidden md:flex items-center space-x-1">
                {[
                  { name: "Events", href: "/ticket", active: false },
                  { name: "Dashboard", href: "/dashboard", active: true },
                  { name: "My Tickets", href: "/dashboard", active: false },
                  { name: "Profile", href: "/profile", active: false },
                ].map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isScrolled
                        ? item.active
                          ? "bg-indigo-100 text-indigo-600"
                          : "text-gray-700 hover:bg-gray-100"
                        : item.active
                        ? "bg-white/20 text-white backdrop-blur-sm"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                  <Image 
                    src={userProfile.avatar}
                    alt="User avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className={isScrolled ? "text-gray-700" : "text-white"}>
                  {userProfile.name}
                </span>
              </div>
              <div className="relative group">
                <button
                  className={`text-sm py-2 px-3 rounded-full transition-all duration-200 ${
                    isScrolled
                      ? "hover:bg-gray-100"
                      : "hover:bg-white/10"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600">
                      My Profile
                    </Link>
                    <Link href="/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600">
                      My Tickets
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600">
                      Settings
                    </Link>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-50 hover:text-indigo-600">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden z-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke={isScrolled ? "currentColor" : "white"}
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Dashboard Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-xl p-6 md:p-8 mb-8 text-white shadow-lg">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
              <div className="flex items-center">
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-white/30 mr-4 md:mr-6">
                  <Image 
                    src={userProfile.avatar}
                    alt="User avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">{userProfile.name}</h1>
                  <p className="text-white/80">{userProfile.email}</p>
                  <p className="text-white/80">{userProfile.phone}</p>
                </div>
              </div>
              <div className="flex space-x-4 md:space-x-6">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold">{userProfile.ticketsCount.active}</div>
                  <div className="text-sm text-white/80">Active Tickets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold">{userProfile.ticketsCount.past}</div>
                  <div className="text-sm text-white/80">Past Events</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tickets Section */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("active")}
                className={`py-4 px-6 font-medium text-sm transition-all relative ${
                  activeTab === "active"
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                Active Tickets
                {activeTab === "active" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`py-4 px-6 font-medium text-sm transition-all relative ${
                  activeTab === "past"
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-indigo-600"
                }`}
              >
                Past Events
                {activeTab === "past" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
                )}
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {activeTab === "active" ? "My Active Tickets" : "My Past Events"}
                </h2>
                <div className="text-sm text-gray-600">
                  Showing {getTicketCount()} {getTicketCount() === 1 ? "ticket" : "tickets"}
                </div>
              </div>

              {/* Ticket List */}
              <div className="space-y-6">
                {tickets[activeTab].map((ticket) => (
                  <div 
                    key={ticket.id} 
                    className="border border-gray-200 rounded-lg overflow-hidden hover:border-indigo-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 relative">
                        <div className="relative h-48 md:h-full w-full">
                          <Image 
                            src={ticket.image}
                            alt={ticket.eventTitle}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-0 left-0 m-2">
                            <div className={`text-xs font-bold px-2 py-1 rounded ${
                              ticket.status === "Confirmed" 
                                ? "bg-green-500 text-white" 
                                : ticket.status === "Pending" 
                                ? "bg-yellow-500 text-white"
                                : "bg-gray-500 text-white"
                            }`}>
                              {ticket.status}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="md:w-3/4 p-4 md:p-6 flex flex-col">
                        <div className="flex-grow">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                            <h3 className="text-lg font-bold mb-2 md:mb-0">{ticket.eventTitle}</h3>
                            <div className="text-indigo-600 font-medium">{ticket.price}</div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 md:gap-x-4 text-sm">
                            <div className="flex items-start">
                              <svg className="w-4 h-4 mr-2 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{ticket.date}</span>
                            </div>
                            <div className="flex items-start">
                              <svg className="w-4 h-4 mr-2 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{ticket.time}</span>
                            </div>
                            <div className="flex items-start">
                              <svg className="w-4 h-4 mr-2 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>{ticket.location}</span>
                            </div>
                            <div className="flex items-start">
                              <svg className="w-4 h-4 mr-2 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                              </svg>
                              <span>{ticket.ticketType}</span>
                            </div>
                          </div>
                          {activeTab === "active" && (
                            <div className="mt-4 flex items-center text-sm text-gray-700">
                              <span className="font-medium mr-2">Ticket Code:</span>
                              <span className="bg-gray-100 py-1 px-2 rounded font-mono">{ticket.ticketCode}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row justify-end mt-4 pt-4 border-t border-gray-100 gap-3">
                          {activeTab === "active" ? (
                            <>
                              <Link 
                                href={`/ticket/${ticket.id}`} 
                                className="text-center py-2 px-4 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium"
                              >
                                View Details
                              </Link>
                              <Link 
                                href={`/ticket/view/${ticket.id}`} 
                                className="text-center py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-sm font-medium"
                              >
                                View Ticket
                              </Link>
                            </>
                          ) : (
                            <>
                              <Link 
                                href={`/ticket/${ticket.id}`} 
                                className="text-center py-2 px-4 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium"
                              >
                                View Details
                              </Link>
                              <button 
                                className="text-center py-2 px-4 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium"
                              >
                                Rate Event
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {getTicketCount() === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No tickets found</h3>
                  <p className="text-gray-600 mb-6">
                    {activeTab === "active" 
                      ? "You don't have any active tickets at the moment."
                      : "You haven't attended any events yet."}
                  </p>
                  <Link 
                    href="/ticket" 
                    className="inline-block py-2 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Browse Events
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center mb-3">
                <svg
                  className="w-7 h-7 mr-2"
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
              <p className="text-gray-400 text-sm max-w-md">
                The best event ticketing platform for all your entertainment needs
              </p>
            </div>
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
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>© 2025 BookIt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}