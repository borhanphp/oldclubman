"use client";

import React from 'react';
import { FaDollarSign, FaSyncAlt } from 'react-icons/fa';

const BalanceDisplay = ({ balance, onRefresh, loading = false }) => {
  const formattedBalance = typeof balance === 'number' ? balance.toFixed(2) : '0.00';

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-100 text-sm font-medium mb-1">Available Balance</p>
          <div className="flex items-baseline">
            <FaDollarSign className="text-2xl mr-1" />
            <span className="text-4xl font-bold">{formattedBalance}</span>
            <span className="text-xl ml-1 text-blue-100">USD</span>
          </div>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-colors disabled:opacity-50"
          title="Refresh Balance"
        >
          <FaSyncAlt className={`text-xl ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default BalanceDisplay;

