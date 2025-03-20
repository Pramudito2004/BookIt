"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [isScrolled, setIsScrolled] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isTicketCopied, setIsTicketCopied] = useState(false);

  // Mock transaction data - in a real app, you would get this from API
  const transaction = {
    id:
      "TRX" +
      Math.floor(Math.random() * 10000000)
        .toString()
        .padStart(7, "0"),
    date: new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: "SUCCESS",
    amount: "Rp 850.000",
    paymentMethod: "Bank Transfer",
    eventTitle: "Java Jazz Festival 2025",
    eventDate: "24-26 March 2025",
    eventLocation: "JIExpo Kemayoran, Jakarta",
    ticketType: "Regular Pass",
    quantity: 1,
    ticketCode:
      "JJF-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
  };

  // Get query params
  const eventId = searchParams.get("eventId") || "1";

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

  // Countdown redirection to event detail
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle copy ticket code to clipboard
  const copyTicketCode = () => {
    navigator.clipboard.writeText(transaction.ticketCode);
    setIsTicketCopied(true);

    setTimeout(() => {
      setIsTicketCopied(false);
    }, 2000);
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
                  { name: "Create Event", href: "#", active: false },
                  { name: "Locations", href: "#", active: false },
                  { name: "Pricing", href: "#", active: false },
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
              <button
                className={`text-sm py-2 px-5 rounded-full transition-all duration-200 ${
                  isScrolled
                    ? "border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                    : "text-white border border-white/60 hover:bg-white hover:text-indigo-600"
                }`}
              >
                Masuk
              </button>
              <button
                className={`text-sm py-2 px-5 rounded-full transition-all duration-200 shadow-lg ${
                  isScrolled
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-white text-indigo-600 hover:bg-indigo-100"
                }`}
              >
                Daftar
              </button>
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

      {/* Success Content */}
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Success Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Success Header */}
            <div className="bg-green-500 py-8 px-6 text-white text-center">
              <div className="mb-4 flex justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-green-500"
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
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Payment Successful!
              </h1>
              <p className="opacity-90">
                Thank you for your purchase. Your ticket is ready.
              </p>
            </div>

            {/* Order Summary */}
            <div className="p-6 md:p-8">
              <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                <h2 className="font-bold text-lg mb-4 text-indigo-800">
                  Transaction Details
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID</span>
                    <span className="font-medium text-gray-800">{transaction.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time</span>
                    <span className="text-gray-800">{transaction.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="font-medium text-green-600">
                      {transaction.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="text-gray-800">{transaction.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="font-bold text-gray-800">{transaction.amount}</span>
                  </div>
                </div>
              </div>

              {/* Ticket Information */}
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-8">
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <h2 className="font-bold text-gray-800">Ticket Information</h2>
                </div>
                <div className="p-4">
                  <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                    <div className="md:w-1/2">
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-gray-500 text-sm">Event</h3>
                          <p className="font-bold text-gray-800">{transaction.eventTitle}</p>
                        </div>
                        <div>
                          <h3 className="text-gray-500 text-sm">Date</h3>
                          <p className="text-gray-800">{transaction.eventDate}</p>
                        </div>
                        <div>
                          <h3 className="text-gray-500 text-sm">Location</h3>
                          <p className="text-gray-800">{transaction.eventLocation}</p>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-1/2">
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-gray-500 text-sm">Ticket</h3>
                          <p className="text-gray-800">
                            {transaction.ticketType} × {transaction.quantity}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-gray-500 text-sm">Ticket Code</h3>
                          <div className="flex items-center mt-1">
                            <span className="text-gray-800 bg-gray-100 py-1 px-3 rounded font-mono text-lg tracking-wider mr-2">
                              {transaction.ticketCode}
                            </span>
                            <button
                              onClick={copyTicketCode}
                              className="text-indigo-600 hover:text-indigo-800"
                            >
                              {isTicketCopied ? (
                                <svg
                                  className="w-5 h-5 text-green-600"
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
                              ) : (
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            You'll need this code to enter the event
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center border border-gray-200 rounded-lg p-6 mb-8">
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-sm mb-3">
                  <div className="relative w-48 h-48">
                    <Image
                      src="/api/placeholder/200/200"
                      alt="Ticket QR Code"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="px-4 py-2 bg-white/80 rounded-lg text-sm font-medium text-gray-800">
                        QR Code would be here
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Present this QR code when entering the venue
                </p>
                <button className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Download Ticket
                </button>
              </div>

              {/* Next Steps */}
              <div className="flex flex-col items-center text-center">
                <h3 className="font-bold text-gray-800 mb-2">What's Next?</h3>
                <p className="text-gray-600 mb-4">
                  Your ticket has been emailed to you. Check your inbox
                  including the spam folder.
                </p>

                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mb-3">
                  <Link
                    href={`/ticket/${eventId}`}
                    className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200 py-2 px-6 rounded-lg transition-colors"
                  >
                    Back to Event
                  </Link>
                  <Link
                    href="/ticket"
                    className="text-indigo-600 hover:underline py-2 px-6"
                  >
                    Browse More Events
                  </Link>
                </div>

                <p className="text-sm text-gray-500">
                  You will be redirected to event page in {countdown} seconds
                </p>
              </div>
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
                The best event ticketing platform for all your entertainment
                needs
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
