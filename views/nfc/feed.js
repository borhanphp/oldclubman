"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaIdCard, FaCreditCard, FaChartLine } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getMyNfc } from './store';
import NFCCardGrid from '@/components/nfc/NFCCardGrid';

const NfcContent = () => {
  const { nfcData, loading } = useSelector(({ nfc }) => nfc);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMyNfc());
  }, [dispatch]);

  const nfcCards = nfcData?.nfc_cards?.data || [];
  const totalCards = nfcCards.length;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h1 className="text-4xl font-bold mb-2">My NFC Cards</h1>
              <p className="text-blue-100 text-lg">
                Manage and share your digital business cards
              </p>
            </div>
            <Link
              href="/user/nfc/create"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:shadow-xl transition-all"
            >
              <FaPlus />
              <span>Create New Card</span>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Total Cards</p>
                  <p className="text-3xl font-bold">{totalCards}</p>
                </div>
                <div className="bg-white/20 p-4 rounded-lg">
                  <FaIdCard className="text-3xl" />
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Active Cards</p>
                  <p className="text-3xl font-bold">{totalCards}</p>
                </div>
                <div className="bg-white/20 p-4 rounded-lg">
                  <FaCreditCard className="text-3xl" />
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Total Shares</p>
                  <p className="text-3xl font-bold">0</p>
                </div>
                <div className="bg-white/20 p-4 rounded-lg">
                  <FaChartLine className="text-3xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Digital Cards</h2>
          <p className="text-gray-600">
            Click on any card to view details, edit, or share with others
          </p>
        </div>

        <NFCCardGrid nfcCards={nfcCards} loading={loading} />
      </div>
    </div>
  );
};

export default NfcContent;
