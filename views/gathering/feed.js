"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { FaComment } from 'react-icons/fa';
import PostModal from '@/components/custom/PostModal';
import FeedHeader from '@/components/common/FeedHeader';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, getGathering, getPostById, getPosts, setPostModalOpen, storeComments, storePostReactions, storeReactions, updatePost, updatePostPrivacy } from './store';
import FollowSuggestion from '@/components/common/FollowSuggestion';
import CreatePostBox from "@/components/common/CreatePostBox";
import PostList from '@/components/common/PostList';



const GatheringContent = () => {
  const {gatheringData, postsData, loading, basicPostData, isPostModalOpen} = useSelector(({gathering}) => gathering);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(getGathering());
    dispatch(getPosts());
  }, [])
  
  const [showReactionsFor, setShowReactionsFor] = useState(null);
  const [openDropdownFor, setOpenDropdownFor] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editPostContent, setEditPostContent] = useState("");
  const [editPostId, setEditPostId] = useState(null);
  

  const openPostModal = () => {
    dispatch(setPostModalOpen(true));
  };

  const closePostModal = () => {
    dispatch(setPostModalOpen(false));
  };
  


  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditPostContent("");
    setEditPostId(null);
  };


  const reactionRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!showReactionsFor) return;
    function handleClickOutside(event) {
      if (reactionRef.current && !reactionRef.current.contains(event.target)) {
        setShowReactionsFor(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showReactionsFor]);

  useEffect(() => {
    if (openDropdownFor === null) return;
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownFor(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownFor]);


  const handleUpdatePost = () => {
    if (editPostId && editPostContent) {
      dispatch(updatePost({ post_id: editPostId, content: editPostContent }))
        .then(() => {
          dispatch(getGathering());
          closeEditModal();
        });
    }
  };



  return (
    <div className="">
      <FeedHeader/>
      
      {/* Content Area - 3 Column Layout */}
      <div className="content-area py-3">
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left Sidebar */}
            <div className="md:col-span-3">
              {/* Who to Follow Widget */}
              <FollowSuggestion/>
              
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
              <CreatePostBox />
              
              {/* Post */}
              <PostList postsData={postsData}/>
             
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
      {isPostModalOpen && <PostModal />}
      
      {/* Edit Post Modal */}
    
    </div>
  );
};

export default GatheringContent; 