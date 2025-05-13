"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaEllipsisH, FaVideo, FaGlobe, FaComment, FaMapMarkerAlt, FaEnvelope, FaBirthdayCake, FaCalendarAlt } from 'react-icons/fa';
import PostModal from '@/components/custom/PostModal';
import FeedHeader from '@/components/common/FeedHeader';
import Intro from '@/components/common/Intro';
import { useDispatch, useSelector } from 'react-redux';
import { getMyProfile } from '../settings/store';
import moment from 'moment';

const AboutContent = () => {
  const {profileData, myFollowers, personalPosts, totalFollowers} = useSelector(({settings}) => settings)
const dispatch = useDispatch()
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  console.log('profileData',profileData)
  useEffect(() => {
    dispatch(getMyProfile());
  }, [])
  const openPostModal = () => {
    setIsPostModalOpen(true);
  };

  const closePostModal = () => {
    setIsPostModalOpen(false);
  };

  return (
    <div className="about-content">
      <FeedHeader/>
      
      
      {/* Content Area - 3 Column Layout */}
      <div className="content-area bg-gray-50 py-4">
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Sidebar - INTRO */}
            <div className="md:col-span-3">
             <Intro/>
              
              {/* Photos Section */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h3 className="text-lg font-semibold mb-3">Photos</h3>
                <div className="empty-state text-gray-400 text-sm py-4">
                  {/* Empty photos section */}
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
            
            {/* Center Content - PROFILE INFO */}
            <div className="md:col-span-6">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h3 className="text-xl font-bold mb-6">PROFILE INFO</h3>
                
                <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-base font-bold text-gray-800">OVERVIEW</h4>
                    <button className="text-gray-400">
                      <FaEllipsisH />
                    </button>
                  </div>
                </div>
                
                {/* Profile Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white rounded-lg border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-gray-500 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                          </svg>
                        </div>
                        <div className='flex items-center gap-2'>
                          <div className="text-sm text-gray-500">Born:</div>
                          <div className="text-gray-700 font-medium">{moment(profileData?.dob).format("MMM-DD-YYYY")}</div>
                        </div>
                      </div>
                      <button className="text-gray-400">
                        <FaEllipsisH />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-gray-500 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                        </div>
                        <div className='flex items-center gap-2'>
                          <div className="text-sm text-gray-500">Status:</div>
                          <div className="text-gray-700 font-medium">Single</div>
                        </div>
                      </div>
                      <button className="text-gray-400">
                        <FaEllipsisH />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-gray-500 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                        </div>
                        <div className='flex items-center gap-2'>
                          <div className="text-sm text-gray-500">Contact:</div>
                          <div className="text-gray-700 font-medium"> 01829521200</div>
                        </div>
                      </div>
                      <button className="text-gray-400">
                        <FaEllipsisH />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-gray-500 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                        </div>
                        <div className='flex items-center gap-2'>
                          <div className="text-sm text-gray-500">Lives in:</div>
                          <div className="text-gray-700 font-medium">Chittagong</div>
                        </div>
                      </div>
                      <button className="text-gray-400">
                        <FaEllipsisH />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-gray-500 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
                            <path d="M12 6v6l4 2"></path>
                          </svg>
                        </div>
                        <div className='flex items-center gap-2'>
                          <div className="text-sm text-gray-500">Joined on:</div>
                          <div className="text-gray-700 font-medium">27 Apr,2025</div>
                        </div>
                      </div>
                      <button className="text-gray-400">
                        <FaEllipsisH />
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg border border-gray-100 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-gray-500 mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                          </svg>
                        </div>
                        <div className='flex items-center gap-2'>
                          <div className="text-sm text-gray-500">Email:</div>
                          <div className="text-gray-700 font-medium">borhanidb@gmail.com</div>
                        </div>
                      </div>
                      <button className="text-gray-400">
                        <FaEllipsisH />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Create Post Section */}
                <div className="bg-white p-4 rounded-lg mt-4 border border-gray-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img src="/common-avator.jpg" className="w-full h-full object-cover" alt="User" />
                    </div>
                    <div className="flex-grow">
                      <input 
                        type="text" 
                        placeholder="Share your thoughts..." 
                        className="w-full focus:ring-1 focus:ring-blue-500  bg-white cursor-text rounded-full px-4 py-2 text-sm"
                        onClick={openPostModal}
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div className="flex mt-3">
                    <button 
                      className="flex items-center text-gray-600 bg-gray-100 rounded-md px-3 py-1 text-sm hover:bg-gray-200"
                      onClick={openPostModal}
                    >
                      <svg className="mr-2 text-blue-500" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M23 7L16 12L23 17V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 5H3C1.89543 5 1 5.89543 1 7V17C1 18.1046 1.89543 19 3 19H14C15.1046 19 16 18.1046 16 17V7C16 5.89543 15.1046 5 14 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Video</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Post */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex">
                    <div className="w-10 h-10 rounded-full bg-red-400 flex items-center justify-center text-white mr-3">
                      BU
                    </div>
                    <div>
                      <h4 className="font-medium">Borhan Uddin</h4>
                      <p className="text-sm text-gray-500">6 days ago</p>
                    </div>
                  </div>
                  <button className="text-gray-500">
                    <FaEllipsisH />
                  </button>
                </div>
                
                <div className="post-content">
                  <p className="text-gray-700">
                    This Account Location Not Set Yet. <FaGlobe className="inline ml-1" />
                  </p>
                  <p className="mt-2 text-gray-700">
                    hi this is my first post
                  </p>
                </div>
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
              
              {/* Upcoming Birthday Widget */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-3">Upcoming Birthday</h3>
                <p className="text-gray-500 text-sm">
                  No online friends have a birthday today.
                </p>
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

export default AboutContent;