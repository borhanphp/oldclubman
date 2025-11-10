"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaGift, FaArrowLeft } from 'react-icons/fa';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { giftCard } from './store';
import api from '@/helpers/axios';

const GiftCardGifting = ({ giftCardData, onSuccess }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      setSearching(true);
      try {
        // This would be replaced with actual user search API
        const response = await api.get(`/client/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchResults(response.data.data || []);
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

    if (message.length > 500) {
      toast.error('Message must be 500 characters or less');
      return;
    }

    setLoading(true);
    try {
      await giftCard({
        gift_card_id: giftCardData.id,
        recipient_id: selectedUser.id,
        message: message.trim() || null
      }).unwrap();

      toast.success('Gift card sent successfully!');
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/user/wallet/gift-cards');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to send gift card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.back()}
            className="text-blue-500 mr-4 hover:text-blue-600"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <h2 className="text-xl font-bold text-gray-800">Gift Card Details</h2>
        </div>

        <div className={`bg-gradient-to-br ${
          giftCardData.design === 'elegant' ? 'from-pink-500 to-red-600' :
          giftCardData.design === 'modern' ? 'from-green-500 to-teal-600' :
          giftCardData.design === 'festive' ? 'from-yellow-500 to-orange-600' :
          'from-blue-500 to-purple-600'
        } rounded-lg p-8 text-white text-center shadow-lg`}>
          <FaGift className="text-5xl mx-auto mb-4" />
          <p className="text-4xl font-bold mb-2">${parseFloat(giftCardData.amount || 0).toFixed(2)}</p>
          <p className="text-sm opacity-90">Gift Card</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-4">
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
            Personal Message (Optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a personal message to your gift..."
          />
          <p className="text-xs text-gray-500 mt-1">
            {message.length}/500 characters
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedUser}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Gift Card'}
        </button>
      </form>
    </div>
  );
};

export default GiftCardGifting;

