"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';
import PaymentMethodSelector from '@/components/wallet/PaymentMethodSelector';
import StripePayment from './StripePayment';
import PayPalPayment from './PayPalPayment';
import MobileBankingDeposit from './MobileBankingDeposit';
import GiftCardSummary from '@/components/wallet/GiftCardSummary';
import WalletSidebar from './WalletSidebar';
import {
  initiateStripeDeposit,
  initiatePayPalDeposit,
  submitMobileDeposit,
  getWalletBalance,
  getMyGiftCards
} from './store';

const DepositForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getMyGiftCards());
  }, [dispatch]);

  const validateAmount = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 1) {
      return 'Minimum amount is $1';
    }
    return null;
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    const error = validateAmount(value);
    setErrors({ ...errors, amount: error });
  };

  const handleStripeSuccess = async (data) => {
    setLoading(true);
    try {
      await dispatch(initiateStripeDeposit({
        amount: parseFloat(amount),
        ...data
      })).unwrap();
      
      await dispatch(getWalletBalance());
      toast.success('Gift card purchased successfully!');
      router.push('/user/wallet');
    } catch (error) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalSuccess = async (data) => {
    setLoading(true);
    try {
      await dispatch(initiatePayPalDeposit({
        amount: parseFloat(amount),
        ...data
      })).unwrap();
      
      await dispatch(getWalletBalance());
      toast.success('Gift card purchased successfully!');
      router.push('/user/wallet');
    } catch (error) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const handleMobileSuccess = async (data) => {
    setLoading(true);
    try {
      await dispatch(submitMobileDeposit({
        amount: parseFloat(amount),
        ...data
      })).unwrap();
      
      router.push('/user/wallet');
    } catch (error) {
      toast.error(error.message || 'Failed to purchase gift card');
    } finally {
      setLoading(false);
    }
  };

  const handleError = (message) => {
    toast.error(message);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto md:p-5 md:px-10">
        <div className="flex flex-wrap">
          <WalletSidebar />
          
          <div className="w-full lg:w-3/4">
            <GiftCardSummary />
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <button
              onClick={() => router.back()}
              className="text-blue-500 mr-4 hover:text-blue-600"
            >
              <FaArrowLeft className="text-xl" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Purchase Gift Cards</h1>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (USD) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                min="1"
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
            <p className="text-xs text-gray-500 mt-1">Minimum amount: $1.00</p>
          </div>

          <PaymentMethodSelector
            activeMethod={paymentMethod}
            onMethodChange={setPaymentMethod}
          />

          <div className="mt-6">
            {paymentMethod === 'stripe' && (
              <StripePayment
                amount={parseFloat(amount) || 0}
                onSuccess={handleStripeSuccess}
                onError={handleError}
                loading={loading}
              />
            )}

            {paymentMethod === 'paypal' && (
              <PayPalPayment
                amount={parseFloat(amount) || 0}
                onSuccess={handlePayPalSuccess}
                onError={handleError}
                loading={loading}
              />
            )}

            {paymentMethod === 'mobile' && (
              <MobileBankingDeposit
                amount={parseFloat(amount) || 0}
                onSuccess={handleMobileSuccess}
                onError={handleError}
                loading={loading}
              />
            )}
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositForm;

