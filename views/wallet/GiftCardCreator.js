"use client";

import React, { useState } from 'react';
import { FaGift, FaCheck } from 'react-icons/fa';

const GiftCardCreator = ({ onPurchase, balance, loading }) => {
  const [amount, setAmount] = useState('');
  const [design, setDesign] = useState('default');
  const [errors, setErrors] = useState({});

  const designs = [
    { id: 'default', name: 'Classic', color: 'bg-gradient-to-br from-blue-500 to-purple-600' },
    { id: 'elegant', name: 'Elegant', color: 'bg-gradient-to-br from-pink-500 to-red-600' },
    { id: 'modern', name: 'Modern', color: 'bg-gradient-to-br from-green-500 to-teal-600' },
    { id: 'festive', name: 'Festive', color: 'bg-gradient-to-br from-yellow-500 to-orange-600' }
  ];

  const validateAmount = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 1) {
      return 'Minimum amount is $1';
    }
    if (numValue > 200) {
      return 'Maximum amount is $200';
    }
    if (numValue > balance) {
      return 'Insufficient balance';
    }
    return null;
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    const error = validateAmount(value);
    setErrors({ ...errors, amount: error });
  };

  const handlePurchase = () => {
    const error = validateAmount(amount);
    if (error) {
      setErrors({ amount: error });
      return;
    }

    onPurchase({
      amount: parseFloat(amount),
      design
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gift Card Amount (USD) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            onWheel={(e) => e.target.blur()}
            min="1"
            max="200"
            step="0.01"
            className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 text-lg ${
              errors.amount
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            placeholder="0.00"
          />
        </div>
        {errors.amount && (
          <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">Minimum: $1.00 | Maximum: $200.00</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Design
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {designs.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDesign(d.id)}
              className={`relative p-4 rounded-lg border-2 transition-all ${
                design === d.id
                  ? 'border-blue-500 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`${d.color} rounded-lg h-20 mb-2 flex items-center justify-center`}>
                <FaGift className="text-white text-2xl" />
              </div>
              <p className="text-sm font-medium text-gray-700">{d.name}</p>
              {design === d.id && (
                <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                  <FaCheck className="text-white text-xs" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      {amount && parseFloat(amount) >= 1 && parseFloat(amount) <= 200 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p className="text-sm font-medium text-gray-700 mb-4">Preview</p>
          <div className={`${designs.find(d => d.id === design)?.color} rounded-lg p-8 text-white text-center shadow-lg`}>
            <FaGift className="text-5xl mx-auto mb-4" />
            <p className="text-3xl font-bold mb-2">${parseFloat(amount || 0).toFixed(2)}</p>
            <p className="text-sm opacity-90">Gift Card</p>
          </div>
        </div>
      )}

      <button
        onClick={handlePurchase}
        disabled={loading || !amount || parseFloat(amount) < 1 || parseFloat(amount) > 200}
        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : `Purchase Gift Card for $${parseFloat(amount || 0).toFixed(2)}`}
      </button>
    </div>
  );
};

export default GiftCardCreator;

