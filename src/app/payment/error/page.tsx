// src\app\payment\error\page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function PaymentErrorPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-8 text-center">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-red-600"
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
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Pembayaran Gagal</h1>
          <p className="text-gray-600 mb-6">
            Maaf, pembayaran Anda tidak dapat diproses. Silakan coba lagi atau pilih metode pembayaran lain.
          </p>
          {orderId && (
            <p className="text-sm text-gray-500 mb-6">
              ID Pesanan: <span className="font-medium">{orderId}</span>
            </p>
          )}
          <div className="space-y-4">
            <Link
              href={`/ticket/${orderId ? orderId.split('-')[0] : ''}`}
              className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Coba Lagi
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