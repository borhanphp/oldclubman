"use client";

import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { FaGift, FaHistory, FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import { getMyGiftCards, getTransactions, getWalletBalance } from './store';
import WalletSidebar from './WalletSidebar';
import StatusBadge from '@/components/wallet/StatusBadge';
import GiftCardSummary from '@/components/wallet/GiftCardSummary';
import BodyLayout from '@/components/common/BodyLayout';

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
    <BodyLayout>
        <div className="flex flex-wrap">
          <WalletSidebar />
          
          <div className="w-full lg:w-3/4">
            {/* Gift Card Summary Component */}
            <GiftCardSummary />

            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-sm p-2">
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
                    href="/user/wallet/gift-cards"
                    className="text-blue-500 hover:text-blue-600 mt-2 inline-block"
                  >
                    Purchase your first gift card
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </BodyLayout>
  );
};

export default WalletDashboard;

