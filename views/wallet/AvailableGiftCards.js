"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaGift, FaCheckCircle, FaCreditCard, FaSpinner, FaExclamationCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { getPaymentGateways, initiateWalletDeposit, getWalletBalance } from './store';
import { getMyProfile } from '@/views/settings/store';

const AvailableGiftCards = ({ onPurchaseSuccess }) => {
  const dispatch = useDispatch();
  const { paymentGateways, loading } = useSelector(({ wallet }) => wallet);
  const { profile } = useSelector(({ settings }) => settings);

  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedGateway, setSelectedGateway] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Predefined gift card amounts
  const giftCardAmounts = [
    { value: 10, label: '$10', popular: false },
    { value: 20, label: '$20', popular: true },
    { value: 50, label: '$50', popular: false },
    { value: 100, label: '$100', popular: false },
  ];

  useEffect(() => {
    dispatch(getPaymentGateways());
    dispatch(getMyProfile());
  }, [dispatch]);

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setShowCustomInput(false);
  };

  const handleCustomButtonClick = () => {
    setShowCustomInput(true);
    setSelectedAmount(null);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value && !isNaN(value) && parseFloat(value) > 0) {
      setSelectedAmount(parseFloat(value));
    } else {
      setSelectedAmount(null);
    }
  };

  const handlePurchase = async () => {
    if (!selectedAmount || selectedAmount < 1) {
      toast.error('Please select or enter a valid amount (minimum $1)');
      return;
    }

    if (!selectedGateway) {
      toast.error('Please select a payment method');
      return;
    }

    // Check if user has a cell number
    if (!profile?.client?.cell_number) {
      toast.error('Please add your cell number in settings before making a purchase');
      return;
    }

    setProcessing(true);

    try {
      const result = await dispatch(initiateWalletDeposit({
        amount_dollars: selectedAmount,
        payment_gateway_id: selectedGateway.id,
      })).unwrap();

      console.log('Payment initiated:', result);

      // If there's a payment URL, redirect to it
      if (result.payment_url) {
        window.location.href = result.payment_url;
      } else if (result.gateway_session_id) {
        // Handle session-based payments (like Stripe Checkout)
        toast.success('Redirecting to payment page...');
        // You can integrate Stripe or other payment SDK here
      } else {
        // Payment initiated successfully, refresh balance
        await dispatch(getWalletBalance());
        toast.success('Gift card added to your wallet!');
        if (onPurchaseSuccess) {
          onPurchaseSuccess();
        }
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      // Error already handled by toast in the thunk
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Amount Selection */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Amount</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {giftCardAmounts.map((amount) => (
            <button
              key={amount.value}
              onClick={() => handleAmountSelect(amount.value)}
              className={`relative p-6 rounded-lg border-2 transition-all duration-200 ${
                selectedAmount === amount.value && !customAmount
                  ? 'border-purple-600 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
              }`}
            >
              {amount.popular && (
                <span className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                  Popular
                </span>
              )}
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800 mb-1">{amount.label}</div>
                <div className="text-sm text-gray-500">Gift Card</div>
              </div>
              {selectedAmount === amount.value && !customAmount && (
                <div className="absolute bottom-2 right-2">
                  <FaCheckCircle className="text-purple-600 text-xl" />
                </div>
              )}
            </button>
          ))}
          
          {/* Custom Amount Button */}
          <button
            onClick={handleCustomButtonClick}
            className={`relative p-6 rounded-lg border-2 transition-all duration-200 ${
              showCustomInput
                ? 'border-purple-600 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800 mb-1">Custom</div>
              <div className="text-sm text-gray-500">Enter Amount</div>
            </div>
            {showCustomInput && (
              <div className="absolute bottom-2 right-2">
                <FaCheckCircle className="text-purple-600 text-xl" />
              </div>
            )}
          </button>
        </div>

        {/* Custom Amount Input (conditionally rendered) */}
        {showCustomInput && (
          <div className="mt-4 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter custom amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-semibold">
                $
              </span>
              <input
                type="number"
                value={customAmount}
                onChange={handleCustomAmountChange}
                onWheel={(e) => e.target.blur()}
                min="1"
                max="10000"
                step="0.01"
                placeholder="0.00"
                autoFocus
                className="w-full pl-10 pr-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg bg-white"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Minimum: $1.00 | Maximum: $10,000.00</p>
          </div>
        )}
      </div>

      {/* Payment Gateway Selection */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Payment Method</h2>
        
        {loading && paymentGateways.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <p className="text-gray-600 mt-2">Loading payment methods...</p>
          </div>
        ) : paymentGateways.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentGateways.map((gateway) => (
              <button
                key={gateway.id}
                onClick={() => setSelectedGateway(gateway)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedGateway?.id === gateway.id
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {gateway.logo ? (
                      <img
                        src={gateway.logo}
                        alt={gateway.display_name}
                        className="h-8 w-auto object-contain mr-3"
                      />
                    ) : (
                      <FaCreditCard className="text-2xl text-gray-400 mr-3" />
                    )}
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-800">{gateway.display_name}</h3>
                      {gateway.fee_percentage > 0 || gateway.fee_fixed > 0 ? (
                        <p className="text-xs text-gray-500">
                          Fee: {gateway.fee_percentage}%
                          {gateway.fee_fixed > 0 && ` + $${gateway.fee_fixed}`}
                        </p>
                      ) : (
                        <p className="text-xs text-green-600">No fees</p>
                      )}
                    </div>
                  </div>
                  {selectedGateway?.id === gateway.id && (
                    <FaCheckCircle className="text-purple-600 text-xl flex-shrink-0" />
                  )}
                </div>
                {gateway.description && (
                  <p className="text-xs text-gray-600 text-left">{gateway.description}</p>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600">No payment methods available</p>
            <p className="text-sm text-gray-500 mt-2">Please contact support</p>
          </div>
        )}
      </div>

      {/* Summary & Purchase Button */}
      {selectedAmount && selectedGateway && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Purchase Summary</h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-700">
              <span>Gift Card Amount:</span>
              <span className="font-semibold">${selectedAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Payment Method:</span>
              <span className="font-semibold">{selectedGateway.display_name}</span>
            </div>
            {(selectedGateway.fee_percentage > 0 || selectedGateway.fee_fixed > 0) && (
              <>
                <div className="flex justify-between text-gray-600 text-sm">
                  <span>Processing Fee:</span>
                  <span>
                    ${(
                      (selectedAmount * selectedGateway.fee_percentage / 100) +
                      selectedGateway.fee_fixed
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-purple-300 pt-2 mt-2">
                  <div className="flex justify-between text-gray-800 font-bold text-lg">
                    <span>Total:</span>
                    <span>
                      ${(
                        selectedAmount +
                        (selectedAmount * selectedGateway.fee_percentage / 100) +
                        selectedGateway.fee_fixed
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Cell Number Warning */}
          {!profile?.client?.cell_number && (
            <div className="mb-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <div className="flex items-start">
                <FaExclamationCircle className="text-yellow-600 text-xl mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-yellow-800 font-semibold mb-1">Cell Number Required</h4>
                  <p className="text-yellow-700 text-sm mb-2">
                    Please add your cell number to your profile before making a purchase.
                  </p>
                  <Link 
                    href="/user/account-settings" 
                    className="inline-block text-sm text-yellow-800 font-semibold hover:text-yellow-900 underline"
                  >
                    Update Profile →
                  </Link>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handlePurchase}
            disabled={processing || !profile?.client?.cell_number}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {processing ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <FaGift className="mr-2" />
                Complete Purchase
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AvailableGiftCards;

