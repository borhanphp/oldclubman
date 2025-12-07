"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaIdCard, FaCreditCard, FaChartLine } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getMyNfc } from './store';
import NFCCardGrid from '@/components/nfc/NFCCardGrid';
import NFCSidebar from '@/components/nfc/NFCSidebar';
import Intro from '@/components/common/Intro';

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
      <div className="mx-auto md:p-2 md:px-5">
        <div className="flex flex-wrap">
          {/* Left Sidebar - Profile */}
          <div className="w-full lg:w-1/4 mb-1 lg:mb-0 lg:pr-2"> <Intro /></div>
         
          
          {/* Right Content - Existing NFC Design */}
          <div className="w-full lg:w-3/4">
            {/* Hero Section */}
            <div className="bg-gradient-to-r rounded-lg from-blue-600 to-purple-600 text-white">
              <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-2 py-8">
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

               
              </div>
              
            </div>
            {/* Stats Cards */}
            <div className="mt-4">
              <div className="">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm p-6 border border-blue-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium mb-2">Total Cards</p>
                        <p className="text-3xl font-bold text-gray-800">{totalCards}</p>
                      </div>
                      <div className="bg-blue-500 rounded-full p-4">
                        <FaIdCard className="text-2xl text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm p-6 border border-green-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium mb-2">Active Cards</p>
                        <p className="text-3xl font-bold text-gray-800">{totalCards}</p>
                      </div>
                      <div className="bg-green-500 rounded-full p-4">
                        <FaCreditCard className="text-2xl text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-sm p-6 border border-purple-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 text-sm font-medium mb-2">Total Shares</p>
                        <p className="text-3xl font-bold text-gray-800">0</p>
                      </div>
                      <div className="bg-purple-500 rounded-full p-4">
                        <FaChartLine className="text-2xl text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards Section */}
            <div className="mt-4">
              <div className="bg-white rounded-lg shadow-sm p-2">
                <div className="px-2 py-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Digital Cards</h2>
                    <p className="text-gray-600">
                      Click on any card to view details, edit, or share with others
                    </p>
                  </div>

                  <NFCCardGrid nfcCards={nfcCards} loading={loading} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NfcContent;
