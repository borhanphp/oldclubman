"use client";

import CommonLayout from '@/components/common/CommonLayout';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { FaGift, FaShoppingCart } from 'react-icons/fa';
import { getMyGiftCards, getAvailableGiftCards } from '@/views/wallet/store';
import AvailableGiftCards from '@/views/wallet/AvailableGiftCards';
import GiftCardList from '@/views/wallet/GiftCardList';
import WalletSidebar from '@/views/wallet/WalletSidebar';

export default function GiftCardsPage() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { giftCards, loading } = useSelector(({ wallet }) => wallet);
  const [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams?.get('tab');
    return tab === 'my-cards' ? 'my-cards' : 'purchase';
  });

  useEffect(() => {
    dispatch(getMyGiftCards());
    if (activeTab === 'purchase') {
      dispatch(getAvailableGiftCards());
    }
  }, [dispatch, activeTab]);

  const handlePurchaseSuccess = () => {
    dispatch(getMyGiftCards());
    setActiveTab('my-cards');
  };

  return (
    <CommonLayout>
      <div className="bg-gray-100 min-h-screen">
        <div className="mx-auto">
          <div className="flex flex-wrap">
            <WalletSidebar />
            
            <div className="w-full lg:w-3/4">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">Gift Cards</h1>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                  <button
                    onClick={() => setActiveTab('purchase')}
                    className={`px-6 py-3 font-medium transition-colors ${
                      activeTab === 'purchase'
                        ? 'border-b-2 border-purple-500 text-purple-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <FaShoppingCart className="inline mr-2" />
                    Purchase Gift Cards
                  </button>
                  <button
                    onClick={() => setActiveTab('my-cards')}
                    className={`px-6 py-3 font-medium transition-colors ${
                      activeTab === 'my-cards'
                        ? 'border-b-2 border-purple-500 text-purple-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <FaGift className="inline mr-2" />
                    My Gift Cards
                  </button>
                </div>

                {/* Content */}
                {activeTab === 'purchase' ? (
                  <AvailableGiftCards onPurchaseSuccess={handlePurchaseSuccess} />
                ) : (
                  <GiftCardList giftCards={giftCards} loading={loading} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}

