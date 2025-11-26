"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaLock, FaSpinner, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { verifyTransferOTP, resendTransferOTP, cancelTransferRequest, getWalletBalance } from '@/views/wallet/store';

const TransferOTPVerification = ({ onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const { pendingTransfer, loading } = useSelector(({ wallet }) => wallet);
  
  const [otpCode, setOtpCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    if (!pendingTransfer) return;

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
  }, [pendingTransfer]);

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
      await dispatch(verifyTransferOTP({
        transfer_request_id: pendingTransfer.transfer_request_id,
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
      await dispatch(resendTransferOTP(pendingTransfer.transfer_request_id)).unwrap();
      setTimeLeft(300); // Reset timer
      setOtpCode(''); // Clear OTP input
    } catch (error) {
      // Error already handled by toast in the thunk
    }
  };

  const handleCancelRequest = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a reason for cancellation');
      return;
    }

    try {
      await dispatch(cancelTransferRequest({
        transfer_request_id: pendingTransfer.transfer_request_id,
        reason: cancelReason
      })).unwrap();

      setShowCancelModal(false);
      if (onCancel) onCancel();
    } catch (error) {
      // Error already handled by toast in the thunk
    }
  };

  if (!pendingTransfer) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FaLock className="text-3xl text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verify OTP</h2>
          <p className="text-gray-600 text-sm">
            We've sent a 6-digit code to your email and phone number
          </p>
        </div>

        {/* Transfer Summary */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Recipient:</span>
            <span className="font-semibold text-gray-800">{pendingTransfer.receiver_name || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Amount:</span>
            <span className="font-bold text-blue-600 text-lg">${pendingTransfer.amount_dollars}</span>
          </div>
          {pendingTransfer.description && (
            <div className="text-sm text-gray-600 mt-2 pt-2 border-t border-blue-200">
              <span className="block mb-1">Note:</span>
              <p className="text-gray-800 text-xs italic">{pendingTransfer.description}</p>
            </div>
          )}
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
            className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={6}
            autoFocus
          />
        </div>

        {/* Timer and Resend */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            {timeLeft > 0 ? (
              <>Time left: <span className="font-semibold text-blue-600">{formatTime(timeLeft)}</span></>
            ) : (
              <span className="text-red-600 font-semibold">OTP Expired</span>
            )}
          </div>
          <button
            onClick={handleResend}
            disabled={loading || timeLeft > 240} // Allow resend after 1 minute
            className="text-sm text-blue-600 hover:text-blue-700 font-semibold disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Resend OTP
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCancelModal(true)}
            disabled={loading}
            className="flex-1 px-4 py-3 border-2 border-red-300 text-red-600 font-semibold rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <FaTimes className="mr-2" />
            Cancel Request
          </button>
          <button
            onClick={handleVerify}
            disabled={loading || otpCode.length !== 6}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              'Verify & Send'
            )}
          </button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-gray-500 text-center mt-4">
          Didn't receive the code? Check your spam folder or click Resend OTP
        </p>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Cancel Transfer Request</h3>
            <p className="text-gray-600 text-sm mb-4">
              Are you sure you want to cancel this transfer? Please provide a reason for cancellation.
            </p>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Cancellation <span className="text-red-500">*</span>
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="e.g., Changed my mind, Wrong recipient, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={3}
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">{cancelReason.length}/200 characters</p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
                disabled={loading}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Keep Transfer
              </button>
              <button
                onClick={handleCancelRequest}
                disabled={loading || !cancelReason.trim()}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Cancelling...
                  </>
                ) : (
                  'Confirm Cancel'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferOTPVerification;

