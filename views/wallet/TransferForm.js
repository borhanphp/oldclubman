"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import toast from 'react-hot-toast';
import GiftCardSummary from '@/components/wallet/GiftCardSummary';
import WalletSidebar from './WalletSidebar';
import TransferOTPVerification from '@/components/wallet/TransferOTPVerification';
import { transferBalance, getWalletBalance, getMyGiftCards } from './store';
import api from '@/helpers/axios';

const TransferForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { balance } = useSelector(({ wallet }) => wallet);
  const walletBalance = typeof balance === 'number' ? balance : parseFloat(balance) || 0;
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getWalletBalance());
    dispatch(getMyGiftCards());
  }, [dispatch]);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setSearching(true);
      try {
        const response = await api.get(`/client/search_by_people?search=${encodeURIComponent(searchQuery)}`);
        setSearchResults(response.data.data?.follow_connections || []);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const validateAmount = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 1) {
      return 'Minimum amount is $1';
    }
    if (numValue > walletBalance) {
      return 'Insufficient balance';
    }
    return null;
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    const error = validateAmount(value);
    setErrors({ ...errors, amount: error });
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchQuery(user.username || user.email || '');
    setSearchResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      toast.error('Please select a recipient');
      return;
    }

    const amountError = validateAmount(amount);
    if (amountError) {
      setErrors({ amount: amountError });
      return;
    }

    if (message.length > 500) {
      toast.error('Message must be 500 characters or less');
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmTransfer = async () => {
    setLoading(true);
    try {
      await dispatch(transferBalance({
        receiver_identifier: selectedUser.id,
        amount_dollars: parseFloat(amount),
        description: message.trim() || null
      })).unwrap();

      // Close confirmation modal and show OTP modal
      setShowConfirm(false);
      setShowOTP(true);
    } catch (error) {
      toast.error(error.message || 'Failed to send gift card');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSuccess = () => {
    setShowOTP(false);
    router.push('/user/wallet');
  };

  const handleOTPCancel = () => {
    setShowOTP(false);
    // Reset form
    setSelectedUser(null);
    setSearchQuery('');
    setAmount('');
    setMessage('');
  };

  const newBalance = walletBalance - parseFloat(amount || 0);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto md:p-2 md:px-5">
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
            <h1 className="text-2xl font-bold text-gray-800">Send Gift Card</h1>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Available Balance:</strong> ${walletBalance.toFixed(2)}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Recipient <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedUser(null);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search by username or email"
                />
              </div>

              {searching && (
                <div className="mt-2 text-sm text-gray-500">Searching...</div>
              )}

              {searchResults.length > 0 && !selectedUser && (
                <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleSelectUser(user)}
                      className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                        <img
                          src={user.image ? process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + user.image : "/common-avator.jpg"}
                          alt={user.fname}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-800">
                          {user.fname} {user.last_name}
                        </p>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedUser && (
                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    <img
                      src={selectedUser.image ? process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + selectedUser.image : "/common-avator.jpg"}
                      alt={selectedUser.fname}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {selectedUser.fname} {selectedUser.last_name}
                    </p>
                    <p className="text-sm text-gray-500">@{selectedUser.username}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUser(null);
                      setSearchQuery('');
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transfer Amount (USD) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  onWheel={(e) => e.target.blur()}
                  min="1"
                  max={balance}
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
              <p className="text-xs text-gray-500 mt-1">Minimum transfer: $1.00</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transfer Note (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a note for this gift card..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {message.length}/500 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !selectedUser || !amount}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span>Continue</span>
              <FaArrowRight />
            </button>
          </form>

          {/* Confirmation Modal */}
          {showConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Gift Card</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recipient:</span>
                    <span className="font-medium">
                      {selectedUser?.fname} {selectedUser?.last_name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-green-600">${parseFloat(amount || 0).toFixed(2)}</span>
                  </div>
                  {message && (
                    <div>
                      <span className="text-gray-600">Note:</span>
                      <p className="text-sm text-gray-700 mt-1">{message}</p>
                    </div>
                  )}
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Balance:</span>
                      <span className="font-medium">${walletBalance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-600">New Balance:</span>
                      <span className="font-medium">${newBalance.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    disabled={loading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmTransfer}
                    disabled={loading}
                    className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Confirm Send'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* OTP Verification Modal */}
          {showOTP && (
            <TransferOTPVerification
              onSuccess={handleOTPSuccess}
              onCancel={handleOTPCancel}
            />
          )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferForm;

