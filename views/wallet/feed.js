"use client";

import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { FaGift, FaHistory, FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import { getMyGiftCards, getTransactions, getWalletBalance } from './store';
import WalletSidebar from './WalletSidebar';
import StatusBadge from '@/components/wallet/StatusBadge';

const WalletDashboard = () => {
  const dispatch = useDispatch();
  const { giftCards, transactions, loading, giftCardTotalValue } = useSelector(({ wallet }) => wallet);

  // Use gift card total value from API
  const totalGiftCardValue = giftCardTotalValue || 0;

  useEffect(() => {
    dispatch(getWalletBalance());
    dispatch(getMyGiftCards());
    dispatch(getTransactions({ limit: 5 }));
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(getWalletBalance());
    dispatch(getMyGiftCards());
    dispatch(getTransactions({ limit: 5 }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getTransactionIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'gift_card_purchase':
        return <FaShoppingCart className="text-purple-500" />;
      case 'gift_card_transfer':
      case 'gift_card_received':
        return <FaArrowRight className="text-blue-500" />;
      case 'gift_card_sent':
        return <FaGift className="text-pink-500" />;
      default:
        return <FaHistory className="text-gray-500" />;
    }
  };

  const formatAmount = (amount, type) => {
    const numAmount = typeof amount === 'number' ? amount : parseFloat(amount || 0);
    const sign = ['gift_card_received', 'gift_card_purchase'].includes(type?.toLowerCase()) ? '+' : '-';
    return `${sign}$${Math.abs(numAmount).toFixed(2)}`;
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto md:p-5 md:px-10">
        <div className="flex flex-wrap">
          <WalletSidebar />
          
          <div className="w-full lg:w-3/4">
            <div className="mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium mb-1">Total Gift Card Value</p>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">${totalGiftCardValue.toFixed(2)}</span>
                      <span className="text-xl ml-1 text-purple-100">USD</span>
                    </div>
                    <p className="text-sm text-purple-100 mt-2">
                      {giftCards?.filter(c => c.status === 'active').length || 0} Active Gift Cards
                    </p>
                  </div>
                  <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors disabled:opacity-50"
                    title="Refresh"
                  >
                    <FaGift className={`text-2xl ${loading ? 'animate-pulse' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Link
                href="/user/wallet/gift-cards"
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Purchase</p>
                    <p className="text-2xl font-bold text-gray-800">Gift Cards</p>
                  </div>
                  <div className="bg-purple-100 rounded-full p-4">
                    <FaShoppingCart className="text-purple-600 text-xl" />
                  </div>
                </div>
              </Link>

              <Link
                href="/user/wallet/transactions"
                className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Transaction</p>
                    <p className="text-2xl font-bold text-gray-800">History</p>
                  </div>
                  <div className="bg-blue-100 rounded-full p-4">
                    <FaHistory className="text-blue-600 text-xl" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
                <Link
                  href="/user/wallet/transactions"
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center"
                >
                  View All
                  <FaArrowRight className="ml-1 text-xs" />
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : transactions && transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.map((transaction, index) => (
                    <div
                      key={transaction.id || index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 capitalize">
                            {transaction.type?.replace('_', ' ') || 'Transaction'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(transaction.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <StatusBadge status={transaction.status} />
                        <div className="text-right">
                          <p
                            className={`font-bold ${
                              ['deposit', 'gift_card_received'].includes(transaction.type?.toLowerCase())
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {formatAmount(transaction.amount, transaction.type)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No transactions yet</p>
                  <Link
                    href="/user/wallet/deposit"
                    className="text-blue-500 hover:text-blue-600 mt-2 inline-block"
                  >
                    Make your first deposit
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletDashboard;

