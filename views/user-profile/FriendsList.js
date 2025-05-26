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
    <div className="about-content md:max-w-4xl mx-auto">
      <FeedHeader showMsgBtn={true} showFriends={true} userProfile={true} />

      <div className="bg-white rounded-lg shadow-sm mt-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Friends</h1>
          {/* <div className="relative">
            <input
              type="text"
              placeholder="Search friends..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div> */}
        </div>

        <div className="mb-6">
          <nav className="flex space-x-8">
            {tabs?.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`py-4 px-1 cursor-pointer border-b-2 font-medium text-sm ${
                  activeTab === tab?.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab?.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {friendsToDisplay?.map((friend, index) => {
            return (
              <FriendCard 
                key={index} 
                friend={friend}
              />
            );
          })}
          
          {/* Show empty state if no friends */}
          {(!friendsToDisplay || friendsToDisplay?.length === 0) && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No {activeTab} to display</p>
              <p className="text-gray-400 text-sm mt-2">Start connecting with people to build your network</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsList;
