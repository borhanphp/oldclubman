"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FaEllipsisH,
  FaUserPlus,
  FaUserMinus,
  FaSearch,
} from "react-icons/fa";
import FeedHeader from "@/components/common/FeedHeader";
import { useDispatch, useSelector } from "react-redux";
import { followTo, getMyProfile, getUserFollowers, getUserFollowing, getUserProfile, unFollowTo } from "../settings/store";
import { useParams } from "next/navigation";

const FriendsList = () => {
  const { userProfileData, userFollowers, userFollowing, followLoading } = useSelector(({ settings }) => settings);
  const dispatch = useDispatch();
  const params = useParams();
  const [activeTab, setActiveTab] = useState('followers');
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    // Initial profile load
    dispatch(getMyProfile());
    dispatch(getUserProfile(params?.id));
  }, [dispatch, params?.id]);

  useEffect(() => {
    // Handle tab changes
    if (activeTab === 'followers') {
      dispatch(getUserFollowers(params?.id));
    } else if (activeTab === 'following') {
      dispatch(getUserFollowing(params?.id));
    }
  }, [activeTab, params?.id, dispatch]);

  const tabs = [
    { id: 'followers', label: 'Followers' },
    { id: 'following', label: 'Following' }
  ];

  const handleFollow = (id) => {
    dispatch(followTo({following_id: id}))
  }

  const handleUnFollow = (id) => {
    dispatch(unFollowTo({following_id: id}))
  }

  const FriendCard = ({ friend }) => (
    
        <div className="col-span-1">
        <div className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
          <img
            src={friend?.image ? process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + friend?.image : "/common-avator.jpg"}
            alt={friend?.fname}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/common-avator.jpg";
            }}
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{friend?.follower_client?.fname} {friend?.follower_client?.last_name}</h3>
          <p className="text-sm text-gray-500">{friend?.tagline || 'No tagline'}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
     

        <button onClick={() => {handleFollow(friend?.id)}} className="px-3 py-1 cursor-pointer bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-2">
          <FaUserPlus className="text-sm" />
          <span>{followLoading ? "Following..." :"Follow"}</span>
        </button> 
   
      </div>
    </div>
        </div>
 
  );


  const friendsToDisplay = activeTab === 'followers' ? (userFollowers || []) : (userFollowing || []);

  return (
    <div className="about-content md:max-w-5xl mx-auto">
      <FeedHeader showMsgBtn={true} showFriends={true} userProfile={true} />

    
    </div>
  );
};

export default FriendsList;
