"use client";

import CommonLayout from '@/components/common/CommonLayout';
import DepositForm from '@/views/wallet/DepositForm';
import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { getWalletBalance } from '@/views/wallet/store';

export default function DepositPage() {
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
        router.replace('/user/wallet/deposit', { scroll: false });
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [searchParams, router, dispatch]);

  return (
    <CommonLayout>
      <DepositForm />
    </CommonLayout>
  );
}

