"use client";

import React, { useState } from 'react';
import { FaCreditCard, FaLock } from 'react-icons/fa';

const StripePayment = ({ amount, onSuccess, onError, loading }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [errors, setErrors] = useState({});

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const formatCvc = (value) => {
    return value.replace(/\s+/g, '').replace(/[^0-9]/gi, '').substring(0, 4);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!expiry || expiry.length !== 5) {
      newErrors.expiry = 'Please enter a valid expiry date (MM/YY)';
    }
    
    if (!cvc || cvc.length < 3) {
      newErrors.cvc = 'Please enter a valid CVC';
    }
    
    if (!cardholderName || cardholderName.length < 2) {
      newErrors.cardholderName = 'Please enter cardholder name';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // In a real implementation, this would create a payment intent and handle Stripe Elements
    // For now, we'll simulate the flow
    try {
      // This would be replaced with actual Stripe integration
      // const paymentIntent = await createPaymentIntent({ amount });
      // const clientSecret = paymentIntent.client_secret;
      // Then use Stripe Elements to confirm payment
      
      onSuccess({
        paymentMethod: 'stripe',
        amount: amount,
        cardLast4: cardNumber.slice(-4)
      });
    } catch (error) {
      onError(error.message || 'Payment failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cardholder Name
        </label>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.cardholderName
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="John Doe"
        />
        {errors.cardholderName && (
          <p className="text-red-500 text-xs mt-1">{errors.cardholderName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Number
        </label>
        <div className="relative">
          <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.cardNumber
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
          />
        </div>
        {errors.cardNumber && (
          <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          <input
            type="text"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.expiry
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="MM/YY"
            maxLength={5}
          />
          {errors.expiry && (
            <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVC
          </label>
          <input
            type="text"
            value={cvc}
            onChange={(e) => setCvc(formatCvc(e.target.value))}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              errors.cvc
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="123"
            maxLength={4}
          />
          {errors.cvc && (
            <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
        <FaLock className="text-blue-600 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Secure Payment</p>
          <p className="text-blue-700">
            Your payment information is encrypted and secure. We never store your card details.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </button>
    </form>
  );
};

export default StripePayment;

