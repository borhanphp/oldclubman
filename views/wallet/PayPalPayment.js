"use client";

import React, { useState, useEffect } from 'react';
import { FaPaypal } from 'react-icons/fa';

const PayPalPayment = ({ amount, onSuccess, onError, loading }) => {
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  useEffect(() => {
    // In a real implementation, you would load PayPal SDK here
    // For now, we'll simulate it
    setPaypalLoaded(true);
  }, []);

  const handlePayPalClick = () => {
    // In a real implementation, this would create a PayPal order
    // and redirect to PayPal for approval
    // For now, we'll simulate success
    setTimeout(() => {
      onSuccess({
        paymentMethod: 'paypal',
        amount: amount
      });
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <FaPaypal className="text-4xl text-blue-600 mx-auto mb-4" />
        <p className="text-gray-700 mb-2">You will be redirected to PayPal to complete your payment</p>
        <p className="text-2xl font-bold text-gray-800">${amount.toFixed(2)}</p>
      </div>

      {paypalLoaded ? (
        <button
          onClick={handlePayPalClick}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <FaPaypal className="text-xl" />
          <span>{loading ? 'Processing...' : `Pay ${amount.toFixed(2)} with PayPal`}</span>
        </button>
      ) : (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <p className="text-gray-500 mt-2">Loading PayPal...</p>
        </div>
      )}

      <div className="text-xs text-gray-500 text-center">
        By clicking the button above, you will be redirected to PayPal's secure payment page
      </div>
    </div>
  );
};

export default PayPalPayment;

