"use client";

import React, { useEffect, useState } from 'react';
import { FaGift, FaCreditCard, FaPaypal, FaMobileAlt } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getAvailableGiftCards, purchaseGiftCardWithPayment } from './store';
import PaymentMethodSelector from '@/components/wallet/PaymentMethodSelector';
import StripePayment from './StripePayment';
import PayPalPayment from './PayPalPayment';
import MobileBankingDeposit from './MobileBankingDeposit';
import toast from 'react-hot-toast';

const AvailableGiftCards = ({ onPurchaseSuccess }) => {
  const dispatch = useDispatch();
  const { availableGiftCards, loading } = useSelector(({ wallet }) => wallet);
  const [selectedCard, setSelectedCard] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    dispatch(getAvailableGiftCards());
  }, [dispatch]);

  const handleCardSelect = (card) => {
    setSelectedCard(card);
    setPaymentMethod(null);
  };

  const handleStripeSuccess = async (data) => {
    setIsProcessing(true);
    try {
      await dispatch(purchaseGiftCardWithPayment({
        gift_card_id: selectedCard.id,
        payment_method: 'stripe',
        ...data
      })).unwrap();
      
      toast.success('Gift card purchased successfully!');
      setSelectedCard(null);
      setPaymentMethod(null);
      if (onPurchaseSuccess) {
        onPurchaseSuccess();
      }
    } catch (error) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalSuccess = async (data) => {
    setIsProcessing(true);
    try {
      await dispatch(purchaseGiftCardWithPayment({
        gift_card_id: selectedCard.id,
        payment_method: 'paypal',
        ...data
      })).unwrap();
      
      toast.success('Gift card purchased successfully!');
      setSelectedCard(null);
      setPaymentMethod(null);
      if (onPurchaseSuccess) {
        onPurchaseSuccess();
      }
    } catch (error) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMobileSuccess = async (data) => {
    setIsProcessing(true);
    try {
      await dispatch(purchaseGiftCardWithPayment({
        gift_card_id: selectedCard.id,
        payment_method: 'mobile',
        ...data
      })).unwrap();
      
      toast.success('Gift card purchase request submitted. Waiting for admin verification.');
      setSelectedCard(null);
      setPaymentMethod(null);
      if (onPurchaseSuccess) {
        onPurchaseSuccess();
      }
    } catch (error) {
      toast.error(error.message || 'Failed to submit purchase');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Show demo cards even if API hasn't loaded yet (for testing)
  const displayCards = availableGiftCards && availableGiftCards.length > 0 
    ? availableGiftCards 
    : [
        { id: 1, amount: 10, description: "Perfect for small purchases" },
        { id: 2, amount: 20, description: "Great value gift card" },
        { id: 3, amount: 50, description: "Premium gift card option" },
        { id: 4, amount: 100, description: "Maximum value gift card" }
      ];

  if (!displayCards || displayCards.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <FaGift className="text-5xl text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-2">No gift cards available</p>
        <p className="text-sm text-gray-500">Please check back later</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!selectedCard ? (
        <>
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Available Gift Cards</h2>
            <p className="text-sm text-gray-600 mb-4">Select a gift card to purchase</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {displayCards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardSelect(card)}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-purple-500 hover:shadow-md transition-all text-left"
              >
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-6 text-white text-center mb-4">
                  <FaGift className="text-4xl mx-auto mb-3" />
                  <p className="text-3xl font-bold mb-1">${parseFloat(card.amount || 0).toFixed(2)}</p>
                  <p className="text-sm opacity-90">Gift Card</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-800">${parseFloat(card.amount || 0).toFixed(2)}</p>
                  {card.description && (
                    <p className="text-sm text-gray-500 mt-1">{card.description}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Purchase Gift Card</h2>
            <button
              onClick={() => {
                setSelectedCard(null);
                setPaymentMethod(null);
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
          </div>

          {/* Selected Card Preview */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-8 text-white text-center shadow-lg">
            <FaGift className="text-5xl mx-auto mb-4" />
            <p className="text-4xl font-bold mb-2">${parseFloat(selectedCard.amount || 0).toFixed(2)}</p>
            <p className="text-sm opacity-90">Gift Card</p>
          </div>

          {/* Payment Method Selection */}
          {!paymentMethod ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Payment Method</h3>
              <PaymentMethodSelector
                activeMethod={paymentMethod}
                onMethodChange={setPaymentMethod}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Complete Payment</h3>
                <button
                  onClick={() => setPaymentMethod(null)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Change Method
                </button>
              </div>

              {paymentMethod === 'stripe' && (
                <StripePayment
                  amount={parseFloat(selectedCard.amount)}
                  onSuccess={handleStripeSuccess}
                  onError={(msg) => toast.error(msg)}
                  loading={isProcessing}
                />
              )}

              {paymentMethod === 'paypal' && (
                <PayPalPayment
                  amount={parseFloat(selectedCard.amount)}
                  onSuccess={handlePayPalSuccess}
                  onError={(msg) => toast.error(msg)}
                  loading={isProcessing}
                />
              )}

              {paymentMethod === 'mobile' && (
                <MobileBankingDeposit
                  amount={parseFloat(selectedCard.amount)}
                  onSuccess={handleMobileSuccess}
                  onError={(msg) => toast.error(msg)}
                  loading={isProcessing}
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AvailableGiftCards;

