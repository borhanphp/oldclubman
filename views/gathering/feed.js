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
import FeedLayout from '@/components/common/FeedLayout';



const GatheringContent = () => {
  const {gatheringData, postsData, loading, basicPostData, isPostModalOpen} = useSelector(({gathering}) => gathering);
  const dispatch = useDispatch();
  const [allPosts, setAllPosts] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef(null);

  useEffect(() => {
    dispatch(getGathering());
    dispatch(getPosts(1));
  }, [])
  
  useEffect(() => {
    if (postsData?.data) {
      // Sort posts by created_at descending (latest first)
      const sortedPosts = [...postsData.data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      console.log('sortedPosts length:', sortedPosts.length);
      setAllPosts(sortedPosts);
    }
  }, [postsData]);

  // Scroll event listener as fallback
  useEffect(() => {
    const handleScroll = () => {
      // Check if we're near the bottom of the page
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      const isNearBottom = scrollTop + windowHeight >= documentHeight - 200;
      
      if (isNearBottom) {
        console.log('📍 Near bottom detected:', {
          scrollTop,
          windowHeight,
          documentHeight,
          distanceFromBottom: documentHeight - (scrollTop + windowHeight)
        });
        
        const canLoadMore = !loadingMore && 
                           !loading && 
                           postsData?.current_page && 
                           postsData?.last_page && 
                           postsData.current_page < postsData.last_page;
        
        if (canLoadMore) {
          console.log('🚀 Triggering load more from scroll...');
          handleLoadMore();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingMore, loading, postsData?.current_page, postsData?.last_page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        console.log('🔍 Intersection observed:', {
          isIntersecting: entry.isIntersecting,
          loadingMore,
          loading,
          currentPage: postsData?.current_page,
          lastPage: postsData?.last_page,
          hasMorePages: postsData?.current_page < postsData?.last_page,
          elementExists: !!loadMoreRef.current,
          boundingRect: entry.boundingClientRect,
          intersectionRatio: entry.intersectionRatio
        });
        
        // Check if we can load more
        const canLoadMore = !loadingMore && 
                           !loading && 
                           postsData?.current_page && 
                           postsData?.last_page && 
                           postsData.current_page < postsData.last_page;
        
        console.log('🎯 Can load more?', canLoadMore, {
          notLoadingMore: !loadingMore,
          notLoading: !loading,
          hasCurrentPage: !!postsData?.current_page,
          hasLastPage: !!postsData?.last_page,
          hasMorePages: postsData?.current_page < postsData?.last_page
        });
        
        if (entry.isIntersecting && canLoadMore) {
          console.log('🚀 Triggering load more from intersection...');
          handleLoadMore();
        } else if (entry.isIntersecting) {
          console.log('❌ Intersection triggered but cannot load more:', {
            loadingMore,
            loading,
            currentPage: postsData?.current_page,
            lastPage: postsData?.last_page
          });
        }
      },
      { 
        threshold: 0,
        rootMargin: '100px'
      }
    );
    
    if (loadMoreRef.current) {
      console.log('👀 Observing loadMoreRef element');
      observer.observe(loadMoreRef.current);
    } else {
      console.log('⚠️ loadMoreRef.current is null');
    }
    
    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef, loadingMore, loading, postsData?.current_page, postsData?.last_page]);

  const handleLoadMore = () => {
    console.log('handleLoadMore called:', {
      loadingMore,
      loading,
      currentPage: postsData?.current_page,
      lastPage: postsData?.last_page
    });
    
    if (loadingMore || loading) {
      console.log('Returning early due to loading states');
      return;
    }
    
    const nextPage = (postsData?.current_page || 0) + 1;
    console.log('Next page to load:', nextPage);
    
    if (nextPage > (postsData?.last_page || 1)) {
      console.log('No more pages to load');
      return;
    }
    
    console.log('Setting loadingMore to true and dispatching getPosts');
    setLoadingMore(true);
    
    dispatch(getPosts(nextPage))
      .finally(() => {
        console.log('getPosts completed, setting loadingMore to false');
        setLoadingMore(false);
      });
  };
  
  const [showReactionsFor, setShowReactionsFor] = useState(null);
  const [openDropdownFor, setOpenDropdownFor] = useState(null);
  const [editPostContent, setEditPostContent] = useState("");
  const [editPostId, setEditPostId] = useState(null);
  


  const closeEditModal = () => {
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
    <FeedLayout>
      {/* Content Area - Responsive 3 Column Layout */}
      <div className="about-content md:max-w-5xl mx-auto">
        <div className="mx-auto py-3 px-2 sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Sidebar - Hidden on mobile, visible on large screens */}
            <div className="hidden lg:block lg:col-span-3">
              {/* Who to Follow Widget */}
              <FollowSuggestion/>
              
              {/* Upcoming Birthday Widget */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-3">Upcoming Birthday</h3>
                <p className="text-gray-500 text-sm">
                  No online followers have a birthday today.
                </p>
              </div>
            </div>
            
            {/* Center Content / Feed - Full width on mobile, 6 cols on large screens */}
            <div className="col-span-1 lg:col-span-6">
              {/* Mobile-only Who to Follow Widget */}
              <div className="lg:hidden mb-4">
                <FollowSuggestion/>
              </div>
              
              {/* Create Post */}
              <CreatePostBox />
              
              {/* Post */}
              <PostList postsData={{...postsData, data: allPosts}}/>
              

              {allPosts?.length ? (
                <div 
                ref={loadMoreRef}
                className="flex flex-col items-center mt-4 mb-8 py-8 min-h-[100px] border-2 border-dashed border-gray-300"
                >
                                  {loadingMore ? (
                    <div className="text-blue-700 font-medium">Loading more posts...</div>
                  ) : postsData?.current_page < postsData?.last_page ? (
                    <div className="text-gray-400">Scroll for more posts</div>
                  ) : (
                    <div className="text-gray-400">No more posts to load</div>
                  )}
                </div> 
              ): 
              <div className='text-center'>There are no posts to show</div>}
             
             
            </div>
            
            {/* Right Sidebar - Hidden on mobile, visible on large screens */}
            <div className="hidden lg:block lg:col-span-3">
              {/* Online Active Now Widget */}
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h3 className="text-lg font-semibold mb-3">Online Active Now</h3>
                <div className="empty-state text-gray-400 text-sm py-4 text-center">
                  <div className="mb-2">
                    <svg className="w-8 h-8 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  No active followers online
                </div>
              </div>
              
              {/* Trending Posts Widget */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-lg font-semibold mb-3">Today's Trending posts</h3>
                <div className="empty-state text-gray-400 text-sm py-4 text-center">
                  <div className="mb-2">
                    <svg className="w-8 h-8 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  No trending posts today
                </div>
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

export default GatheringContent; 