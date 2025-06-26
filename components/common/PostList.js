"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  FaEllipsisH,
  FaVideo,
  FaGlobe,
  FaComment,
  FaLock,
  FaGlobeAmericas,
} from "react-icons/fa";
import { SlLike } from "react-icons/sl";
import { IoIosShareAlt, IoMdShareAlt } from "react-icons/io";
import { FaRegComment } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  bindPostData,
  deletePost,
  getGathering,
  getPostById,
  getPosts,
  initialPostData,
  setPostModalOpen,
  storeComments,
  storePostReactions,
  storeReactions,
  updatePost,
  updatePostPrivacy,
  likeComment,
  replyToComment,
  getCommentReplies,
  likeReply,
  sharePost,
} from "../../views/gathering/store";
import moment from "moment";
import Link from "next/link";
import { CiEdit, CiUnlock } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { TbMessageReport } from "react-icons/tb";
import { useParams } from "next/navigation";
import { getMyProfile, getUserProfile } from "@/views/settings/store";
import toast from "react-hot-toast";

const PostList = ({ postsData }) => {
  const { basicPostData } = useSelector(({ gathering }) => gathering);
  const { profile } = useSelector(({ settings }) => settings);
  const dispatch = useDispatch();
  const params = useParams();
  useEffect(() => {
    dispatch(getGathering());
    dispatch(getPosts(1));
  }, [dispatch]);

  const [showReactionsFor, setShowReactionsFor] = useState(null);
  const [showCommentReactionsFor, setShowCommentReactionsFor] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [commentLikes, setCommentLikes] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [commentReplies, setCommentReplies] = useState({});
  const [openDropdownFor, setOpenDropdownFor] = useState(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [modalCommentLikes, setModalCommentLikes] = useState({});
  const [modalReplyInputs, setModalReplyInputs] = useState({});
  const [modalReplies, setModalReplies] = useState({});
  const [loadingReplies, setLoadingReplies] = useState({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [postToShare, setPostToShare] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleCommentSubmit = (postId) => {
    const comment = commentInputs[postId];
    if (!comment) return;
    dispatch(storeComments({ post_id: postId, content: comment })).then(
      (res) => {
        dispatch(getGathering());
        dispatch(getPosts());
        dispatch(getPostById(postId));
      }
    );

    // Clear input
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleCommentLike = (postId, commentIndex) => {
    const comment = 1;
    dispatch(likeComment({ commentId: comment.id })).then(() => {
      // Optionally refresh comments or update state
      dispatch(getPosts());
    });
  };

  const handleCommentReaction = (comment_id, reaction) => {
    dispatch(likeComment({ comment_id, reaction_type: reaction })).then(() => {
      setShowCommentReactionsFor(null);
      dispatch(getPosts());
      dispatch(getPostById(basicPostData.id));
    });
  };

  const handleReplyReaction = (reply_id, reaction, commentId, commentIndex) => {
    dispatch(likeReply({ reply_id, type: reaction })).then(() => {
      setShowCommentReactionsFor(null);
      dispatch(getPosts());
      dispatch(getPostById(basicPostData.id));
      handleViewAllReplies(commentId, commentIndex);
    });
  };

  const handleReplySubmit = (postId, commentIndex) => {
    const key = `${postId}-${commentIndex}`;
    const reply = replyInputs[key];
    const comment = 1;
    if (!reply) return;
    dispatch(replyToComment({ commentId: comment.id, content: reply })).then(
      () => {
        // Optionally refresh comments or update state
        dispatch(getPosts());
        setReplyInputs((prev) => ({ ...prev, [key]: "" }));
      }
    );
  };

  const handleReaction = (postId, reaction) => {
    dispatch(
      storePostReactions({ post_id: postId, reaction_type: reaction })
    ).then(() => {
      setShowReactionsFor(null);
      dispatch(getGathering());
      dispatch(getPosts());
      dispatch(getPostById(postId));
      dispatch(getMyProfile());
      if(params?.id){
        dispatch(getUserProfile(params?.id));
      }

    });
  };

  const reactionRef = useRef(null);
  const dropdownRef = useRef(null);
  const commentReactionRef = useRef(null);

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
    if (!showCommentReactionsFor) return;
    function handleClickOutside(event) {
      if (
        commentReactionRef.current &&
        !commentReactionRef.current.contains(event.target)
      ) {
        setShowCommentReactionsFor(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCommentReactionsFor]);

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

  const handleEditPost = (postId) => {
    dispatch(getPostById(postId)).then(() => {
      dispatch(setPostModalOpen(true));
      setOpenDropdownFor(null);
    });
  };

  const handleOnlyMe = (mode) => {
    const modeData = {
      id: mode.id,
      privacy_mode: mode.privacy_mode === "public" ? "private" : "public",
    };
    dispatch(updatePostPrivacy(modeData))
      .then(() => {
        dispatch(getPosts());
        setOpenDropdownFor(null);
      })
      .catch(() => {
        alert("Failed to update privacy");
        setOpenDropdownFor(null);
      });
  };

  const handleDeletePost = (postId) => {
    dispatch(deletePost(postId))
      .then(() => {
        dispatch(getPosts());
        setOpenDropdownFor(null);
      })
      .catch(() => {
        alert("Failed to update privacy");
        setOpenDropdownFor(null);
      });
  };

  const handleReportPost = (postId) => {
    alert('Report this post');
  };

  const handleViewAllComments = (id) => {
    dispatch(getPostById(id)).then((res) => {
      setShowCommentsModal(true);
    });
  };

  const handleModalCommentLike = (comment) => {
    setShowCommentReactionsFor(comment.id);
  };

  const handleModalReplySubmit = (commentIndex) => {
    
    const reply = modalReplyInputs[commentIndex];
    console.log('called', reply)
    if (!reply) return;

    // Get the comment object from basicPostData
    const comment = basicPostData?.comments?.[commentIndex];

    // Call API to save reply
    dispatch(
      replyToComment({ comment_id: comment.id, parent_id: "null", content: reply })
    )
      .then(() => {
        dispatch(getPostById(basicPostData.id));
        setModalReplyInputs((prev) => ({ ...prev, [commentIndex]: "" }));
        handleViewAllReplies(comment?.id, commentIndex);
      })
      .catch((error) => {
        console.error("Failed to submit reply:", error);
      });
  };

  const handleViewAllReplies = (commentId, index) => {
    setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));

    dispatch(getCommentReplies(commentId))
      .then((response) => {
        console.log('response from component',response)
        if (response && response.payload?.data?.comment?.replies) {
          setModalReplies((prev) => ({
            ...prev,
            [index]: response.payload?.data?.comment?.replies || [],
          }));
        }
      })
      .finally(() => {
        setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
      });
  };

  // Create a moment formatter that returns 4h/4d/40m/10s format
  const formatCompactTime = (timestamp) => {
    if (!timestamp) return "";

    const duration = moment.duration(moment().diff(moment(timestamp)));
    const days = Math.floor(duration.asDays());
    const hours = Math.floor(duration.asHours()) % 24;
    const minutes = Math.floor(duration.asMinutes()) % 60;
    const seconds = Math.floor(duration.asSeconds()) % 60;

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  };

  const handleReplyToReply = (commentIndex, replyId) => {
    const inputKey = `reply-${commentIndex}-${replyId}`;
    setModalReplyInputs(prev => ({ 
      ...prev, 
      [inputKey]: prev[inputKey] === undefined ? "" : prev[inputKey]
    }));
  };

  const handleReplyToReplySubmit = (commentIndex, replyId) => {
    const inputKey = `reply-${commentIndex}-${replyId}`;
    const reply = modalReplyInputs[inputKey];
    if (!reply) return;
    const comment = basicPostData?.comments?.[commentIndex];
        dispatch(
      replyToComment({ 
        comment_id: comment.id, 
        parent_id: "null", 
        content: reply 
      })
    )
      .then(() => {
        dispatch(getPostById(basicPostData.id));
        setModalReplyInputs(prev => ({ ...prev, [inputKey]: "" }));
        handleViewAllReplies(comment?.id, commentIndex);
      })
      .catch((error) => {
        console.error("Failed to submit reply to reply:", error);
      });
  };

  const handleShare = (post_id) => {
    setPostToShare(post_id);
    setShowShareModal(true);
  }

  const confirmShare = () => {
    if (postToShare) {
      dispatch(sharePost({post_id: postToShare}))
        .then((res) => {
          dispatch(getPosts());
          setShowShareModal(false);
          setPostToShare(null);
          toast.success("Shared Successfully")
        })
        .catch((error) => {
          console.error('Share failed:', error);
          setShowShareModal(false);
          setPostToShare(null);
        });
    }
  }

  const cancelShare = () => {
    setShowShareModal(false);
    setPostToShare(null);
  }

  const handleImagePreview = (imageSrc, allImages, index) => {
    setPreviewImage(imageSrc);
    setPreviewImages(allImages);
    setCurrentImageIndex(index);
    setShowImagePreview(true);
  };

  const closeImagePreview = () => {
    setShowImagePreview(false);
    setPreviewImage(null);
    setPreviewImages([]);
    setCurrentImageIndex(0);
  };

  const goToPreviousImage = () => {
    if (currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1;
      setCurrentImageIndex(newIndex);
      setPreviewImage(previewImages[newIndex]);
    }
  };

  const goToNextImage = () => {
    if (currentImageIndex < previewImages.length - 1) {
      const newIndex = currentImageIndex + 1;
      setCurrentImageIndex(newIndex);
      setPreviewImage(previewImages[newIndex]);
    }
  };

  // Keyboard navigation for image preview
  useEffect(() => {
    if (!showImagePreview) return;
    
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'Escape':
          closeImagePreview();
          break;
        case 'ArrowLeft':
          goToPreviousImage();
          break;
        case 'ArrowRight':
          goToNextImage();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showImagePreview, currentImageIndex, previewImages.length]);

  return (
    <div className="">
      {postsData?.data?.map((item, index) => {
        const totalCount = item.multiple_reaction_counts.reduce(
          (sum, dd) => Number(sum) + Number(dd.count),
          0
        );

        return (
          <div
            className="bg-white rounded-lg shadow-sm p-4 mb-4"
            key={item.id || index}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex">
                <div className="w-10 h-10 border border-blue-600 rounded-full overflow-hidden mr-3">
                  <img
                    src={ item?.client?.image ?
                      process.env.NEXT_PUBLIC_CLIENT_FILE_PATH +
                      item?.client?.image : "/common-avator.jpg"
                    }
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/common-avator.jpg";
                    }}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Link href={`/user/user-profile/${item?.client?.id}`}>
                      <h4 className="font-medium cursor-pointer hover:underline">
                        {item?.client?.fname + " " + item?.client?.last_name}
                      </h4>
                    </Link>
                    {item?.shared_post && (
                      <>
                      <span className="text-gray-500">•</span>
                      <p className="text-sm text-gray-500">
                      Shared from {" "}
                      <span className="font-semibold hover:underline cursor-pointer">
                      <Link href={`/user/user-profile/${item?.shared_post?.client?.id}`}>
                        {item?.shared_post?.client?.fname + " " + item?.shared_post?.client?.last_name}
                      </Link>
                      </span>
                      </p>
                      </>
                    )}
                    
                    <span className="text-gray-500">•</span>
                    <p className="text-sm text-gray-500">
                      {formatCompactTime(item.created_at)}
                    </p>
                   
                  </div>
                  <p className="text-gray-500 text-sm">
                    {item?.client?.fromcountry?.name ? item?.client?.fromcountry?.name : 'This Account Location Not Set Yet.'}{" "}
                    {item?.privacy_mode === "public" ? (
                      <FaGlobe className="inline ml-1" />
                    ) : (
                      <FaLock className="inline ml-1" />
                    )}
                  </p>
                </div>
              </div>
              <div className="relative">
                <button
                  className="text-gray-500 cursor-pointer"
                  onClick={() =>
                    setOpenDropdownFor(
                      openDropdownFor === item.id ? null : item.id
                    )
                  }
                >
                  <FaEllipsisH />
                </button>
                {openDropdownFor === item.id && (
                  <div
                    ref={dropdownRef}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-20"
                  >
                    {profile?.client?.id === item?.client?.id && <button
                      onClick={() => handleEditPost(item.id)}
                      className="cursor-pointer flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                     <CiEdit className="mr-2"/>
                      Edit post
                    </button> }
                    {profile?.client?.id === item?.client?.id && <button
                      onClick={() => handleOnlyMe(item)}
                      className="cursor-pointer flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <CiUnlock className="mr-2"/>
                      {item?.privacy_mode === "public" ? "Only Me" : "Public"}
                    </button>}
                    {profile?.client?.id === item?.client?.id && <button
                      onClick={() => handleDeletePost(item.id)}
                      className="cursor-pointer flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <MdOutlineDeleteOutline className="mr-2"/>
                      Delete post
                    </button>}
                    <button
                      onClick={() => handleReportPost(item.id)}
                      className="cursor-pointer flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <TbMessageReport className="mr-2"/>
                      Report Post
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="post-content">
              <p className="text-gray-700 py-2">{item?.message}</p>

              {/* Display Post Images */}
              {item?.files && item?.files?.length > 0 && (
                <div
                  className={`mt-3 grid ${
                    item?.files?.length === 1
                      ? "grid-cols-1"
                      : item?.files?.length === 2
                      ? "grid-cols-2"
                      : item.files?.length >= 3
                      ? "grid-cols-2"
                      : ""
                  } gap-2`}
                >
                  {item?.files?.map((file, fileIndex) => {
                    // Determine if file is a video by extension
                    const filePath = file.file_path || file.path || file.url || file.file_url || '';
                    const isVideo = /\.(mp4|webm|ogg|mov|avi)$/i.test(filePath);
                    const src =
                      (process.env.NEXT_PUBLIC_FILE_PATH ? process.env.NEXT_PUBLIC_FILE_PATH + "/" : "/uploads/") + filePath;
                    
                    // Prepare all images for preview
                    const allImages = item.files
                      .filter(f => {
                        const fPath = f.file_path || f.path || f.url || f.file_url || '';
                        return !/\.(mp4|webm|ogg|mov|avi)$/i.test(fPath);
                      })
                      .map(f => {
                        const fPath = f.file_path || f.path || f.url || f.file_url || '';
                        return (process.env.NEXT_PUBLIC_FILE_PATH ? process.env.NEXT_PUBLIC_FILE_PATH + "/" : "/uploads/") + fPath;
                      });
                    
                    const imageIndex = allImages.indexOf(src);
                    
                    return (
                      <div
                        key={fileIndex}
                        className={`overflow-hidden rounded-lg ${
                          item.files?.length === 1 ? "max-h-96" : "h-48"
                        } bg-gray-100`}
                      >
                        {isVideo ? (
                          <video controls className="w-full h-full object-cover">
                            <source src={src} />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            src={src}
                            alt={`Post media ${fileIndex + 1}`}
                            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handleImagePreview(src, allImages, imageIndex)}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-gray-200 border-t border-b py-2 mt-2">
              <div className="flex items-center">
                <span className="mr-2">
                  <span role="img" aria-label="surprised" className="text-xl">
                    {item?.multiple_reaction_counts?.length > 0 &&
                      item?.multiple_reaction_counts
                        ?.slice(0, 2)
                        .map((reaction, index) => (
                          <span key={index} className="inline-block">
                            {reaction?.type === "like" && (
                              <img
                                src="/like.png"
                                className="w-4 h-4 mb-[4px] inline-block"
                              />
                            )}
                            {reaction?.type === "love" && (
                              <img
                                src="/love.png"
                                className="w-4 h-4 mb-[4px] inline-block"
                              />
                            )}
                            {reaction?.type === "care" && (
                              <img
                                src="/care.png"
                                className="w-4 h-4 mb-[4px] inline-block"
                              />
                            )}
                            {reaction?.type === "haha" && (
                              <img
                                src="/haha.png"
                                className="w-4 h-4 mb-[4px] inline-block"
                              />
                            )}
                            {reaction?.type === "wow" && (
                              <img
                                src="/wow.png"
                                className="w-4 h-4 mb-[4px] inline-block"
                              />
                            )}
                            {reaction?.type === "sad" && (
                              <img
                                src="/sad.png"
                                className="w-4 h-4 mb-[4px] inline-block"
                              />
                            )}
                            {reaction?.type === "angry" && (
                              <img
                                src="/angry.png"
                                className="w-4 h-4 mb-[4px] inline-block"
                              />
                            )}
                          </span>
                        ))}
                  </span>
                </span>
                {/* <span className="text-sm">{item?.single_reaction?.client?.fname + " " + item?.single_reaction?.client?.last_name + " and " + totalCount }</span> */}
                <span className="text-sm">{Number(totalCount)}</span>
                <span className="flex items-center gap-2 ml-auto text-sm text-gray-500">
                  2 <FaRegComment className="" />
                </span>
              </div>
            </div>

            <div className="flex justify-between py-1 border-gray-200 border-b">
              <div className="flex-1 relative">
                <div className="relative">
                  <button
                    className="w-full py-1 cursor-pointer text-center text-blue-500 bg-gray-100 rounded-md"
                    onClick={() =>
                      setShowReactionsFor(
                        showReactionsFor === item.id ? null : item.id
                      )
                    }
                  >
                    <div className="flex items-center justify-center gap-2">
                      {!item.single_reaction ? (
                        <>
                          <SlLike /> <span>Like</span>
                        </>
                      ) : (
                        <span className="inline-block">
                          {item?.single_reaction?.type === "like" && (
                            <span className="font-semibold">
                              <img
                                src="/like.png"
                                className="w-5 h-5 mb-[4px] inline-block"
                              />{" "}
                              <span>Like</span>
                            </span>
                          )}
                          {item?.single_reaction?.type === "love" && (
                            <span className="font-semibold">
                              <img
                                src="/love.png"
                                className="w-5 h-5 inline-block mb-[4px]"
                              />{" "}
                              <span className="text-red-700 text-[14px]">
                                Love
                              </span>
                            </span>
                          )}
                          {item?.single_reaction?.type === "care" && (
                            <span className="font-semibold">
                              <img
                                src="/care.png"
                                className="w-5 h-5 inline-block mb-[4px]"
                              />{" "}
                              <span className="text-yellow-700 text-[14px]">
                                Care
                              </span>
                            </span>
                          )}
                          {item?.single_reaction?.type === "haha" && (
                            <span className="font-semibold">
                              <img
                                src="/haha.png"
                                className="w-5 h-5 inline-block mb-[4px]"
                              />{" "}
                              <span className="text-yellow-700 text-[14px]">
                                Haha
                              </span>
                            </span>
                          )}
                          {item?.single_reaction?.type === "wow" && (
                            <span className="font-semibold">
                              <img
                                src="/wow.png"
                                className="w-5 h-5 inline-block mb-[4px]"
                              />{" "}
                              <span className="text-yellow-700 text-[14px]">
                                Wow
                              </span>
                            </span>
                          )}
                          {item?.single_reaction?.type === "sad" && (
                            <span className="font-semibold">
                              <img
                                src="/sad.png"
                                className="w-5 h-5 inline-block mb-[4px]"
                              />{" "}
                              <span className="text-yellow-700 text-[14px]">
                                Sad
                              </span>
                            </span>
                          )}
                          {item?.single_reaction?.type === "angry" && (
                            <span className="font-semibold">
                              <img
                                src="/angry.png"
                                className="w-5 h-5 inline-block mb-[4px]"
                              />{" "}
                              <span className="text-red-500 text-[14px]">
                                Angry
                              </span>
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </button>
                  {showReactionsFor === item.id && (
                    <div
                      ref={reactionRef}
                      className="absolute bottom-full left-0 mb-2 bg-white p-1 rounded-full shadow-lg flex space-x-2 z-10"
                    >
                      <div
                        className="transform w-6 cursor-pointer hover:scale-125 transition-transform"
                        onClick={() => handleReaction(item.id, "like")}
                      >
                        <img src="/like.png" alt="Like" className="" />
                      </div>
                      <button
                        className="transform w-6 cursor-pointer hover:scale-125 transition-transform"
                        onClick={() => handleReaction(item.id, "love")}
                      >
                        <img src="/love.png" alt="Love" className="" />
                      </button>
                      <button
                        className="transform w-6 cursor-pointer hover:scale-125 transition-transform"
                        onClick={() => handleReaction(item.id, "care")}
                      >
                        <img src="/care.png" alt="Care" className="" />
                      </button>
                      <button
                        className="transform w-6 cursor-pointer hover:scale-125 transition-transform"
                        onClick={() => handleReaction(item.id, "haha")}
                      >
                        <img src="/haha.png" alt="Haha" className="" />
                      </button>
                      <button
                        className="transform w-6 cursor-pointer hover:scale-125 transition-transform"
                        onClick={() => handleReaction(item.id, "wow")}
                      >
                        <img src="/wow.png" alt="Wow" className="" />
                      </button>

                      <button
                        className="transform w-6 cursor-pointer hover:scale-125 transition-transform"
                        onClick={() => handleReaction(item.id, "sad")}
                      >
                        <img src="/sad.png" alt="Sad" className="" />
                      </button>
                      <button
                        className="transform w-6 cursor-pointer hover:scale-125 transition-transform"
                        onClick={() => handleReaction(item.id, "angry")}
                      >
                        <img src="/angry.png" alt="Angry" className="" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <button className="flex-1 py-1 cursor-pointer text-center text-gray-500 hover:bg-gray-100 rounded-md">
                <div 
                  className="flex items-center justify-center gap-2"
                  onClick={() => {
                    handleViewAllComments(item.id);
                  }}
                >
                  <FaComment /> <span>Comment</span>
                </div>
              </button>
              <button className="flex-1 py-1 cursor-pointer text-center text-gray-500 hover:bg-gray-100 rounded-md">
                <div 
                className="flex items-center justify-center gap-2"
                onClick={() => {handleShare(item?.id)}}
                >
                  <IoIosShareAlt size={25} /> <span>Share</span>
                </div>
              </button>
            </div>

            <div
              className="cursor-pointer"
              onClick={() => {
                handleViewAllComments(item.id);
              }}
            >
              View all comments
            </div>





            {/* Comments section */}
            {item?.latest_comment && (
              <div className="mt-2 pl-2">
                <div className="mb-2">
                  <div className="flex">
                    <div className="w-8 h-8 rounded-full overflow-hidden mr-2 mt-2">
                      <img
                        src={ item?.latest_comment?.client?.image ?
                          process.env.NEXT_PUBLIC_CLIENT_FILE_PATH +
                          item?.latest_comment?.client?.image : "/common-avator.jpg"
                        }
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/common-avator.jpg";
                        }}
                      />
                    </div>
                    <div className="p-2 rounded-lg flex-grow">
                      <div className="flex flex-col bg-gray-100 p-2 rounded-md">
                        <span className="font-medium">
                          <Link
                            href={`/user/user-profile/${item?.latest_comment?.client_id}`}
                            className="cursor-pointer hover:underline"
                          >
                            {item?.latest_comment?.client?.fname +
                              " " +
                              item?.latest_comment?.client?.last_name}{" "}
                          </Link>
                          
                        </span>
                        <span className="text-gray-700 text-sm">
                          {item?.latest_comment?.content}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex gap-2">
                      <span className="text-xs text-gray-500 ml-2">
                            {formatCompactTime(
                              item?.latest_comment?.created_at
                            )}
                          </span>
                          <span>•</span>
                        <button
                          className="text-gray-500 hover:underline relative cursor-pointer"
                          onClick={() => setShowCommentReactionsFor(
                            showCommentReactionsFor === item?.latest_comment?.id ? null : item?.latest_comment?.id
                          )}
                          type="button"
                        >
                          {!item?.latest_comment?.single_reaction ? (
                            <>
                              <span>Like</span>
                            </>
                          ) : (
                            <span className="inline-block">
                              {item?.latest_comment?.single_reaction?.type === "like" && (
                                <span className="font-semibold">
                                  <span className="text-blue-500 text-[12px]">Like</span>
                                </span>
                              )}
                              {item?.latest_comment?.single_reaction?.type === "love" && (
                                <span className="font-semibold">
                                  <span className="text-red-700 text-[12px]">
                                    Love
                                  </span>
                                </span>
                              )}
                              {item?.latest_comment?.single_reaction?.type === "care" && (
                                <span className="font-semibold">
                                  <span className="text-yellow-700 text-[12px]">
                                    Care
                                  </span>
                                </span>
                              )}
                              {item?.latest_comment?.single_reaction?.type === "haha" && (
                                <span className="font-semibold">
                                  <span className="text-yellow-700 text-[12px]">
                                    Haha
                                  </span>
                                </span>
                              )}
                              {item?.latest_comment?.single_reaction?.type === "wow" && (
                                <span className="font-semibold">
                                  <span className="text-yellow-700 text-[12px]">
                                    Wow
                                  </span>
                                </span>
                              )}
                              {item?.latest_comment?.single_reaction?.type === "sad" && (
                                <span className="font-semibold">
                                  <span className="text-yellow-700 text-[12px]">
                                    Sad
                                  </span>
                                </span>
                              )}
                              {item?.latest_comment?.single_reaction?.type === "angry" && (
                                <span className="font-semibold">
                                  <span className="text-red-500 text-[12px]">
                                    Angry
                                  </span>
                                </span>
                              )}
                            </span>
                          )}
                          {showCommentReactionsFor === item?.latest_comment?.id && (
                            <div
                              ref={commentReactionRef}
                              className="absolute bottom-full w-50 bg-white p-2 rounded-full shadow-lg flex space-x-2 z-10"
                            >
                              <img
                                src="/like.png"
                                alt="Like"
                                className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCommentReaction(item?.latest_comment?.id, "like");
                                }}
                              />
                              <img
                                src="/love.png"
                                alt="Love"
                                className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCommentReaction(item?.latest_comment?.id, "love");
                                }}
                              />
                              <img
                                src="/care.png"
                                alt="Care"
                                className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCommentReaction(item?.latest_comment?.id, "care");
                                }}
                              />
                              <img
                                src="/haha.png"
                                alt="Haha"
                                className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCommentReaction(item?.latest_comment?.id, "haha");
                                }}
                              />
                              <img
                                src="/wow.png"
                                alt="Wow"
                                className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCommentReaction(item?.latest_comment?.id, "wow");
                                }}
                              />
                              <img
                                src="/sad.png"
                                alt="Sad"
                                className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCommentReaction(item?.latest_comment?.id, "sad");
                                }}
                              />
                              <img
                                src="/angry.png"
                                alt="Angry"
                                className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCommentReaction(item?.latest_comment?.id, "angry");
                                }}
                              />
                            </div>
                          )}
                        </button>
                        {/* <span>•</span>
                        <button
                          className="text-gray-500"
                          // onClick={() => setReplyInputs(prev => ({ ...prev, [key]: prev[key] === undefined ? "" : prev[key] }))}
                          type="button"
                        >
                          Reply
                        </button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}



            {/* all comments  */}
            <div className="mt-2 pl-2">
              {/* Add comment */}
              <div className="flex mt-2">
                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                  <img
                    src="/common-avator.jpg"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow relative">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-100 rounded-full px-4 py-2 text-sm pr-10"
                    value={commentInputs[item.id] || ""}
                    onChange={(e) =>
                      setCommentInputs({
                        ...commentInputs,
                        [item.id]: e.target.value,
                      })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCommentSubmit(item.id);
                      }
                    }}
                  />
                  <button
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => handleCommentSubmit(item.id)}
                    type="button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}





{/* comment modal */}
      {showCommentsModal && basicPostData && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowCommentsModal(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-gray-200 flex items-center justify-between p-4 pb-2 relative">
              <div className="absolute text-xl font-bold left-0 w-full text-center">
                {basicPostData.client?.fname + "'"}s Post
              </div>
              <div className="ml-auto z-10">
                <button
                  className="text-3xl text-black cursor-pointer hover:text-gray-700"
                  onClick={() => setShowCommentsModal(false)}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 px-6 pt-4 pb-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={ basicPostData?.client?.image ?
                      process.env.NEXT_PUBLIC_CLIENT_FILE_PATH +
                      basicPostData?.client?.image : "/common-avator.jpg"
                    }
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/common-avator.jpg";
                    }}
                  />
                </div>
                <div>
                  <Link
                    href={`/user/user-profile/${basicPostData?.client?.id}`}
                    className="cursor-pointer hover:underline"
                  >
                    <div className="font-semibold">
                      {basicPostData?.client?.fname}{" "}
                      {basicPostData?.client?.last_name}
                    </div>
                  </Link>
                  <div className="flex gap-2 text-xs text-gray-500 font-semibold">
                    {moment(basicPostData?.created_at).format("MMM DD") +
                      " at " +
                      moment(basicPostData.created_at).format("HH:MM A")}{" "}
                        <span>•</span>

                    {basicPostData.privacy_mode === "public" ? (
                      <FaGlobeAmericas className="mt-[3px]" />
                    ) : (
                      <FaLock className="mt-[3px]" />
                    )}
                  </div>
                </div>
              </div>
              {/* Post message */}
              <div className="text-gray-800 mb-4 break-words">
                {basicPostData.message}
              </div>
              {/* Post images if any */}
              {basicPostData.files && basicPostData.files.length > 0 && (
                <div
                  className={`mt-3 grid cursor-pointer ${
                    basicPostData.files.length === 1
                      ? "grid-cols-1"
                      : basicPostData.files.length >= 2
                      ? "grid-cols-2"
                      : ""
                  } gap-2 mb-4`}
                >
                  {basicPostData.files.map((file, fileIndex) => {
                    // Determine if file is a video by extension
                    const filePath = file.file_path || file.path || file.url || file.file_url || '';
                    const isVideo = /\.(mp4|webm|ogg|mov|avi)$/i.test(filePath);
                    const src = process.env.NEXT_PUBLIC_FILE_PATH + "/" + filePath;
                    
                    // Prepare all images for preview
                    const allImages = basicPostData.files
                      .filter(f => {
                        const fPath = f.file_path || f.path || f.url || f.file_url || '';
                        return !/\.(mp4|webm|ogg|mov|avi)$/i.test(fPath);
                      })
                      .map(f => {
                        const fPath = f.file_path || f.path || f.url || f.file_url || '';
                        return process.env.NEXT_PUBLIC_FILE_PATH + "/" + fPath;
                      });
                    
                    const imageIndex = allImages.indexOf(src);
                    
                    return (
                      <div
                        key={fileIndex}
                        className={`overflow-hidden rounded-lg ${
                          basicPostData.files.length === 1 ? "max-h-96" : "h-48"
                        } bg-gray-100`}
                      >
                        {isVideo ? (
                          <video controls className="w-full h-full object-cover">
                            <source src={src} />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            src={src}
                            alt={`Post media ${fileIndex + 1}`}
                            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handleImagePreview(src, allImages, imageIndex)}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Reactions section - same as in post list */}
              <div className="border-gray-200 border-t border-b py-2 mt-2">
                <div className="flex items-center">
                  <span className="mr-2">
                    <span role="img" aria-label="surprised" className="text-xl">
                      {basicPostData?.reactions?.length > 0 &&
                        basicPostData?.reactions
                          ?.slice(0, 2)
                          .map((reaction, index) => (
                            <span key={index} className="inline-block">
                              {reaction?.type === "like" && (
                                <img
                                  src="/like.png"
                                  className="w-4 h-4 mb-[4px] inline-block"
                                />
                              )}
                              {reaction?.type === "love" && (
                                <img
                                  src="/love.png"
                                  className="w-4 h-4 mb-[4px] inline-block"
                                />
                              )}
                              {reaction?.type === "care" && (
                                <img
                                  src="/care.png"
                                  className="w-4 h-4 mb-[4px] inline-block"
                                />
                              )}
                              {reaction?.type === "haha" && (
                                <img
                                  src="/haha.png"
                                  className="w-4 h-4 mb-[4px] inline-block"
                                />
                              )}
                              {reaction?.type === "wow" && (
                                <img
                                  src="/wow.png"
                                  className="w-4 h-4 mb-[4px] inline-block"
                                />
                              )}
                              {reaction?.type === "sad" && (
                                <img
                                  src="/sad.png"
                                  className="w-4 h-4 mb-[4px] inline-block"
                                />
                              )}
                              {reaction?.type === "angry" && (
                                <img
                                  src="/angry.png"
                                  className="w-4 h-4 mb-[4px] inline-block"
                                />
                              )}
                            </span>
                          ))}
                    </span>
                  </span>
                  <span className="text-sm">
                    {basicPostData?.reactions?.length || 0}
                  </span>
                  <span className="flex items-center gap-2 ml-auto text-sm text-gray-500">
                    {basicPostData.comments?.length || 0}{" "}
                    <FaRegComment className="" />
                  </span>
                </div>
              </div>

              <div className="flex justify-between py-1 border-gray-200 border-b mb-4">
                <div className="flex-1 relative">
                  <div className="relative">
                    <button
                      className="w-full py-1 cursor-pointer text-center text-blue-500 bg-gray-100 rounded-md"
                      onClick={() =>
                        setShowReactionsFor(
                          showReactionsFor === basicPostData.id
                            ? null
                            : basicPostData.id
                        )
                      }
                    >
                      <div className="flex items-center justify-center gap-2">
                        {!basicPostData.single_reaction ? (
                          <>
                            <SlLike /> <span>Like</span>
                          </>
                        ) : (
                          <span className="inline-block">
                            {basicPostData?.single_reaction?.type ===
                              "like" && (
                              <span className="font-semibold">
                                <img
                                  src="/like.png"
                                  className="w-5 h-5 mb-[4px] inline-block"
                                />{" "}
                                <span>Like</span>
                              </span>
                            )}
                            {basicPostData?.single_reaction?.type ===
                              "love" && (
                              <span className="font-semibold">
                                <img
                                  src="/love.png"
                                  className="w-5 h-5 inline-block mb-[4px]"
                                />{" "}
                                <span className="text-red-700 text-[14px]">
                                  Love
                                </span>
                              </span>
                            )}
                            {basicPostData?.single_reaction?.type ===
                              "care" && (
                              <span className="font-semibold">
                                <img
                                  src="/care.png"
                                  className="w-5 h-5 inline-block mb-[4px]"
                                />{" "}
                                <span className="text-yellow-700 text-[14px]">
                                  Care
                                </span>
                              </span>
                            )}
                            {basicPostData?.single_reaction?.type ===
                              "haha" && (
                              <span className="font-semibold">
                                <img
                                  src="/haha.png"
                                  className="w-5 h-5 inline-block mb-[4px]"
                                />{" "}
                                <span className="text-yellow-700 text-[14px]">
                                  Haha
                                </span>
                              </span>
                            )}
                            {basicPostData?.single_reaction?.type === "wow" && (
                              <span className="font-semibold">
                                <img
                                  src="/wow.png"
                                  className="w-5 h-5 inline-block mb-[4px]"
                                />{" "}
                                <span className="text-yellow-700 text-[14px]">
                                  Wow
                                </span>
                              </span>
                            )}
                            {basicPostData?.single_reaction?.type === "sad" && (
                              <span className="font-semibold">
                                <img
                                  src="/sad.png"
                                  className="w-5 h-5 inline-block mb-[4px]"
                                />{" "}
                                <span className="text-yellow-700 text-[14px]">
                                  Sad
                                </span>
                              </span>
                            )}
                            {basicPostData?.single_reaction?.type ===
                              "angry" && (
                              <span className="font-semibold">
                                <img
                                  src="/angry.png"
                                  className="w-5 h-5 inline-block mb-[4px]"
                                />{" "}
                                <span className="text-red-500 text-[14px]">
                                  Angry
                                </span>
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    </button>
                    {showReactionsFor === basicPostData.id && (
                      <div
                        ref={reactionRef}
                        className="absolute bottom-full left-0 mb-2 bg-white p-2 rounded-full shadow-lg flex space-x-2 z-10"
                      >
                        <button
                          className="transform hover:scale-125 transition-transform cursor-pointer"
                          onClick={() =>
                            handleReaction(basicPostData.id, "like")
                          }
                        >
                          <img src="/like.png" alt="Like" className="w-8 h-8" />
                        </button>
                        <button
                          className="transform hover:scale-125 transition-transform cursor-pointer"
                          onClick={() =>
                            handleReaction(basicPostData.id, "love")
                          }
                        >
                          <img src="/love.png" alt="Love" className="w-8 h-8" />
                        </button>
                        <button
                          className="transform hover:scale-125 transition-transform cursor-pointer"
                          onClick={() =>
                            handleReaction(basicPostData.id, "care")
                          }
                        >
                          <img src="/care.png" alt="Care" className="w-8 h-8" />
                        </button>
                        <button
                          className="transform hover:scale-125 transition-transform cursor-pointer"
                          onClick={() =>
                            handleReaction(basicPostData.id, "haha")
                          }
                        >
                          <img src="/haha.png" alt="Haha" className="w-8 h-8" />
                        </button>
                        <button
                          className="transform hover:scale-125 transition-transform cursor-pointer"
                          onClick={() =>
                            handleReaction(basicPostData.id, "wow")
                          }
                        >
                          <img src="/wow.png" alt="Wow" className="w-8 h-8" />
                        </button>
                        <button
                          className="transform hover:scale-125 transition-transform cursor-pointer"
                          onClick={() =>
                            handleReaction(basicPostData.id, "sad")
                          }
                        >
                          <img src="/sad.png" alt="Sad" className="w-8 h-8" />
                        </button>
                        <button
                          className="transform hover:scale-125 transition-transform cursor-pointer"
                          onClick={() =>
                            handleReaction(basicPostData.id, "angry")
                          }
                        >
                          <img
                            src="/angry.png"
                            alt="Angry"
                            className="w-8 h-8"
                          />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <button className="flex-1 py-1 cursor-pointer text-center text-gray-500 hover:bg-gray-100 rounded-md">
                  <div className="flex items-center justify-center gap-2">
                    <IoMdShareAlt /> <span>Share (1)</span>
                  </div>
                </button>
              </div>

              {/* Comments Section */}
              <h4 className="font-semibold mb-4 text-lg">Comments</h4>
              {basicPostData?.comments &&
              basicPostData?.comments?.length > 0 ? (
                basicPostData?.comments?.map((c, i) => (
                  <div key={i} className="mb-4 flex items-start">
                    <div className="w-9 h-9 rounded-full overflow-hidden mr-3">
                      <img
                        src={ c?.client?.image ?
                          process.env.NEXT_PUBLIC_CLIENT_FILE_PATH +
                          c?.client?.image : "/common-avator.jpg"
                        }
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/common-avator.jpg";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 p-3 rounded-2xl">
                        <div className="font-medium text-sm">
                          <Link
                            href={`/user/user-profile/${c?.client_id}`}
                            className="cursor-pointer hover:underline"
                          >
                            {c?.client_comment?.fname +
                              " " +
                              c?.client_comment?.last_name}{" "}
                          </Link>
                          {/* <span className="text-xs text-gray-500 ml-2">
                            {formatCompactTime(c.created_at)}
                          </span> */}
                        </div>
                        <div className="text-gray-700 text-sm mt-1">
                          {c.content}
                        </div>
                      </div>
                      {/* Like and Reply buttons */}
                      <div className="flex gap-3 ml-2 text-xs text-gray-500">
                        <div>
                        {formatCompactTime(c.created_at)}
                        </div>
                        <button
                          className="hover:underline relative cursor-pointer"
                          onClick={() => handleModalCommentLike(c)}
                          type="button"
                        >
                           {!c.single_reaction ? (
                        <>
                          <span>Like</span>
                        </>
                      ) : (
                        <span className="inline-block">
                          {c?.single_reaction?.type === "like" && (
                            <span className="font-semibold">
                              <span className="text-blue-500 text-[12px]">Like</span>
                            </span>
                          )}
                          {c?.single_reaction?.type === "love" && (
                            <span className="font-semibold">
                              <span className="text-red-700 text-[12px]">
                                Love
                              </span>
                            </span>
                          )}
                          {c?.single_reaction?.type === "care" && (
                            <span className="font-semibold">
                              <span className="text-yellow-700 text-[12px]">
                                Care
                              </span>
                            </span>
                          )}
                          {c?.single_reaction?.type === "haha" && (
                            <span className="font-semibold">
                              <span className="text-yellow-700 text-[12px]">
                                Haha
                              </span>
                            </span>
                          )}
                          {c?.single_reaction?.type === "wow" && (
                            <span className="font-semibold">
                              <span className="text-yellow-700 text-[12px]">
                                Wow
                              </span>
                            </span>
                          )}
                          {c?.single_reaction?.type === "sad" && (
                            <span className="font-semibold">
                              <span className="text-yellow-700 text-[12px]">
                                Sad
                              </span>
                            </span>
                          )}
                          {c?.single_reaction?.type === "angry" && (
                            <span className="font-semibold">
                              <span className="text-red-500 text-[12px]">
                                Angry
                              </span>
                            </span>
                          )}
                        </span>
                      )}
                          {showCommentReactionsFor === c.id && (
                            <div
                              ref={commentReactionRef}
                              className="absolute bottom-full w-50 bg-white p-2 rounded-full shadow-lg flex space-x-2 z-10"
                            >
                              <img
                                src="/like.png"
                                alt="Like"
                                className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCommentReaction(c.id, "like");
                                }}
                              />
                              <img
                                src="/love.png"
                                alt="Love"
                                className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCommentReaction(c.id, "love");
                                }}
                              />
                              <img
                                src="/care.png"
                                alt="Care"
                                className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCommentReaction(c.id, "care");
                                }}
                              />
                              <img
                                src="/haha.png"
                                alt="Haha"
                                className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCommentReaction(c.id, "haha");
                                }}
                              />
                              <img
                                src="/wow.png"
                                alt="Wow"
                                className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCommentReaction(c.id, "wow");
                                }}
                              />
                              <img
                                src="/sad.png"
                                alt="Sad"
                                className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCommentReaction(c.id, "sad");
                                }}
                              />
                              <img
                                src="/angry.png"
                                alt="Angry"
                                className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCommentReaction(c.id, "angry");
                                }}
                              />
                            </div>
                          )}
                        </button>
                        <button
                          className="hover:underline cursor-pointer"
                          onClick={() => handleReplyToReply(i, c.id)}
                          type="button"
                        >
                          Reply
                        </button>
                      </div>
                      {/* Reply input */}
                      {modalReplyInputs[`reply-${i}-${c.id}`] !== undefined && (
                        <div className="flex mt-2">
                          <input
                            type="text"
                            className="w-full focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-100 rounded-full px-2 py-1 text-xs"
                            placeholder="Write a reply..."
                            value={modalReplyInputs[`reply-${i}-${c.id}`] || ""}
                            onChange={(e) =>
                              setModalReplyInputs((prev) => ({
                                ...prev,
                                [`reply-${i}-${c.id}`]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleReplyToReplySubmit(i, c.id);
                              }
                            }}
                          />
                          <button
                            className="ml-2 text-blue-500 text-xs cursor-pointer"
                            onClick={() => handleReplyToReplySubmit(i, c.id)}
                            type="button"
                          >
                            Send
                          </button>
                        </div>
                      )}
                      {/* Display "View all replies" button if there are replies */}
                      {(c.replies_count > 0 || c.replies?.length > 0 || modalReplies[i]?.length > 0) && (
                        <div className="mt-2">
                          <button
                            onClick={() => handleViewAllReplies(c.id, i)}
                            className="text-gray-500 cursor-pointer text-md hover:underline flex items-center gap-1"
                            disabled={loadingReplies[c.id]}
                          >
                            {loadingReplies[c.id]
                              ? "Loading..."
                              : `View all replies ${c.replies_count ? `(${c.replies_count})` : ''}`}
                          </button>
                        </div>
                      )}

                      {/* Display replies */}
                      {(modalReplies[i] || [])?.map((reply, ri) => (
                        <div className="flex mt-2 ml-8" key={ri}>
                          <div className="w-6 h-6 rounded-full overflow-hidden mr-2 mt-1">
                            <img
                              src={
                                process.env.NEXT_PUBLIC_CLIENT_FILE_PATH +
                                  reply?.client_comment?.image || "/common-avator.jpg"
                              }
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col w-full">
                            <div className="bg-gray-50 w-full p-2 rounded-md flex flex-col">
                              <span className="font-medium text-xs">
                                <Link
                                  href={`/user/user-profile/${reply?.client_id}`}
                                  className="cursor-pointer hover:underline"
                                >
                                  {reply?.client_comment?.fname +
                                    " " +
                                    reply?.client_comment?.last_name || reply.user}{" "}
                                </Link>
                                <span className="text-gray-400 ml-1">
                                  {reply.created_at
                                    ? formatCompactTime(reply.created_at)
                                    : "0s"}
                                </span>
                              </span>
                              <span className="text-gray-700 text-xs">
                                {reply.content || reply.text}
                              </span>
                            </div>
                            
                            {/* Reply reactions section */}
                            <div className="flex gap-3 mt-1 ml-2 text-xs text-gray-500">
                              <div>
                                {formatCompactTime(reply.created_at)}
                              </div>
                              <button
                                className="hover:underline relative cursor-pointer"
                                onClick={() => setShowCommentReactionsFor(
                                  showCommentReactionsFor === reply.id ? null : reply.id
                                )}
                                type="button"
                              >
                                {!reply.single_reaction ? (
                                  <>
                                    <span>Like</span>
                                  </>
                                ) : (
                                  <span className="inline-block">
                                    {reply?.single_reaction?.type === "like" && (
                                      <span className="font-semibold">
                                        <span className="text-blue-500 text-[12px]">Like</span>
                                      </span>
                                    )}
                                    {reply?.single_reaction?.type === "love" && (
                                      <span className="font-semibold">
                                        <span className="text-red-700 text-[12px]">
                                          Love
                                        </span>
                                      </span>
                                    )}
                                    {reply?.single_reaction?.type === "care" && (
                                      <span className="font-semibold">
                                        <span className="text-yellow-700 text-[12px]">
                                          Care
                                        </span>
                                      </span>
                                    )}
                                    {reply?.single_reaction?.type === "haha" && (
                                      <span className="font-semibold">
                                        <span className="text-yellow-700 text-[12px]">
                                          Haha
                                        </span>
                                      </span>
                                    )}
                                    {reply?.single_reaction?.type === "wow" && (
                                      <span className="font-semibold">
                                        <span className="text-yellow-700 text-[12px]">
                                          Wow
                                        </span>
                                      </span>
                                    )}
                                    {reply?.single_reaction?.type === "sad" && (
                                      <span className="font-semibold">
                                        <span className="text-yellow-700 text-[12px]">
                                          Sad
                                        </span>
                                      </span>
                                    )}
                                    {reply?.single_reaction?.type === "angry" && (
                                      <span className="font-semibold">
                                        <span className="text-red-500 text-[12px]">
                                          Angry
                                        </span>
                                      </span>
                                    )}
                                  </span>
                                )}
                                {showCommentReactionsFor === reply.id && (
                                  <div
                                    ref={commentReactionRef}
                                    className="absolute bottom-full w-50 bg-white p-2 rounded-full shadow-lg flex space-x-2 z-10"
                                  >
                                    <img
                                      src="/like.png"
                                      alt="Like"
                                      className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReplyReaction(reply.id, "like", reply.comment_id, ri);
                                      }}
                                    />
                                    <img
                                      src="/love.png"
                                      alt="Love"
                                      className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReplyReaction(reply.id, "love", reply.comment_id, ri);
                                      }}
                                    />
                                    <img
                                      src="/care.png"
                                      alt="Care"
                                      className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReplyReaction(reply.id, "care", reply.comment_id, ri);
                                      }}
                                    />
                                    <img
                                      src="/haha.png"
                                      alt="Haha"
                                      className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReplyReaction(reply.id, "haha", reply.comment_id, ri);
                                      }}
                                    />
                                    <img
                                      src="/wow.png"
                                      alt="Wow"
                                      className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReplyReaction(reply.id, "wow", reply.comment_id, ri);
                                      }}
                                    />
                                    <img
                                      src="/sad.png"
                                      alt="Sad"
                                      className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReplyReaction(reply.id, "sad", reply.comment_id, ri);
                                      }}
                                    />
                                    <img
                                      src="/angry.png"
                                      alt="Angry"
                                      className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleReplyReaction(reply.id, "angry", reply.comment_id, ri);
                                      }}
                                    />
                                  </div>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400">No comments yet.</div>
              )}
            </div>
            {/* Comment input at bottom */}
            <div className="p-4 bg-gray-50 flex items-center gap-2">
              <div className="w-9 h-9 rounded-full overflow-hidden">
                <img
                  src={ profile?.client?.image ? 
                    process.env.NEXT_PUBLIC_CLIENT_FILE_PATH +
                    profile?.client?.image : "/common-avator.jpg"
                  }
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/common-avator.jpg";
                  }}
                />
              </div>
              <input
                type="text"
                placeholder="Write a comment..."
                value={commentInputs[basicPostData.id] || ""}
                onChange={(e) =>
                  setCommentInputs({
                    ...commentInputs,
                    [basicPostData.id]: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCommentSubmit(basicPostData.id);
                  }
                }}
                className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
              />
              <button
                onClick={() => handleCommentSubmit(basicPostData.id)}
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-screen-lg max-h-screen-lg w-full h-full flex items-center justify-center p-4">
            {/* Close button */}
            <button
              onClick={closeImagePreview}
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 z-10"
            >
              ×
            </button>
            
            {/* Previous button */}
            {previewImages.length > 1 && currentImageIndex > 0 && (
              <button
                onClick={goToPreviousImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-gray-300 z-10"
              >
                ‹
              </button>
            )}
            
            {/* Next button */}
            {previewImages.length > 1 && currentImageIndex < previewImages.length - 1 && (
              <button
                onClick={goToNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-gray-300 z-10"
              >
                ›
              </button>
            )}
            
            {/* Image */}
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Image counter */}
            {previewImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-3 py-1 rounded">
                {currentImageIndex + 1} / {previewImages.length}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Share Confirmation Modal */}
      {showShareModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border border-gray-400">
            <div className="flex items-center justify-center mb-4">
              <IoIosShareAlt size={48} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-center mb-2">Share Post</h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to share this post to your timeline?
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelShare}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmShare}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Share Now
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PostList;
