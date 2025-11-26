"use client";

import React from 'react';
import { useSelector } from 'react-redux';
import { FaGift } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const GiftCardSummary = () => {
  const router = useRouter();
  const { giftCardTotalValue, giftCards } = useSelector(({ wallet }) => wallet);

  // Count only active/issued gift cards
  const activeGiftCards = giftCards?.filter(card => 
    ['active', 'issued'].includes(card.status)
  ).length || 0;

  return (
    <div className="mb-6">
      {/* Gift Card Value Card */}
      <div className="bg-gradient-to-r from-purple-500 via-purple-600 to-pink-600 rounded-lg p-6 text-white shadow-lg mb-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-purple-100 text-sm mb-2">Total Gift Card Value</p>
            <h2 className="text-4xl font-bold mb-1">
              ${(giftCardTotalValue || 0).toFixed(2)}
              <span className="text-xl font-normal ml-2 text-purple-100">USD</span>
            </h2>
            <p className="text-purple-100 text-sm">
              {activeGiftCards} Active Gift Card{activeGiftCards !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-full p-3">
            <FaGift className="text-3xl" />
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Gift Cards */}
        <button
          onClick={() => router.push('/user/wallet/gift-cards')}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-300 transition-all duration-200 text-left group"
        >
          <div className="flex flex-col">
            <div className="bg-purple-100 group-hover:bg-purple-200 rounded-full p-2 w-10 h-10 flex items-center justify-center mb-3 transition-colors">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
              Gift Cards
            </h3>
          </div>
        </button>

        {/* Send Gift Card */}
        <button
          onClick={() => router.push('/user/wallet/transfer')}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 text-left group"
        >
          <div className="flex flex-col">
            <div className="bg-blue-100 group-hover:bg-blue-200 rounded-full p-2 w-10 h-10 flex items-center justify-center mb-3 transition-colors">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
              Send Gift Card
            </h3>
          </div>
        </button>

        {/* Transfer Request */}
        <button
          onClick={() => router.push('/user/wallet/withdraw')}
          className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-300 transition-all duration-200 text-left group"
        >
          <div className="flex flex-col">
            <div className="bg-orange-100 group-hover:bg-orange-200 rounded-full p-2 w-10 h-10 flex items-center justify-center mb-3 transition-colors">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16v-4a8 8 0 10-16 0v4m16-4V8a4 4 0 00-8 0v4m8 4H1m16 0v4H1v-4" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
              Transfer Request
            </h3>
          </div>
        </button>
      </div>
    </div>
  );
};

export default GiftCardSummary;

