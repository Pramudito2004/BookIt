// src\app\customer\dashboard\page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useTicketsStore from "@/hooks/useTicketsStore";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import MidtransSnap from "@/app/components/MidtransSnap";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { OrderStatus } from "@prisma/client";

// Define ticket type
interface Ticket {
  id: number | string;
  eventTitle: string;
  date: string;
  time: string;
  location: string;
  ticketType: string;
  ticketCode: string;
  price: string;
  image: string;
  status: string;
  eventId?: string;
  orderId?: string;
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
  avatar: string;
  ticketsCount: {
    active: number;
    past: number;
  };
}

// Define API ticket type
interface ApiTicket {
  tiket_id: string;
  tiket_type_id: string;
  order_id: string;
  status: string;
  kode_qr: string;
  dibuat_di: string;
  tipe_tiket: {
    nama: string;
    harga: number;
    event: {
      event_id: string;
      nama_event: string;
      lokasi: string;
      tanggal_mulai: string;
      tanggal_selesai: string;
      foto_event?: string;
    };
  };
  order: {
    jumlah_total: number;
    status: OrderStatus;
  };
}

// Tambahkan interface untuk user profile
interface UserProfileData {
  user_id: string;
  email: string;
  jenis_kelamin: 'MALE' | 'FEMALE';
  tanggal_lahir: string;
  kontak: string | null;
  foto_profil: string | null;
  pembeli?: {
    nama_pembeli: string;
  };
  event_creator?: {
    nama_brand: string;
    deskripsi_creator: string | null;
    no_rekening: string | null;
  };
}

// Interface untuk payment data
interface PaymentData {
  orderId: string;
  snapToken: string;
  eventTitle: string;
  totalAmount: number;
}

export default function CustomerDashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Loading...",
    email: "Loading...",
    avatar: "/api/placeholder/100/100",
    ticketsCount: {
      active: 0,
      past: 0,
    },
  });
  const [tickets, setTickets] = useState<TicketsData>({
    active: [],
    past: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Payment related states
  const [showMidtransSnap, setShowMidtransSnap] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<PaymentData | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const getDisplayName = () => {
    if (!userProfile) return "";
    return userProfile.name || userProfile.email || "User";
  };

  // Get stored tickets from Zustand
  const {
    tickets: storedTickets,
    hasNewTickets,
    setHasNewTickets,
  } = useTicketsStore();

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login?redirectTo=/customer/dashboard');
    } else {
      fetchUserProfile();
    }
  }, [user, router]);

  // Tambahkan fungsi untuk mengambil data profile
  const fetchUserProfile = async () => {
    const userId = user?.id || user?.user_id;
    if (!userId) return;

    try {
      const response = await fetch(`/api/user/profile/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }

      const userData: UserProfileData = await response.json();
      
      // Update user profile dengan nama yang sesuai
      setUserProfile(prev => ({
        ...prev,
        name: userData.pembeli?.nama_pembeli || 
              userData.event_creator?.nama_brand || 
              prev.name,
        email: userData.email || prev.email,
      }));

    } catch (err) {
      console.error("Error fetching user profile:", err);
    }
  };

  useEffect(() => {
    if (!user) return;
    
    const fetchUserTickets = async () => {
      setIsLoading(true);
      try {
        // Ambil tiket dari API
        const userId = user.id;
        const response = await fetch(`/api/users/${userId}/tickets`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch tickets");
        }
        
        const data = await response.json();
        processTickets(data.tickets);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        
        // Gunakan tiket dari store jika API gagal
        if (storedTickets.length > 0) {
          processStoredTickets(storedTickets);
        } else {
          setError("Failed to load your tickets");
          
          // Initialize with empty tickets if API fails
          setTickets({
            active: [],
            past: []
          });
          
          setUserProfile(prev => ({
            ...prev,
            ticketsCount: {
              active: 0,
              past: 0
            }
          }));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserTickets();
    
    // Reset flag tiket baru
    if (hasNewTickets) {
      setHasNewTickets(false);
    }
  }, [storedTickets, hasNewTickets, setHasNewTickets, user]);

  // Process stored tickets from Zustand store
  const processStoredTickets = (storedTickets: any[]) => {
    const now = new Date();
    const active: Ticket[] = [];
    const past: Ticket[] = [];

    storedTickets.forEach((ticket) => {
      // Parse date string from the ticket to determine if it's past or active
      const eventDateParts = ticket.date.split(" ");
      const monthIdx = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ].findIndex((m) => ticket.date.includes(m));

      // Extract year from date (assuming format like "24-26 March 2025")
      const yearMatch = ticket.date.match(/\d{4}/);
      const year = yearMatch
        ? parseInt(yearMatch[0])
        : new Date().getFullYear();

      // Create a simple date object for comparison
      // This is an approximation; for a production app, you'd want more robust date parsing
      const eventEndDate = new Date(year, monthIdx, 28); // Use end of month as a safe default

      // Create UI ticket from stored ticket
      const uiTicket: Ticket = {
        id: ticket.id,
        eventTitle: ticket.eventTitle,
        date: ticket.date,
        time: ticket.time,
        location: ticket.location,
        ticketType: ticket.ticketType,
        ticketCode: ticket.ticketCode,
        price: ticket.price,
        image: ticket.image || "/api/placeholder/500/300",
        status: ticket.status,
        eventId: ticket.eventId,
        orderId: ticket.orderId,
      };

      // Categorize as active or past
      if (eventEndDate > now && ticket.status !== "Cancelled") {
        active.push(uiTicket);
      } else {
        past.push(uiTicket);
      }
    });

    // Update state
    setTickets({ active, past });
    setUserProfile((prev) => ({
      ...prev,
      ticketsCount: {
        active: active.length,
        past: past.length,
      },
    }));
  };

  // Process tickets from API response
  const processTickets = (apiTickets: ApiTicket[]) => {
    const now = new Date();
    const active: Ticket[] = [];
    const past: Ticket[] = [];

    apiTickets.forEach((ticket) => {
      const eventEndDate = new Date(ticket.tipe_tiket.event.tanggal_selesai);
      const eventStartDateObj = new Date(ticket.tipe_tiket.event.tanggal_mulai);

      // Format dates
      const date = formatDateRange(
        ticket.tipe_tiket.event.tanggal_mulai,
        ticket.tipe_tiket.event.tanggal_selesai
      );

      // Format time
      const time = formatTimeRange(
        ticket.tipe_tiket.event.tanggal_mulai,
        ticket.tipe_tiket.event.tanggal_selesai
      );

      // Map API ticket to UI ticket
      const uiTicket: Ticket = {
        id: ticket.tiket_id,
        eventTitle: ticket.tipe_tiket.event.nama_event,
        date: date,
        time: time,
        location: ticket.tipe_tiket.event.lokasi,
        ticketType: ticket.tipe_tiket.nama,
        ticketCode: ticket.kode_qr,
        price: `Rp ${ticket.tipe_tiket.harga.toLocaleString()}`,
        image: ticket.tipe_tiket.event.foto_event || "/api/placeholder/500/300",
        status: mapStatus(ticket.order.status),
        eventId: ticket.tipe_tiket.event.event_id,
        orderId: ticket.order_id,
      };

      // Categorize as active or past based on event date and order status
      if (eventEndDate > now && ticket.order.status !== "CANCELLED") {
        active.push(uiTicket);
      } else {
        past.push(uiTicket);
      }
    });

    // Update state
    setTickets({ active, past });
    setUserProfile((prev) => ({
      ...prev,
      ticketsCount: {
        active: active.length,
        past: past.length,
      },
    }));
  };

  // Format date range (e.g., "24-26 March 2025")
  const formatDateRange = (startDateStr: string, endDateStr: string) => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const month = startDate.toLocaleString("en-US", { month: "long" });
    const year = startDate.getFullYear();

    if (
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getFullYear() === endDate.getFullYear()
    ) {
      if (startDay === endDay) {
        return `${startDay} ${month} ${year}`;
      } else {
        return `${startDay}-${endDay} ${month} ${year}`;
      }
    } else {
      const endMonth = endDate.toLocaleString("en-US", { month: "long" });
      const endYear = endDate.getFullYear();

      if (startDate.getFullYear() === endDate.getFullYear()) {
        return `${startDay} ${month} - ${endDay} ${endMonth} ${year}`;
      } else {
        return `${startDay} ${month} ${year} - ${endDay} ${endMonth} ${endYear}`;
      }
    }
  };

  // Format time range (e.g., "18:00 - 23:00")
  const formatTimeRange = (startDateStr: string, endDateStr: string) => {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const startHours = startDate.getHours().toString().padStart(2, "0");
    const startMinutes = startDate.getMinutes().toString().padStart(2, "0");
    const endHours = endDate.getHours().toString().padStart(2, "0");
    const endMinutes = endDate.getMinutes().toString().padStart(2, "0");

    // If the event spans multiple days, show "All Day" or return specific format
    if (
      startDate.getDate() !== endDate.getDate() ||
      startDate.getMonth() !== endDate.getMonth() ||
      startDate.getFullYear() !== endDate.getFullYear()
    ) {
      // Check if it's a full day event (spans entire day)
      if (
        startHours === "00" &&
        startMinutes === "00" &&
        endHours === "23" &&
        endMinutes === "59"
      ) {
        return "All Day";
      }
    }

    return `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;
  };

  // Map API status to UI status
  const mapStatus = (apiStatus: string) => {
    switch (apiStatus.toUpperCase()) {
      case "PENDING":
        return "PENDING";
      case "PAID":
        return "PAID"; 
      case "CANCELLED":
        return "Cancelled";
      default:
        return apiStatus || "Unknown";
    }
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

  // Handle logout
  const handleLogout = () => {
    if (logout) {
      logout();
      router.push('/login');
    }
  };

  // Get the ticket count based on the active tab
  const getTicketCount = () => {
    return tickets[activeTab]?.length || 0;
  };

  // Get the appropriate status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-500 text-white";
      case "PAID":
        return "bg-green-500 text-white";
      case "CANCELLED":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Handle continue payment
  const handleContinuePayment = async (ticket: Ticket) => {
    if (!ticket.orderId) {
      console.error("No order ID found for ticket");
      return;
    }

    setIsProcessingPayment(true);

    try {
      // Get the order details and regenerate payment token
      const response = await fetch(`/api/orders/${ticket.orderId}/payment`);
      
      if (!response.ok) {
        throw new Error("Failed to get payment details");
      }

      const data = await response.json();
      
      setCurrentPayment({
        orderId: ticket.orderId,
        snapToken: data.snap_token,
        eventTitle: ticket.eventTitle,
        totalAmount: parseInt(ticket.price.replace(/\D/g, ''))
      });

      setShowMidtransSnap(true);
    } catch (err) {
      console.error("Error getting payment details:", err);
      alert("Failed to continue payment. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handle payment success
  const handlePaymentSuccess = async () => {
    if (!currentPayment) return;

    try {
      // Update payment status
      await fetch(`/api/payments/status/${currentPayment.orderId}`);
      
      setPaymentSuccess(true);
      setShowMidtransSnap(false);
      
      // Refresh tickets to show updated status
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error("Error updating payment status:", err);
    }
  };

  // Handle payment pending
  const handlePaymentPending = () => {
    setShowMidtransSnap(false);
    router.push(`/payment/pending?order_id=${currentPayment?.orderId}`);
  };

  // Handle payment error
  const handlePaymentError = () => {
    setShowMidtransSnap(false);
    alert("Payment failed. Please try again.");
  };

  // Handle payment close
  const handlePaymentClose = () => {
    setShowMidtransSnap(false);
    setCurrentPayment(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Midtrans Snap Integration */}
      {showMidtransSnap && currentPayment && (
        <MidtransSnap
          snapToken={currentPayment.snapToken}
          onSuccess={handlePaymentSuccess}
          onPending={handlePaymentPending}
          onError={handlePaymentError}
          onClose={handlePaymentClose}
        />
      )}

      {/* Payment Success Modal */}
      {paymentSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="mb-6">
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
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-600">
                Your payment has been processed successfully. Your ticket is now active.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Dashboard Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-xl p-6 md:p-8 mb-8 text-white shadow-lg">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
              <div className="flex items-center">
                <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center text-4xl font-medium text-white mr-6">
                  {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-1">
                    {getDisplayName()}
                  </h1>
                  <p className="text-white/80">{userProfile.email}</p>
                </div>
              </div>
              <div className="flex space-x-4 md:space-x-6">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold">
                    {userProfile.ticketsCount.active}
                  </div>
                  <div className="text-sm text-white/80">Active Tickets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold">
                    {userProfile.ticketsCount.past}
                  </div>
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
              {/* New Ticket Notification */}
              {hasNewTickets && activeTab === "active" && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-green-500"
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
                    <p>
                      Your tickets have been successfully purchased! They are
                      now available in your dashboard.
                    </p>
                  </div>
                  <button
                    onClick={() => setHasNewTickets(false)}
                    className="text-green-700 hover:text-green-900"
                  >
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {activeTab === "active"
                    ? "My Active Tickets"
                    : "My Past Events"}
                </h2>
                <div className="text-sm text-gray-600">
                  Showing {getTicketCount()}{" "}
                  {getTicketCount() === 1 ? "ticket" : "tickets"}
                </div>
              </div>

              {/* Loading State */}
              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
                </div>
              ) : (
                <>
                  {/* Empty State */}
                  {tickets[activeTab].length === 0 && !error && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                      <div className="mx-auto w-16 h-16 mb-4 text-gray-300">
                        <svg 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          className="w-6 h-6"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-800 mb-2">
                        {activeTab === "active" 
                          ? "No active tickets found" 
                          : "No past events found"}
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {activeTab === "active"
                          ? "Explore events and book tickets to see them here."
                          : "After attending events, they will appear here."}
                      </p>
                      {activeTab === "active" && (
                        <Link 
                          href="/events" 
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-block"
                        >
                          Explore Events
                        </Link>
                      )}
                    </div>
                  )}

                  {/* Error State */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                      <p>{error}</p>
                    </div>
                  )}

                  {/* Ticket List */}
                  {tickets[activeTab].length > 0 && (
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
                                  <div
                                    className={`text-xs font-bold px-2 py-1 rounded ${getStatusBadgeClass(ticket.status)}`}
                                  >
                                    {ticket.status}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="md:w-3/4 p-4 md:p-6 flex flex-col">
                              <div className="flex-grow">
                                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                                  <h3 className="text-lg font-bold mb-2 md:mb-0">
                                    {ticket.eventTitle}
                                  </h3>
                                  <div className="text-indigo-600 font-medium">
                                    {ticket.price}
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 md:gap-x-4 text-sm">
                                  <div className="flex items-start">
                                    <svg
                                      className="w-4 h-4 mr-2 text-gray-500 mt-0.5"
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
                                    <span>{ticket.date}</span>
                                  </div>
                                  <div className="flex items-start">
                                    <svg
                                      className="w-4 h-4 mr-2 text-gray-500 mt-0.5"
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
                                    <span>{ticket.time}</span>
                                  </div>
                                  <div className="flex items-start">
                                    <svg
                                      className="w-4 h-4 mr-2 text-gray-500 mt-0.5"
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
                                    <span>{ticket.location}</span>
                                  </div>
                                  <div className="flex items-start">
                                    <svg
                                      className="w-4 h-4 mr-2 text-gray-500 mt-0.5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                                      />
                                    </svg>
                                    <span>{ticket.ticketType}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row justify-end mt-4 pt-4 border-t border-gray-100 gap-3">
                                {activeTab === "active" ? (
                                  <>
                                    <Link
                                      href={`/ticket/${ticket.eventId}`}
                                      className="text-center py-2 px-4 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium"
                                    >
                                      View Details
                                    </Link>
                                    {ticket.status === "PENDING" ? (
                                      <button
                                        onClick={() => handleContinuePayment(ticket)}
                                        disabled={isProcessingPayment}
                                        className="text-center py-2 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                                      >
                                        {isProcessingPayment ? (
                                          <div className="flex items-center justify-center">
                                            <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                                            Processing...
                                          </div>
                                        ) : (
                                          "Continue Payment"
                                        )}
                                      </button>
                                    ) : (
                                      <Link
                                        href={`/ticket/view/${ticket.id}`}
                                        className="text-center py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-sm font-medium"
                                      >
                                        View Ticket
                                      </Link>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <Link
                                      href={`/ticket/${ticket.eventId}`}
                                      className="text-center py-2 px-4 bg-white border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium"
                                    >
                                      View Details
                                    </Link>
                                    <button className="text-center py-2 px-4 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors text-sm font-medium">
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
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}