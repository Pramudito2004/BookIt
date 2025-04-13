"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

interface TicketVerificationData {
  ticketId: string;
  eventId: string;
  eventTitle: string;
  ticketCode: string;
  buyerName: string;
  buyerEmail: string;
  status: string;
  validationTimestamp: string;
  hash: string;
}

export default function TicketVerifyPage() {
  const searchParams = useSearchParams();
  const [verificationData, setVerificationData] = useState<TicketVerificationData | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    message: string;
    details?: any;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the encoded ticket data from URL
    const encodedData = searchParams.get('data');

    if (encodedData) {
      try {
        // Decode the ticket data
        const decodedData = decodeURIComponent(encodedData);
        const parsedData: TicketVerificationData = JSON.parse(decodedData);
        setVerificationData(parsedData);

        // Verify the ticket
        verifyTicket(parsedData);
      } catch (error) {
        console.error('Error parsing ticket data:', error);
        setVerificationResult({
          valid: false,
          message: 'Invalid ticket data format'
        });
        setIsLoading(false);
      }
    } else {
      setVerificationResult({
        valid: false,
        message: 'No ticket data provided'
      });
      setIsLoading(false);
    }
  }, [searchParams]);

  const verifyTicket = async (ticketData: TicketVerificationData) => {
    try {
      const response = await fetch('/api/tickets/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData)
      });

      const result = await response.json();
      setVerificationResult(result);
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({
        valid: false,
        message: 'Network error during verification'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying ticket...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Render verification result
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className={`
          rounded-xl shadow-md p-8 max-w-md mx-auto
          ${verificationResult?.valid 
            ? 'bg-green-50 border-2 border-green-500' 
            : 'bg-red-50 border-2 border-red-500'
          }
        `}>
          <div className="text-center">
            {verificationResult?.valid ? (
              <svg 
                className="w-20 h-20 text-green-600 mx-auto mb-4" 
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
            ) : (
              <svg 
                className="w-20 h-20 text-red-600 mx-auto mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            )}
            
            <h2 className={`
              text-2xl font-bold mb-4
              ${verificationResult?.valid ? 'text-green-800' : 'text-red-800'}
            `}>
              {verificationResult?.valid ? 'Ticket Valid' : 'Ticket Invalid'}
            </h2>
            
            <p className={`
              mb-6
              ${verificationResult?.valid ? 'text-green-700' : 'text-red-700'}
            `}>
              {verificationResult?.message}
            </p>

            {verificationResult?.valid && verificationData && (
              <div className="bg-white rounded-lg p-4 text-left">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Ticket Details</h3>
                <div className="space-y-2">
                  <p><strong>Event:</strong> {verificationData.eventTitle}</p>
                  <p><strong>Ticket Code:</strong> {verificationData.ticketCode}</p>
                  <p><strong>Buyer:</strong> {verificationData.buyerName}</p>
                  <p><strong>Status:</strong> {verificationData.status}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}