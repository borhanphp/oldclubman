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
  const [currentPage, setCurrentPage] = useState(1);
  const [allPosts, setAllPosts] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    dispatch(getGathering());
    dispatch(getPosts(1));
  }, [])
  
  useEffect(() => {
    if (postsData?.data) {
      if (currentPage === 1) {
        setAllPosts(postsData.data);
      } else {
        // Filter out any duplicate posts by id before adding new ones
        const existingPostIds = new Set(allPosts.map(post => post.id));
        const newPosts = postsData.data.filter(post => !existingPostIds.has(post.id));
        setAllPosts(prev => [...prev, ...newPosts]);
      }
    }
  }, [postsData, currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loadingMore) {
          handleLoadMore();
        }
      },
      { threshold: 0.1 }
    );
    
    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }
    
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef, loadingMore]);

  const handleLoadMore = () => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    
    dispatch(getPosts(nextPage))
      .finally(() => {
        setLoadingMore(false);
      });
  };
  
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
              <PostList postsData={{...postsData, data: allPosts}}/>
              <div 
                ref={loadMoreRef}
                className="flex justify-center mt-4 mb-8 py-4"
              >
                {loadingMore ? (
                  <div className="text-blue-700 font-medium">Loading more posts...</div>
                ) : (
                  <div className="text-gray-400">Scroll for more posts</div>
                )}
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
      {isPostModalOpen && <PostModal />}
      
    
    </div>
  );
};

export default GatheringContent; 