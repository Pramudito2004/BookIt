// src/app/components/MidtransSnap.tsx
"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options?: any) => void;
    };
  }
}

interface MidtransSnapProps {
  snapToken: string;
  onSuccess?: () => void;
  onPending?: () => void;
  onError?: () => void;
  onClose?: () => void;
}

const MidtransSnap: React.FC<MidtransSnapProps> = ({
  snapToken,
  onSuccess,
  onPending,
  onError,
  onClose,
}) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isScriptError, setIsScriptError] = useState(false);

  useEffect(() => {
    const midtransScriptUrl =
      process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL ||
      "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";

    console.log("Midtrans script URL:", midtransScriptUrl);
    console.log("Client key:", clientKey);
    console.log("Snap token:", snapToken);

    // Load Midtrans script
    const loadMidtransScript = () => {
      try {
        // Remove existing script if any
        const existingScript = document.querySelector(
          'script[src="' + midtransScriptUrl + '"]'
        );
        if (existingScript) {
          document.body.removeChild(existingScript);
        }

        const scriptTag = document.createElement("script");
        scriptTag.src = midtransScriptUrl;
        scriptTag.setAttribute("data-client-key", clientKey);

        scriptTag.onload = () => {
          console.log("Midtrans script loaded successfully");
          setIsScriptLoaded(true);
        };

        scriptTag.onerror = (error) => {
          console.error("Error loading Midtrans script:", error);
          setIsScriptError(true);
        };

        document.body.appendChild(scriptTag);

        return () => {
          if (document.body.contains(scriptTag)) {
            document.body.removeChild(scriptTag);
          }
        };
      } catch (error) {
        console.error("Error setting up Midtrans script:", error);
        setIsScriptError(true);
        return () => {};
      }
    };

    const cleanUp = loadMidtransScript();

    return cleanUp;
  }, []);

  // Open Snap payment page when script is loaded
  useEffect(() => {
    if (isScriptLoaded && snapToken && window.snap) {
      console.log("Opening Snap payment page");
      try {
        window.snap.pay(snapToken, {
          onSuccess: (result: any) => {
            console.log("Payment success:", result);
            onSuccess && onSuccess();
          },
          onPending: (result: any) => {
            console.log("Payment pending:", result);
            onPending && onPending();
          },
          onError: (result: any) => {
            console.error("Payment error!", result);
            onError && onError();
          },
          onClose: () => {
            console.log("Customer closed the payment window!");
            onClose && onClose();
          },
        });
      } catch (error) {
        console.error("Error opening Snap payment:", error);
        onError && onError();
      }
    } else if (isScriptError) {
      console.error("Script loading error, cannot proceed with payment");
      onError && onError();
    }
  }, [
    isScriptLoaded,
    isScriptError,
    snapToken,
    onSuccess,
    onPending,
    onError,
    onClose,
  ]);

  return null; // This component doesn't render anything
};

export default MidtransSnap;