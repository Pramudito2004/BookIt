"use client";

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function TicketScanPage() {
  const [error, setError] = useState('');
  const scannerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  React.useEffect(() => {
    // Ensure we're on the client side and the ref is available
    if (!scannerRef.current) return;

    // Create a new scanner instance
    const scanner = new Html5QrcodeScanner(
      scannerRef.current.id, 
      { 
        fps: 10, 
        qrbox: 250 
      },
      /* verbose= */ false
    );

    // Define success callback
    const onScanSuccess = (decodedText: string) => {
      try {
        // Attempt to parse the data to ensure it's a valid ticket
        const parsedData = JSON.parse(decodedText);
        
        // Stop scanning
        scanner.clear();

        // Encode the data to pass safely in URL
        const encodedData = encodeURIComponent(decodedText);
        
        // Redirect to verification page
        router.push(`/tickets/verify?data=${encodedData}`);
      } catch (error) {
        setError('Invalid ticket data');
        console.error('Parsing error:', error);
      }
    };

    // Define error callback
    const onScanError = (errorMessage: string) => {
      // Handle scan errors if needed
      console.warn(`Scan error: ${errorMessage}`);
    };

    // Render the scanner
    scanner.render(onScanSuccess, onScanError);

    // Cleanup function
    return () => {
      scanner.clear();
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
              Scan Ticket QR Code
            </h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
                {error}
              </div>
            )}
            
            <div 
              ref={scannerRef} 
              id="reader" 
              className="w-full h-64"
            />
            
            <p className="text-sm text-gray-600 text-center mt-4">
              Position the QR code within the frame to scan
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}