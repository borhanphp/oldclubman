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

const MyProfile = () => {
  const {profile} = useSelector(({settings}) => settings)
  const {isPostModalOpen} = useSelector(({gathering}) => gathering)
const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getMyProfile());
  }, [])


  return (
    <div className="md:max-w-5xl mx-auto">
      <FeedHeader showEditBtn={true} friendsTab={true} showMsgBtn={true} showFriends={true}/>
      <div className="content-area py-3">
        <div className="mx-auto">
          <div className=" gap-4">
            <div className="md:col-span-6">
              {/* Create Post Section */}
              <CreatePostBox />
              
              {/* Post */}
              <PostList postsData={profile?.post}/>
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
      {isPostModalOpen && <PostModal />}
    </div>
  );
};

export default MyProfile;