"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaLock, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { verifyGiftCardPurchase, resendGiftCardOTP, getWalletBalance } from '@/views/wallet/store';

const GiftCardOTPVerification = ({ onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const { pendingPurchase, loading } = useSelector(({ wallet }) => wallet);
  
  const [otpCode, setOtpCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    if (!pendingPurchase) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [pendingPurchase]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async () => {
    if (!otpCode || otpCode.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP code');
      return;
    }

    try {
      await dispatch(verifyGiftCardPurchase({
        purchase_request_id: pendingPurchase.purchase_request_id,
        otp_code: otpCode
      })).unwrap();

      // Refresh balance
      await dispatch(getWalletBalance());
      
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error already handled by toast in the thunk
    }
  };

  const handleResend = async () => {
    try {
      await dispatch(resendGiftCardOTP(pendingPurchase.purchase_request_id)).unwrap();
      setTimeLeft(300); // Reset timer
      setOtpCode(''); // Clear OTP input
    } catch (error) {
      // Error already handled by toast in the thunk
    }
  };

  if (!pendingPurchase) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <FaLock className="text-3xl text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</h2>
          <p className="text-gray-600 text-sm">
            We've sent a 6-digit code to your email and phone number
          </p>
        </div>

        {/* Purchase Summary */}
        <div className="bg-purple-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Product:</span>
            <span className="font-semibold text-gray-800">{pendingPurchase.product_name}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Quantity:</span>
            <span className="font-semibold text-gray-800">{pendingPurchase.quantity}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Unit Price:</span>
            <span className="font-semibold text-gray-800">${pendingPurchase.unit_price_dollars}</span>
          </div>
          <div className="border-t border-purple-200 mt-2 pt-2">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-800">Total Amount:</span>
              <span className="font-bold text-purple-600 text-lg">${pendingPurchase.total_amount_dollars}</span>
            </div>
          </div>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter 6-Digit OTP
          </label>
          <input
            type="text"
            value={otpCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setOtpCode(value);
            }}
            placeholder="000000"
            className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            maxLength={6}
            autoFocus
          />
        </div>

        {/* Timer and Resend */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            {timeLeft > 0 ? (
              <>Time left: <span className="font-semibold text-purple-600">{formatTime(timeLeft)}</span></>
            ) : (
              <span className="text-red-600 font-semibold">OTP Expired</span>
            )}
          </div>
          <button
            onClick={handleResend}
            disabled={loading || timeLeft > 240} // Allow resend after 1 minute
            className="text-sm text-purple-600 hover:text-purple-700 font-semibold disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Resend OTP
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            disabled={loading || otpCode.length !== 6}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              'Verify & Complete'
            )}
          </button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Didn't receive the code? Check your spam folder or click Resend OTP
        </p>
      </div>
    </div>
  );
};

export default GiftCardOTPVerification;

