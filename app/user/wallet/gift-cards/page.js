"use client";

import CommonLayout from '@/components/common/CommonLayout';
import React, { Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import AvailableGiftCards from '@/views/wallet/AvailableGiftCards';
import WalletSidebar from '@/views/wallet/WalletSidebar';
import GiftCardSummary from '@/components/wallet/GiftCardSummary';
import { getWalletBalance } from '@/views/wallet/store';

function GiftCardsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for transaction status in URL parameters
    const status = searchParams.get('status');
    const tranId = searchParams.get('tran_id');
    const amount = searchParams.get('amount');
    const currency = searchParams.get('currency');

    if (status && tranId) {
      // Convert amount from cents to dollars if needed
      const displayAmount = amount ? (parseFloat(amount) / 100).toFixed(2) : '0.00';
      
      // Show appropriate message based on status
      if (status === 'success') {
        toast.success(
          `Payment successful! ${currency || 'USD'} $${displayAmount} added to your wallet.`,
          { duration: 5000 }
        );
        // Reload wallet balance after successful transaction
        dispatch(getWalletBalance());
      } else if (status === 'failed' || status === 'fail') {
        toast.error(
          `Payment failed! Transaction ID: ${tranId}. Please try again.`,
          { duration: 5000 }
        );
      } else if (status === 'pending') {
        toast.loading(
          `Payment pending. Transaction ID: ${tranId}. Please wait for confirmation.`,
          { duration: 5000 }
        );
      } else if (status === 'cancelled' || status === 'cancel') {
        toast.error(
          `Payment cancelled. Transaction ID: ${tranId}.`,
          { duration: 4000 }
        );
      }

      // Clean up URL parameters after showing the message
      const timer = setTimeout(() => {
        router.replace('/user/wallet/gift-cards', { scroll: false });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [searchParams, router, dispatch]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto md:p-2 md:px-5">
        <div className="flex flex-wrap">
          <WalletSidebar />
          
          <div className="w-full lg:w-3/4">
            <GiftCardSummary />
            
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

