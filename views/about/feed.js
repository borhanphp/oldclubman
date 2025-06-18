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
import CreatePostBox from '@/components/common/CreatePostBox';
import PostList from '@/components/common/PostList';
import FeedLayout from '@/components/common/FeedLayout';

const AboutContent = () => {
  const {profile} = useSelector(({settings}) => settings)
  const {isPostModalOpen} = useSelector(({gathering}) => gathering)
const dispatch = useDispatch()

  console.log('profile',profile)
  useEffect(() => {
    dispatch(getMyProfile());
  }, [])


  return (
   <FeedLayout>
     {/* Content Area - 3 Column Layout */}
     <div className="content-area py-3">
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Sidebar - INTRO */}
            <div className="md:col-span-3">
             <Intro/>
              
              {/* Photos Section */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h3 className="text-lg font-semibold mb-3">Photos</h3>
                {profile?.photos && profile.photos.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {profile.photos.map((photo, index) => (
                      <div 
                        key={index} 
                        className="aspect-square overflow-hidden rounded-md cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        <img 
                          src={process.env.NEXT_PUBLIC_FILE_PATH + "/"  + photo} 
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                          // onError={(e) => {
                          //   e.target.onerror = null;
                          //   e.target.src = "/placeholder-image.jpg";
                          // }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state text-gray-400 text-sm py-4 text-center">
                    <p>No photos to display</p>
                    <button className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors">
                      Add Photos
                    </button>
                  </div>
                )}
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
                          <div className="text-gray-700 font-medium">{moment(profile?.client?.dob).format("MMM-DD-YYYY")}</div>
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
                          <div className="text-gray-700 font-medium"> {profile?.client?.contact_no}</div>
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
                          <div className="text-gray-700 font-medium">{moment(profile?.client?.created_at).format("DD, MMM YYYY")}</div>
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
                          <div className="text-gray-700 font-medium">{profile?.client?.email}</div>
                        </div>
                      </div>
                      <button className="text-gray-400">
                        <FaEllipsisH />
                      </button>
                    </div>
                  </div>
                </div>
                
                
              </div>

              {/* Create Post Section */}
              <CreatePostBox />
              
              {/* Post */}
              <PostList postsData={profile?.post}/>
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

      {/* Post Modal */}
      {isPostModalOpen && <PostModal />}
   </FeedLayout>
  );
};

export default AboutContent;