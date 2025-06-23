// src/app/components/MidtransSnap.tsx
"use client";

import { useEffect, useRef } from 'react';

interface MidtransSnapProps {
  snapToken: string;
  onSuccess?: (result: any) => void;
  onPending?: (result: any) => void;
  onError?: (result: any) => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: any) => void;
      hide: () => void;
    };
  }
}

const MidtransSnap: React.FC<MidtransSnapProps> = ({
  snapToken,
  onSuccess,
  onPending,
  onError,
  onClose
}) => {
  const isInitialized = useRef(false);

  useEffect(() => {
    // Load Midtrans Snap script
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'; // Use app.midtrans.com for production
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '');
    script.async = true;

    script.onload = () => {
      if (!isInitialized.current && window.snap) {
        isInitialized.current = true;
        
        // Configure Snap payment
        window.snap.pay(snapToken, {
          onSuccess: (result: any) => {
            console.log('Payment success:', result);
            if (onSuccess) onSuccess(result);
          },
          onPending: (result: any) => {
            console.log('Payment pending:', result);
            if (onPending) onPending(result);
          },
          onError: (result: any) => {
            console.log('Payment error:', result);
            if (onError) onError(result);
          },
          onClose: () => {
            console.log('Payment popup closed');
            if (onClose) onClose();
          }
        });
      }
    };

    script.onerror = () => {
      console.error('Failed to load Midtrans Snap script');
      if (onError) onError({ error: 'Failed to load payment gateway' });
    };

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      
      // Hide snap if it's open
      if (window.snap) {
        try {
          window.snap.hide();
        } catch (error) {
          console.log('Error hiding snap:', error);
        }
      }
      
      isInitialized.current = false;
    };
  }, [snapToken, onSuccess, onPending, onError, onClose]);

  // This component doesn't render anything visible
  // The Midtrans Snap will create its own modal/popup
  return null;
};

export default MidtransSnap;