// src/app/payment/pending/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';

export default function PaymentPendingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [orderStatus, setOrderStatus] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  const orderId = searchParams.get('order_id');

  const checkPaymentStatus = async () => {
    if (!orderId) return;

    try {
      const response = await fetch(`/api/payments/status/${orderId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check payment status');
      }

      setOrderStatus(data);

      // If payment is completed, redirect to success page
      if (data.order_status === 'PAID') {
        router.push(`/payment/success?order_id=${orderId}`);
      }
    } catch (err: any) {
      console.error('Error checking payment status:', err);
      setError(err.message || 'Failed to verify payment');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!orderId) {
      setError('No order ID provided');
      setIsLoading(false);
      return;
    }

    // Initial check
    checkPaymentStatus();

    // Set up interval to check payment status every 10 seconds
    const interval = setInterval(checkPaymentStatus, 10000);
    setRefreshInterval(interval);

    // Cleanup interval on component unmount
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [orderId]);

  const handleManualRefresh = () => {
    setIsLoading(true);
    checkPaymentStatus();
  };

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
              Error Checking Payment
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button 
                onClick={handleManualRefresh}
                className="block w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
              <Link 
                href="/customer/dashboard"
                className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-yellow-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Payment Pending
          </h2>
          
          <p className="text-gray-600 mb-6">
            Your payment is being processed. This may take a few minutes depending on your payment method.
          </p>

          {orderStatus && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="text-left space-y-2">
                <p className="text-sm text-yellow-700">
                  <strong>Order ID:</strong> {orderId}
                </p>
                <p className="text-sm text-yellow-700">
                  <strong>Status:</strong> {orderStatus.order_status || 'PENDING'}
                </p>
                <p className="text-sm text-yellow-700">
                  <strong>Payment Status:</strong> {orderStatus.payment_status || 'PENDING'}
                </p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-800 mb-2">What's happening?</h4>
            <ul className="text-sm text-blue-700 text-left space-y-1">
              <li>• We're waiting for confirmation from your bank/payment provider</li>
              <li>• Bank transfers may take up to 1-2 business days</li>
              <li>• E-wallet payments are usually instant</li>
              <li>• Credit card payments are typically processed within minutes</li>
            </ul>
          </div>

          <div className="space-y-3">
            <button 
              onClick={handleManualRefresh}
              disabled={isLoading}
              className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Checking...
                </div>
              ) : (
                'Check Payment Status'
              )}
            </button>
            
            <Link 
              href="/customer/dashboard"
              className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-2">
              <strong>Auto-refresh:</strong> This page automatically checks for payment updates every 10 seconds.
            </p>
            <p className="text-xs text-gray-500">
              If you close this page, you can always check your payment status from your dashboard.
            </p>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-600">
              Need help? Contact our support team with your Order ID: <strong>{orderId}</strong>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}