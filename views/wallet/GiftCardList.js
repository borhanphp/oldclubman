"use client";

import React, { useState } from 'react';
import { FaGift, FaCopy, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import StatusBadge from '@/components/wallet/StatusBadge';
import toast from 'react-hot-toast';

const GiftCardList = ({ giftCards, loading }) => {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyCode = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success('Gift card code copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const maskCode = (code) => {
    if (!code) return 'N/A';
    if (code.length <= 8) return code;
    return '****' + code.slice(-4);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!giftCards || giftCards.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <FaGift className="text-5xl text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">No gift cards yet</p>
        <p className="text-sm text-gray-500">Purchase your first gift card to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {giftCards.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          <div className={`bg-gradient-to-br ${
            card.design === 'elegant' ? 'from-pink-500 to-red-600' :
            card.design === 'modern' ? 'from-green-500 to-teal-600' :
            card.design === 'festive' ? 'from-yellow-500 to-orange-600' :
            'from-blue-500 to-purple-600'
          } p-6 text-white text-center`}>
            <FaGift className="text-4xl mx-auto mb-3" />
            <p className="text-3xl font-bold mb-1">${parseFloat(card.amount || 0).toFixed(2)}</p>
            <p className="text-sm opacity-90">Gift Card</p>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <StatusBadge status={card.status} />
              <span className="text-xs text-gray-500">{formatDate(card.created_at)}</span>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Gift Card Code</p>
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                <code className="text-sm font-mono text-gray-800">{maskCode(card.code)}</code>
                <button
                  onClick={() => handleCopyCode(card.code, card.id)}
                  className="text-blue-500 hover:text-blue-600 p-1"
                  title="Copy code"
                >
                  <FaCopy className={copiedId === card.id ? 'text-green-500' : ''} />
                </button>
              </div>
            </div>

            {card.status === 'active' && (
              <Link
                href={`/user/wallet/gift-cards/${card.id}`}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>Gift to Someone</span>
                <FaArrowRight className="text-sm" />
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GiftCardList;

