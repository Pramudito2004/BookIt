// src\app\payment\success\page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown and redirect to dashboard
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/customer/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-8 text-center">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-10 h-10 text-green-600"
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
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Pembayaran Berhasil!</h1>
          <p className="text-gray-600 mb-6">
            Terima kasih! Pembayaran Anda telah berhasil diproses. Tiket untuk acara telah dikirim ke email Anda.
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
              Lihat Tiket Saya
            </Link>
            <p className="text-sm text-gray-500">
              Akan dialihkan ke dashboard dalam {countdown} detik...
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}