"use client";

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaPlus, FaArrowDown, FaArrowRight, FaGift, FaHistory, FaSearch, FaDownload, FaTimes } from 'react-icons/fa';
import { getDepositHistory } from './store';
import StatusBadge from '@/components/wallet/StatusBadge';

const TransactionList = () => {
  const dispatch = useDispatch();
  const { depositHistory, loading, historyPagination } = useSelector(({ wallet }) => wallet);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Fetch deposit history from the API
  useEffect(() => {
    const params = {
      page: 1,
      limit: 20,
    };
    
    if (activeFilter !== 'all') {
      params.type = activeFilter;
    }

    dispatch(getDepositHistory(params));
  }, [dispatch, activeFilter]);

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'withdrawal', label: 'Transfer Requests' },
    { id: 'transfer', label: 'Gift Card Sends' },
    { id: 'gift_card_purchase', label: 'Gift Card Purchases' },
    { id: 'gift_card_received', label: 'Gift Cards Received' }
  ];

  const getTransactionIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'deposit':
        return <FaPlus className="text-green-500" />;
      case 'withdrawal':
        return <FaArrowDown className="text-red-500" />;
      case 'transfer':
        return <FaArrowRight className="text-blue-500" />;
      case 'gift_card_purchase':
      case 'gift_card_received':
        return <FaGift className="text-purple-500" />;
      default:
        return <FaHistory className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount, type) => {
    const numAmount = typeof amount === 'number' ? amount : parseFloat(amount || 0);
    const sign = ['deposit', 'gift_card_received'].includes(type?.toLowerCase()) ? '+' : '-';
    return `${sign}$${Math.abs(numAmount).toFixed(2)}`;
  };

  // Use deposit history from API (primary source)
  const allTransactions = depositHistory || [];

  const filteredTransactions = allTransactions.filter(t => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        t.id?.toString().includes(query) ||
        t.reference_id?.toLowerCase().includes(query) ||
        t.type?.toLowerCase().includes(query)
      );
    }
    return true;
  }) || [];

  const handleExportCSV = () => {
    const csvContent = [
      ['Date', 'Type', 'Amount', 'Status', 'Payment Method', 'Reference ID'].join(','),
      ...filteredTransactions.map(t => [
        formatDate(t.created_at),
        t.type || '',
        formatAmount(t.amount, t.type),
        t.status || '',
        t.payment_method || '',
        t.reference_id || t.id || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by ID or reference..."
              />
            </div>
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="From"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="To"
            />
          </div>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center space-x-2"
          >
            <FaDownload />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                onClick={() => setSelectedTransaction(transaction)}
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 capitalize">
                        {transaction.type?.replace(/_/g, ' ') || 'Transaction'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(transaction.created_at)}
                      </p>
                      {transaction.payment_method && (
                        <p className="text-xs text-gray-400 mt-1">
                          {transaction.payment_method}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <StatusBadge status={transaction.status} />
                    <div className="text-right">
                      <p
                        className={`font-bold text-lg ${
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
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <FaHistory className="text-5xl mx-auto mb-4 text-gray-400" />
            <p>No transactions found</p>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {historyPagination.hasMore && !loading && (
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              dispatch(getDepositHistory({
                page: historyPagination.currentPage + 1,
                limit: 20,
                type: activeFilter !== 'all' ? activeFilter : null
              }));
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Load More Transactions
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Showing {depositHistory.length} of {historyPagination.total} transactions
          </p>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Transaction Details</h3>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium capitalize">
                  {selectedTransaction.type?.replace(/_/g, ' ') || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className={`font-bold ${
                  ['deposit', 'gift_card_received'].includes(selectedTransaction.type?.toLowerCase())
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {formatAmount(selectedTransaction.amount, selectedTransaction.type)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <StatusBadge status={selectedTransaction.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{formatDate(selectedTransaction.created_at)}</span>
              </div>
              {selectedTransaction.payment_method && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium capitalize">
                    {selectedTransaction.payment_method}
                  </span>
                </div>
              )}
              {selectedTransaction.reference_id && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference ID:</span>
                  <span className="font-mono text-sm">{selectedTransaction.reference_id}</span>
                </div>
              )}
              {selectedTransaction.transaction_id && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-sm">{selectedTransaction.transaction_id}</span>
                </div>
              )}
              {selectedTransaction.admin_notes && (
                <div>
                  <span className="text-gray-600">Admin Notes:</span>
                  <p className="text-sm text-gray-700 mt-1 bg-yellow-50 p-2 rounded">
                    {selectedTransaction.admin_notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionList;

