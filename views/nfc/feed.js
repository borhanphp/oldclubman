"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FaEllipsisH, FaVideo, FaGlobe, FaComment, FaPlus, FaUserFriends } from 'react-icons/fa';
import FeedHeader from '@/components/common/FeedHeader';
import PostModal from '@/components/custom/PostModal';

const NfcContent = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  const openPostModal = () => {
    setIsPostModalOpen(true);
  };

  const closePostModal = () => {
    setIsPostModalOpen(false);
  };

  return (
    <div className="gathering-content">
     <FeedHeader/>
      
      {/* Content Area - 3 Column Layout */}
      <div className="content-area  py-3">
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Sidebar - INTRO */}
            <div className="md:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">INTRO</h3>
                  <button className="text-blue-500 p-1 rounded">
                    <FaEllipsisH />
                  </button>
                </div>
                
                <div className="text-center py-4">
                  <div className="stats flex justify-between px-8 mb-4">
                    <div className="text-center">
                      <div className="font-semibold">4</div>
                      <div className="text-sm text-gray-500">Post</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">0</div>
                      <div className="text-sm text-gray-500">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">0</div>
                      <div className="text-sm text-gray-500">Following</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Who to follow Widget */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-3">Who to follow</h3>
                <div className="empty-state text-gray-400 text-sm py-4">
                  {/* Empty state */}
                </div>
              </div>
            </div>
            
            {/* Center Content - LIST OF GATHERINGS */}
            <div className="md:col-span-6">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold">LIST OF NFC CARD</h3>
                  <Link href="/nfc/create" className="text-blue-500 cursor-pointer bg-gray-100 p-2 rounded-full">
                    <FaPlus />
                  </Link>
                </div>
                
                {/* NFC Card */}
                <div className="nfc-card border rounded-lg overflow-hidden mb-4 bg-white shadow-sm max-w-[320px]">
                  <div className="p-4">
                    <div className="relative w-full mb-3">
                      <div className="aspect-square rounded-lg overflow-hidden relative">
                        {/* Checkered transparent background */}
                        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyIDIiPjxwYXRoIGZpbGw9IiNmMGYwZjAiIGQ9Ik0wIDBoMXYxSDB6TTEgMWgxdjFIMXoiLz48cGF0aCBmaWxsPSIjZjhmOGY4IiBkPSJNMSAwaDF2MUgxek0wIDFoMXYxSDB6Ii8+PC9zdmc+')]">
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-3/5 h-3/5 rounded-full bg-gray-500"></div>
                          </div>
                        </div>
                        {/* Wavy blue line at the bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-[22%] overflow-hidden">
                          <svg viewBox="0 0 500 150" preserveAspectRatio="none" className="w-full h-full">
                            <path d="M0,50 C150,150 350,0 500,50 L500,150 L0,150 Z" className="fill-blue-500 opacity-90"></path>
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="border-l-2 border-gray-300 pl-3 py-1">
                      <h4 className="font-semibold">Borhan Uddin</h4>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-sm text-gray-600">Personal Card</p>
                      <p className="text-sm text-gray-600">Apr 27, 2025</p>
                    </div>
                  </div>
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
        <Link href="/messages">
          <button className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
            <FaComment size={20} />
          </button>
        </Link>
      </div>

      {/* Post Modal */}
      <PostModal isOpen={isPostModalOpen} onClose={closePostModal} />
    </div>
  );
};

export default NfcContent; 