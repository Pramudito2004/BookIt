// src/app/payment/success/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState(10);

  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided');
      setIsLoading(false);
      return;
    }

    // Check payment status
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/payments/status/${orderId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to check payment status');
        }

        setOrderStatus(data);

        // If payment is not actually paid, redirect to appropriate page
        if (data.order_status === 'PENDING') {
          router.push(`/payment/pending?order_id=${orderId}`);
          return;
        }

        if (data.order_status === 'CANCELLED') {
          setError('This payment was cancelled or failed.');
          return;
        }

        // If we reach here, payment should be successful
        if (data.order_status !== 'PAID') {
          setError(`Unexpected order status: ${data.order_status}. Please check your dashboard or contact support.`);
          return;
        }

      } catch (err: any) {
        console.error('Error checking payment status:', err);
        setError(err.message || 'Failed to verify payment');
      } finally {
        setIsLoading(false);
      }
    };

    checkPaymentStatus();
  }, [orderId, router]);

  // Auto redirect countdown
  useEffect(() => {
    if (orderStatus && orderStatus.order_status === 'PAID' && !error) {
      const timer = setInterval(() => {
        setRedirectCountdown((prev) => {
          if (prev <= 1) {
            router.push('/customer/dashboard');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [orderStatus, error, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Verifying Payment...
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your payment status.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-red-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Payment Verification Issue
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <Link 
                href="/customer/dashboard"
                className="block w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Go to Dashboard
              </Link>
              <button 
                onClick={() => window.location.reload()}
                className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Success state
  if (orderStatus?.order_status === 'PAID') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 text-green-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Payment Successful! 🎉
            </h1>
            
            <p className="text-gray-600 mb-6">
              Your payment has been processed successfully. Your tickets are now active and ready to use!
            </p>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <div className="space-y-2">
                <p className="text-sm text-green-700">
                  <strong>Order ID:</strong> {orderId}
                </p>
                <p className="text-sm text-green-700">
                  <strong>Status:</strong> {orderStatus.order_status}
                </p>
                <p className="text-sm text-green-700">
                  <strong>Payment:</strong> Confirmed
                </p>
                {orderStatus.total_amount && (
                  <p className="text-sm text-green-700">
                    <strong>Amount:</strong> Rp {Number(orderStatus.total_amount).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-blue-800 mb-2">What's Next?</h4>
              <ul className="text-sm text-blue-700 text-left space-y-1">
                <li>✅ Your tickets are now available in your dashboard</li>
                <li>✅ You can view and download your tickets anytime</li>
                <li>✅ A confirmation email has been sent to your email address</li>
                <li>✅ Present your QR code at the event entrance</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Link 
                href="/customer/dashboard"
                className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                View My Tickets
              </Link>
              
              <Link 
                href="/events"
                className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Explore More Events
              </Link>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Redirecting to your dashboard in <strong>{redirectCountdown}</strong> seconds...
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${((10 - redirectCountdown) / 10) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs text-gray-500">
                Having issues? Contact our support team with Order ID: <strong>{orderId}</strong>
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Fallback for unexpected states
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-yellow-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Checking Payment Status...
          </h2>
          <p className="text-gray-600 mb-6">
            Please wait while we verify your payment.
          </p>
          <Link 
            href="/customer/dashboard"
            className="block w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}