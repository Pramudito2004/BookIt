// src\app\payment\pending\page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function PaymentPendingPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-8 text-center">
          <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Pembayaran Tertunda</h1>
          <p className="text-gray-600 mb-6">
            Kami telah menerima permintaan pembayaran Anda, namun pembayaran masih dalam status tertunda.
            Silakan selesaikan proses pembayaran Anda sesuai dengan petunjuk dari penyedia pembayaran.
          </p>
          {orderId && (
            <p className="text-sm text-gray-500 mb-6">
              ID Pesanan: <span className="font-medium">{orderId}</span>
            </p>
          )}
          <div className="space-y-4">
            <Link
              href="/customer/dashboard"
              className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Lihat Status Pesanan
            </Link>
            <Link
              href="/"
              className="block w-full bg-white text-gray-700 border border-gray-300 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}