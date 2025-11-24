"use client";

import CommonLayout from '@/components/common/CommonLayout';
import React, { Suspense } from 'react';
import AvailableGiftCards from '@/views/wallet/AvailableGiftCards';
import WalletSidebar from '@/views/wallet/WalletSidebar';

function GiftCardsContent() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto">
        <div className="flex flex-wrap">
          <WalletSidebar />
          
          <div className="w-full lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Purchase Gift Cards</h1>
              </div>

              {/* Content */}
              <AvailableGiftCards />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GiftCardsPage() {
  return (
    <CommonLayout>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading gift cards...</div>}>
        <GiftCardsContent />
      </Suspense>
    </CommonLayout>
  );
}

