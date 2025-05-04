"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaEllipsisH, FaVideo, FaGlobe, FaComment } from 'react-icons/fa';
import PostModal from '@/components/custom/PostModal';
import FeedHeader from '@/components/common/FeedHeader';
import { SlLike } from "react-icons/sl";
import { IoMdShareAlt } from "react-icons/io";
import { FaRegComment } from "react-icons/fa6";
const GatheringContent = () => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const openPostModal = () => {
    setIsPostModalOpen(true);
  };

  const closePostModal = () => {
    setIsPostModalOpen(false);
  };
  
  return (
    <div className="">
      <FeedHeader/>
      
      {/* Content Area - 3 Column Layout */}
      <div className="content-area py-4">
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Sidebar */}
            <div className="md:col-span-3">
              {/* Who to Follow Widget */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h3 className="text-lg font-semibold mb-3">Who to follow</h3>
                <div className="empty-state text-gray-400 text-sm">
                  {/* Empty state as shown in the image */}
                </div>
              </div>
              
              {/* Upcoming Birthday Widget */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-3">Upcoming Birthday</h3>
                <p className="text-gray-500 text-sm">
                  No online friends have a birthday today.
                </p>
              </div>
            </div>
            
            {/* Center Content / Feed */}
            <div className="md:col-span-6">
              {/* Create Post */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center text-white mr-3 overflow-hidden">
                    <img src='/common-avator.jpg' className="w-full h-full object-cover"/>
                  </div>
                  <div className="flex-grow">
                    <input 
                      type="text" 
                      placeholder="Share your thoughts..." 
                      className="focus:outline-none w-full bg-white px-4 py-2 text-sm cursor-text"
                      onClick={openPostModal}
                      readOnly
                    />
                  </div>
                </div>
                
                <div className="flex border-gray-100 pt-3">
                  <button 
                    className="flex items-center text-gray-500 bg-gray-100 rounded-md px-3 py-1 text-sm"
                    onClick={openPostModal}
                  >
                    <FaVideo className="mr-2 text-blue-500" />
                    <span>Video</span>
                  </button>
                </div>
              </div>
              
              {/* Post */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex">
                    <div className="w-10 h-10 border border-blue-600 rounded-full overflow-hidden mr-3">
                      <img src='/common-avator.jpg' className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">Borhan Uddin</h4>
                        <span className="text-gray-500">•</span>
                        <p className="text-sm text-gray-500">6 days ago</p>
                      </div>
                      <p className="text-gray-500 text-sm">
                        This Account Location Not Set Yet. <FaGlobe className="inline ml-1" />
                      </p>
                    </div>
                  </div>
                  <button className="text-gray-500">
                    <FaEllipsisH />
                  </button>
                </div>
                
                <div className="post-content">
                  <p className="text-gray-700 py-2">
                    hi this is my first post
                  </p>
                </div>

                <div className="border-gray-200 border-t border-b py-2 mt-2">
                  <div className="flex items-center">
                    <span className="mr-2">
                      <span role="img" aria-label="surprised" className="text-xl">😯</span>
                    </span>
                    <span className="text-sm">Borhan Uddin and 1 others</span>
                    <span className="flex items-center gap-2 ml-auto text-sm text-gray-500">2 <FaRegComment className='' /></span>
                  </div>
                </div>

                <div className="flex justify-between py-1 border-gray-200 border-b">
                  <div className="flex-1 relative">
                    <button 
                      className="w-full py-1 cursor-pointer text-center text-blue-500 bg-gray-100 rounded-md"
                      onMouseEnter={() => setShowReactions(true)}
                      onMouseLeave={() => setShowReactions(false)}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <SlLike /> <span>Like</span>
                      </div>
                    </button>
                    
                    {showReactions && (
                      <div 
                        className="absolute bottom-full left-0 mb-2 bg-white p-2 rounded-full shadow-lg flex space-x-2 z-10"
                        onMouseEnter={() => setShowReactions(true)}
                        onMouseLeave={() => setShowReactions(false)}
                      >
                        <button className="transform hover:scale-125 transition-transform">
                          <img src="/reactions/like.svg" alt="Like" className="w-8 h-8" />
                        </button>
                        <button className="transform hover:scale-125 transition-transform">
                          <img src="/reactions/love.svg" alt="Love" className="w-8 h-8" />
                        </button>
                        <button className="transform hover:scale-125 transition-transform">
                          <img src="/reactions/care.svg" alt="Care" className="w-8 h-8" />
                        </button>
                        <button className="transform hover:scale-125 transition-transform">
                          <img src="/reactions/haha.svg" alt="Haha" className="w-8 h-8" />
                        </button>
                        <button className="transform hover:scale-125 transition-transform">
                          <img src="/reactions/wow.svg" alt="Wow" className="w-8 h-8" />
                        </button>
                        <button className="transform hover:scale-125 transition-transform">
                          <img src="/reactions/sad.svg" alt="Sad" className="w-8 h-8" />
                        </button>
                      </div>
                    )}
                  </div>
                  <button className="flex-1 py-1 cursor-pointer text-center text-gray-500 hover:bg-gray-100 rounded-md">
                    <div className="flex items-center justify-center gap-2">
                      <IoMdShareAlt /> <span>Share (1)</span>
                    </div>
                  </button>
                </div>

                {/* Comments section */}
                <div className="mt-2 pl-2">
                  {/* Comment 1 */}
                  <div className="flex mb-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2 mt-2">
                      <img src='/common-avator.jpg' className="w-full h-full object-cover"/>
                    </div>
                    <div className=" p-2 rounded-lg flex-grow">
                      <div className="flex flex-col bg-gray-100 p-2 rounded-md">
                        <span className="font-medium">Borhan Uddin</span>
                        <span className="text-gray-700 text-sm">fghdfgh</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex gap-2">
                        <span>6 days ago</span>
                        <span>•</span>
                        <button className="text-gray-500">Like (0)</button>
                        <span>•</span>
                        <button className="text-gray-500">Reply</button>
                      </div>
                    </div>
                  </div>

                  {/* Comment 2 */}
                  <div className="flex mb-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2 mt-2">
                      <img src='/common-avator.jpg' className="w-full h-full object-cover"/>
                    </div>
                    <div className=" p-2 rounded-lg flex-grow">
                      <div className="flex flex-col bg-gray-100 p-2 rounded-md">
                        <span className="font-medium">Borhan Uddin</span>
                        <span className="text-gray-700 text-sm">fghdfgh</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex gap-2">
                        <span>14 hours ago</span>
                        <span>•</span>
                        <button className="text-gray-500">Like (0)</button>
                        <span>•</span>
                        <button className="text-gray-500">Reply</button>
                      </div>
                    </div>
                  </div>

                  {/* Add comment */}
                  <div className="flex mt-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                      <img src='/common-avator.jpg' className="w-full h-full object-cover"/>
                    </div>
                    <div className="flex-grow relative">
                      <input 
                        type="text" 
                        placeholder="Add a comment..." 
                        className="w-full focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-100 rounded-full px-4 py-2 text-sm pr-10"
                      />
                      <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Sidebar */}
            <div className="md:col-span-3">
              {/* Online Active Now Widget */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h3 className="text-lg font-semibold mb-3">Online Active Now</h3>
                <div className="empty-state text-gray-400 text-sm">
                  {/* Empty state as shown in the image */}
                </div>
              </div>
              
              {/* Trending Posts Widget */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-3">Today's Trending posts</h3>
                <div className="empty-state text-gray-400 text-sm">
                  {/* Empty state as shown in the image */}
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

export default GatheringContent; 