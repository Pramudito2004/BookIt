// src\app\ticket\[id]\page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import MidtransSnap from "@/app/components/MidtransSnap";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";

// Define interfaces for our data
interface TicketType {
  tiket_type_id: string;
  nama: string;
  harga: number;
  jumlah_tersedia: number;
  deskripsi?: string;
}

interface Creator {
  nama_brand: string;
  kontak: string;
}

interface Event {
  event_id: string;
  nama_event: string;
  deskripsi: string;
  kota_kabupaten: string;
  lokasi: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  foto_event?: string;
  kategori_event: string;
  creator?: Creator;
  creator_id: string;
  tipe_tikets: TicketType[];
}

// Define interface for form data
interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const { user } = useAuth();

  // State variables
  const [event, setEvent] = useState<Event | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [selectedTicketType, setSelectedTicketType] = useState<string | null>(
    null
  );
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<CheckoutFormData>>({});
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [snapToken, setSnapToken] = useState<string | null>(null);
  const [showMidtransSnap, setShowMidtransSnap] = useState(false);

  // Fetch event data when component mounts
  useEffect(() => {
    async function fetchEventData() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/events/${eventId}`);

        if (!response.ok) {
          throw new Error("Event not found");
        }

        const data = await response.json();

        // Process the event data
        const eventData: Event = {
          ...data,
          // Ensure dates are in the correct format
          tanggal_mulai: new Date(data.tanggal_mulai).toISOString(),
          tanggal_selesai: new Date(data.tanggal_selesai).toISOString(),
          // Ensure ticket types have IDs
          tipe_tikets: (data.tipe_tikets || []).map(
            (ticket: any, index: number) => ({
              ...ticket,
              tiket_type_id: ticket.tiket_type_id || `ticket-${index}`,
            })
          ),
        };

        setEvent(eventData);

        // After getting the event, fetch related events
        fetchRelatedEvents(eventData.kategori_event);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event details");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEventData();
  }, [eventId]);

  // Initialize form with user data if available
  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        fullName: user.name || prevData.fullName,
        email: user.email || prevData.email,
      }));
    }
  }, [user]);

  // Effect to handle Midtrans Snap token
  useEffect(() => {
    // When we get a snap token, show the Midtrans popup
    if (snapToken) {
      setShowMidtransSnap(true);
    }
  }, [snapToken]);

  // Fetch related events
  const fetchRelatedEvents = async (category: string) => {
    try {
      // Fetch events with the same category but different ID
      const response = await fetch(
        `/api/events?category=${encodeURIComponent(category)}&limit=4`
      );
      const data = await response.json();

      // Filter out the current event and limit to 4
      const filtered = data.events
        .filter((e: Event) => e.event_id !== eventId)
        .slice(0, 4);

      setRelatedEvents(filtered);
    } catch (err) {
      console.error("Error fetching related events:", err);
    }
  };

  // Calculate ticket price based on selected ticket type and quantity
  const selectedTicket = event?.tipe_tikets.find(
    (t) => t.tiket_type_id === selectedTicketType
  );

  const totalPrice = selectedTicket
    ? Number(selectedTicket.harga) * ticketQuantity
    : 0;

  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(totalPrice);

  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: format(date, "dd MMMM yyyy"),
      time: format(date, "HH:mm"),
    };
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when typing
    if (formErrors[name as keyof CheckoutFormData]) {
      setFormErrors({
        ...formErrors,
        [name]: undefined,
      });
    }
  };

  // Form validation messages
  const validateForm = (): boolean => {
    const errors: Partial<CheckoutFormData> = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle buy ticket button click
  const handleBuyTicketClick = () => {
    if (!user) {
      // Redirect to login page if user is not logged in
      router.push(
        `/login?redirectTo=${encodeURIComponent(`/ticket/${eventId}`)}`
      );
      return;
    }

    setIsCheckoutOpen(true);
    // Reset payment error if any
    setPaymentError(null);
  };

  // Handle the Midtrans Snap callbacks
  const handlePaymentSuccess = () => {
    setOrderSuccess(true);
    // Redirect to dashboard after 3 seconds
    setTimeout(() => {
      router.push('/customer/dashboard');
    }, 3000);
  };

  const handlePaymentPending = () => {
    router.push(`/payment/pending?order_id=${orderData?.order?.order_id}`);
  };

  // Error messages
  const handlePaymentError = () => {
    setPaymentError("An error occurred while processing the payment. Please try again.");
    setIsProcessing(false);
    setSnapToken(null);
    setShowMidtransSnap(false);
  };

  const handlePaymentClose = () => {
    setShowMidtransSnap(false);
    setSnapToken(null);
    setIsProcessing(false);
  };

  // Handle order submission
  const handleSubmitOrder = async () => {
    if (!validateForm() || !event || !selectedTicket) {
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Get user ID from auth context
      const userId = user?.id;

      if (!userId) {
        throw new Error("User not authenticated");
      }

      const orderData = {
        user_id: userId,
        event_id: event.event_id,
        tiket_type_id: selectedTicket.tiket_type_id,
        quantity: ticketQuantity,
        jumlah_total: totalPrice,
        buyer_info: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        },
        payment_method: "Midtrans",
      };

      console.log('Submitting order data:', JSON.stringify(orderData));

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create order");
      }

      console.log('Order created successfully:', result);

      // Save order data
      setOrderData(result.data);
      
      // Get the snap token from the response
      if (result.data.snap_token) {
        setSnapToken(result.data.snap_token);
      } else {
        throw new Error("No payment token received");
      }
    } catch (err: any) {
      console.error("Error creating order:", err);
      setPaymentError(
        err.message || "Gagal memproses pesanan Anda. Silakan coba lagi."
      );
      setIsProcessing(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="bg-white p-8 rounded-xl shadow-md max-w-lg mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Event Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error || "We couldn't find the event you're looking for."}
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Format dates
  const startDate = formatDate(event.tanggal_mulai);
  const endDate = formatDate(event.tanggal_selesai);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Event Header with Image */}
      <div className="w-full h-[50vh] relative pt-16">
        <Image
          src={event.foto_event || "/placeholder-event.jpg"}
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
              {startDate.date} • {startDate.time} - {endDate.time}
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
            <div className="flex flex-col my-2">
              <span className="font-medium">{event.kota_kabupaten}</span>
              <span className="text-sm opacity-90">{event.lokasi}</span>
            </div>
          </div>
          {event.creator && (
            <div className="flex items-center text-white/90">
              <span className="mr-2">Organized by:</span>
              <span className="font-medium">{event.creator.nama_brand}</span>
            </div>
          )}
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
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    About This Event
                  </h2>
                  <div
                    className="prose prose-indigo max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: event.deskripsi }}
                  />
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
                      {event.kota_kabupaten}
                    </h3>
                    <p className="text-gray-600">{event.lokasi}</p>
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
              {event.tipe_tikets && event.tipe_tikets.length > 0 ? (
                <div className="space-y-4 mb-6">
                  {event.tipe_tikets.map((ticket) => (
                    <div
                      key={ticket.tiket_type_id}
                      onClick={() =>
                        setSelectedTicketType(ticket.tiket_type_id)
                      }
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedTicketType === ticket.tiket_type_id
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-300"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="font-bold text-gray-800">
                          {ticket.nama}
                        </h3>
                        <span className="font-bold text-indigo-600">
                          Rp{ticket.harga.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {ticket.deskripsi ||
                          `${ticket.nama} ticket for ${event.nama_event}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {ticket.jumlah_tersedia} tickets available
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-700 text-sm">
                    No tickets are currently available for this event.
                  </p>
                </div>
              )}

              {/* Ticket Quantity */}
              {event.tipe_tikets && event.tipe_tikets.length > 0 && (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ticket Quantity
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
                    onClick={handleBuyTicketClick}
                    disabled={!selectedTicketType}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-md ${
                      selectedTicketType
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {user ? "Buy Tickets" : "Login to Purchase"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Midtrans Snap Integration */}
      {showMidtransSnap && snapToken && (
        <MidtransSnap
          snapToken={snapToken}
          onSuccess={handlePaymentSuccess}
          onPending={handlePaymentPending}
          onError={handlePaymentError}
          onClose={handlePaymentClose}
        />
      )}

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
                  disabled={isProcessing}
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

              {/* Success Message */}
              {orderSuccess ? (
                <div className="text-center py-8">
                  <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
                    <svg
                      className="w-16 h-16 mx-auto text-green-600 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h4 className="text-xl font-bold mb-2">
                      Booking Successful!
                    </h4>
                    <p>Your tickets have been successfully booked.</p>
                    <p className="mt-2 text-sm">
                      Order ID: {orderData?.order?.order_id}
                    </p>
                    <p className="mt-2 text-sm">
                      A confirmation email has been sent to your email address.
                    </p>
                  </div>
                  <Link
                    href="/customer/dashboard"
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-block mt-4"
                  >
                    View My Tickets
                  </Link>
                </div>
              ) : (
                <>
                  {/* Event Details */}
                  <div className="mb-6">
                    <h4 className="font-bold mb-2">{event.nama_event}</h4>
                    <div className="text-sm text-gray-600 mb-4">
                      <p>
                        {startDate.date} • {startDate.time} - {endDate.time}
                      </p>
                      <p>{event.lokasi}</p>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-lg mb-4">
                      <div className="flex justify-between mb-1">
                        <span>
                          {selectedTicket?.nama} x {ticketQuantity}
                        </span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>{formattedPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Error Message */}
                  {paymentError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>{paymentError}</span>
                      </div>
                    </div>
                  )}

                  {/* Form Input */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full p-2 border ${
                          formErrors.fullName
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="Enter full name"
                        disabled={isProcessing}
                      />
                      {formErrors.fullName && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.fullName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full p-2 border ${
                          formErrors.email
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="Enter email address"
                        disabled={isProcessing}
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full p-2 border ${
                          formErrors.phone
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
                        placeholder="Enter phone number"
                        disabled={isProcessing}
                      />
                      {formErrors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="mb-6">
                    <h4 className="font-medium mb-2">Payment Method</h4>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          <svg
                            className="w-6 h-6 text-indigo-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium">Midtrans Payment Gateway</p>
                          <p className="text-xs text-gray-500">
                            Pay with various methods: Credit Card, Virtual Account, E-Wallet, and more
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleSubmitOrder}
                    disabled={isProcessing}
                    className={`w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md ${
                      isProcessing ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      "Pay Now"
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-500 mt-4">
                    By completing this purchase, you agree to our Terms and Conditions.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}