// lib/midtrans.ts
import midtransClient from 'midtrans-client';

// Create Snap API instance
export const createSnapInstance = () => {
  return new midtransClient.Snap({
    // Set to true if you want to use the sandbox (development) environment
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY || '',
    clientKey: process.env.MIDTRANS_CLIENT_KEY || ''
  });
};

// Create Core API instance (for handling notifications etc.)
export const createCoreApiInstance = () => {
  return new midtransClient.CoreApi({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY || '',
    clientKey: process.env.MIDTRANS_CLIENT_KEY || ''
  });
};