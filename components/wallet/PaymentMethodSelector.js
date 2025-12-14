"use client";

import React from 'react';
import { FaCreditCard, FaPaypal, FaMobileAlt } from 'react-icons/fa';

const PaymentMethodSelector = ({ activeMethod, onMethodChange }) => {
  const methods = [
    {
      id: 'stripe',
      label: 'Credit Card',
      icon: FaCreditCard,
      description: 'Visa, Mastercard, Amex'
    },
    {
      id: 'paypal',
      label: 'PayPal',
      icon: FaPaypal,
      description: 'Pay with PayPal'
    },
    {
      id: 'mobile',
      label: 'Mobile Banking',
      icon: FaMobileAlt,
      description: 'bKash, Nagad, Rocket'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {methods.map((method) => {
        const Icon = method.icon;
        const isActive = activeMethod === method.id;
        
        return (
          <button
            key={method.id}
            onClick={() => onMethodChange(method.id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              isActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <Icon
                className={`text-3xl mb-2 ${
                  isActive ? 'text-blue-600' : 'text-gray-400'
                }`}
              />
              <p
                className={`font-semibold mb-1 ${
                  isActive ? 'text-blue-600' : 'text-gray-700'
                }`}
              >
                {method.label}
              </p>
              <p className="text-xs text-gray-500">{method.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PaymentMethodSelector;

