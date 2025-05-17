"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaEllipsisH, FaVideo, FaGlobe, FaComment, FaPlus, FaUserFriends } from 'react-icons/fa';
import FeedHeader from '@/components/common/FeedHeader';
import PostModal from '@/components/custom/PostModal';
import { useDispatch, useSelector } from 'react-redux';
import { getMyNfc, getNfcById } from './store';
import moment from 'moment';
import Intro from '@/components/common/Intro';
import FollowSuggestion from '@/components/common/FollowSuggestion';

const NfcContent = () => {
  const {nfcData, loading} = useSelector(({nfc}) => nfc);
  const {isPostModalOpen} = useSelector(({gathering}) => gathering);

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getMyNfc());
  }, [])
  



  return (
    <div className="gathering-content">
     <FeedHeader/>
      
      {/* Content Area - 3 Column Layout */}
      <div className="content-area  py-3">
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Sidebar - INTRO */}
            <div className="md:col-span-3">
             <Intro/>
             <FollowSuggestion/>
            </div>
            
            {/* Center Content - LIST OF GATHERINGS */}
            <div className="md:col-span-6">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">LIST OF NFC CARD</h3>
                  <Link href="/user/nfc/create" className="text-blue-500 cursor-pointer bg-gray-100 p-2 rounded-full">
                    <FaPlus />
                  </Link>
                </div>
                
                {/* NFC Card */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {nfcData.nfc_cards?.data?.map((card, index) => {
                    return(
                      <Link href={`/user/nfc/preview/${card.id}`} key={index}>
                        <div className="nfc-card border cursor-pointer rounded-lg overflow-hidden bg-white shadow-sm w-full">
                          <div className="p-4">
                            <div className="relative w-full mb-3">
                              <div className="aspect-square rounded-lg overflow-hidden relative">
                                {/* Checkered transparent background */}
                                <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyIDIiPjxwYXRoIGZpbGw9IiNmMGYwZjAiIGQ9Ik0wIDBoMXYxSDB6TTEgMWgxdjFIMXoiLz48cGF0aCBmaWxsPSIjZjhmOGY4IiBkPSJNMSAwaDF2MUgxek0wIDFoMXYxSDB6Ii8+PC9zdmc+')]"><div className="w-full h-full flex items-center justify-center"><div className="w-3/5 h-3/5 rounded-full bg-gray-500"></div></div></div>
                                {/* Wavy blue line at the bottom */}
                                <div className="absolute bottom-0 left-0 right-0 h-[22%] overflow-hidden">
                                  <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-full">
                                    <path d="M0,50 C150,150 350,0 500,50 L500,150 L0,150 Z" className="fill-blue-500 opacity-90"></path>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            <div className="border-l-2 border-gray-300 pl-3 py-1">
                              <h4 className="font-semibold">{card?.nfc_info?.prefix + " " + card?.nfc_info?.first_name + " " + card?.nfc_info?.last_name + " " + card?.nfc_info?.suffix + " (" + card?.nfc_info?.maiden_name + ")"}</h4>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <p className="text-sm text-gray-600">{card?.card_name}</p>
                              <p className="text-sm text-gray-600">{moment( card?.created_at).format("DD MMM, yyyy")}</p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
                
                {/* Add more cards here if needed */}
              </div>
              
             
            </div>
            
            {/* Right Sidebar */}
            <div className="md:col-span-3">
              {/* Online Active Now Widget */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h3 className="text-lg font-semibold mb-3">Online Active Now</h3>
                <div className="empty-state text-gray-400 text-sm py-4">
                  {/* Empty state */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-5 right-5">
        <Link href="/user/messages">
          <button className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
            <FaComment size={20} />
          </button>
        </Link>
      </div>

      {/* Post Modal */}
      {isPostModalOpen && <PostModal/>}
    </div>
  );
};

export default NfcContent; 