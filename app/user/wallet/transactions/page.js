"use client";

import CommonLayout from '@/components/common/CommonLayout';
import React from 'react';
import TransactionList from '@/views/wallet/TransactionList';
import WalletSidebar from '@/views/wallet/WalletSidebar';
import GiftCardSummary from '@/components/wallet/GiftCardSummary';

export default function TransactionsPage() {
  return (
    <CommonLayout>
      <div className="bg-gray-100 min-h-screen">
        <div className="mx-auto md:p-2 md:px-5">
          <div className="flex flex-wrap">
            <WalletSidebar />
            
            <div className="w-full lg:w-3/4">
              <GiftCardSummary />
              
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Transaction History</h1>
                <TransactionList />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}

