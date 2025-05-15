"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  FaEllipsisH,
  FaVideo,
  FaGlobe,
  FaComment,
  FaLock,
} from "react-icons/fa";
import { SlLike } from "react-icons/sl";
import { IoMdShareAlt } from "react-icons/io";
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
} from "../../views/gathering/store";
import moment from "moment";

const PostList = ({postsData}) => {
  const { basicPostData } = useSelector(
    ({ gathering }) => gathering
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGathering());
    dispatch(getPosts());
  }, [dispatch]);

  // console.log('postsData',postsData)

  const [showReactionsFor, setShowReactionsFor] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [commentLikes, setCommentLikes] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [commentReplies, setCommentReplies] = useState({});
  const [openDropdownFor, setOpenDropdownFor] = useState(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [modalCommentLikes, setModalCommentLikes] = useState({});
  const [modalReplyInputs, setModalReplyInputs] = useState({});
  const [modalReplies, setModalReplies] = useState({});

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
    const comment = 1
    dispatch(likeComment({ commentId: comment.id }))
      .then(() => {
        // Optionally refresh comments or update state
        dispatch(getPosts());
      });
  };

  const handleReplySubmit = (postId, commentIndex) => {
    const key = `${postId}-${commentIndex}`;
    const reply = replyInputs[key];
    const comment = 1
    if (!reply) return;
    dispatch(replyToComment({ commentId: comment.id, content: reply }))
      .then(() => {
        // Optionally refresh comments or update state
        dispatch(getPosts());
        setReplyInputs(prev => ({ ...prev, [key]: "" }));
      });
  };

  const handleReaction = (postId, reaction) => {
    dispatch(
      storePostReactions({ post_id: postId, reaction_type: reaction })
    ).then(() => {
      setShowReactionsFor(null);
      dispatch(getGathering());
      dispatch(getPosts());
    });
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


  const handleViewAllComments = (id) => {
    dispatch(getPostById(id)).then((res) => {
      setShowCommentsModal(true);
    });
  };

  const handleModalCommentLike = (commentIndex) => {
    setModalCommentLikes((prev) => ({
      ...prev,
      [commentIndex]: (prev[commentIndex] || 0) + 1,
    }));
  };

  const handleModalReplySubmit = (commentIndex) => {
    const reply = modalReplyInputs[commentIndex];
    if (!reply) return;
    setModalReplies((prev) => ({
      ...prev,
      [commentIndex]: [
        ...(prev[commentIndex] || []),
        { user: "You", text: reply },
      ],
    }));
    setModalReplyInputs((prev) => ({ ...prev, [commentIndex]: "" }));
  };

  return (
    <div className="">
      {postsData?.data?.map((item, index) => {
        const totalCount = item.multiple_reaction_counts.reduce(
          (sum, dd) => sum + dd.count,
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
                    src={process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + item?.client?.image}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">
                      {item?.client?.fname + " " + item?.client?.last_name}
                    </h4>
                    <span className="text-gray-500">•</span>
                    <p className="text-sm text-gray-500">
                      {moment(item.created_at)?.fromNow()}
                    </p>
                  </div>
                  <p className="text-gray-500 text-sm">
                    This Account Location Not Set Yet.{" "}
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
                    <button
                      onClick={() => handleEditPost(item.id)}
                      className="cursor-pointer flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2v-2a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z"
                        />
                      </svg>
                      Edit post
                    </button>
                    <button
                      onClick={() => handleOnlyMe(item)}
                      className="cursor-pointer flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                      {item?.privacy_mode === "public" ? "Only Me" : "Public"}
                    </button>
                    <button
                      onClick={() => handleDeletePost(item.id)}
                      className="cursor-pointer flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Delete post
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
                      ? "grid-cols-3"
                      : ""
                  } gap-2`}
                >
                  {item?.files?.map((file, fileIndex) => (
                    <div
                      key={fileIndex}
                      className={`overflow-hidden rounded-lg ${
                        item.files?.length === 1 ? "max-h-96" : "h-48"
                      } bg-gray-100`}
                    >
                      <img
                        // src={file.url || file.file_url || file.path || `/uploads/${file.file}` || '/placeholder-image.jpg'}
                        src={
                          process.env.NEXT_PUBLIC_FILE_PATH +
                          "/" +
                          file.file_path
                        }
                        alt={`Post image ${fileIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-gray-200 border-t border-b py-2 mt-2">
              <div className="flex items-center">
                <span className="mr-2">
                  <span role="img" aria-label="surprised" className="text-xl">
                    😯
                  </span>
                </span>
                {/* <span className="text-sm">{item?.single_reaction?.client?.fname + " " + item?.single_reaction?.client?.last_name + " and " + totalCount }</span> */}
                <span className="text-sm">{totalCount}</span>
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
                      <SlLike /> <span>Like</span>
                    </div>
                  </button>
                  {showReactionsFor === item.id && (
                    <div
                      ref={reactionRef}
                      className="absolute bottom-full left-0 mb-2 bg-white p-2 rounded-full shadow-lg flex space-x-2 z-10"
                    >
                      <button
                        className="transform hover:scale-125 transition-transform"
                        onClick={() => handleReaction(item.id, "like")}
                      >
                        <img src="/like.png" alt="Like" className="w-8 h-8" />
                      </button>
                      <button
                        className="transform hover:scale-125 transition-transform"
                        onClick={() => handleReaction(item.id, "love")}
                      >
                        <img src="/love.png" alt="Love" className="w-8 h-8" />
                      </button>
                      <button
                        className="transform hover:scale-125 transition-transform"
                        onClick={() => handleReaction(item.id, "care")}
                      >
                        <img src="/care.png" alt="Care" className="w-8 h-8" />
                      </button>
                      <button
                        className="transform hover:scale-125 transition-transform"
                        onClick={() => handleReaction(item.id, "haha")}
                      >
                        <img src="/haha.png" alt="Haha" className="w-8 h-8" />
                      </button>
                      <button
                        className="transform hover:scale-125 transition-transform"
                        onClick={() => handleReaction(item.id, "wow")}
                      >
                        <img src="/wow.png" alt="Wow" className="w-8 h-8" />
                      </button>
                      <button
                        className="transform hover:scale-125 transition-transform"
                        onClick={() => handleReaction(item.id, "sad")}
                      >
                        <img src="/sad.png" alt="Sad" className="w-8 h-8" />
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

            <div
              className="cursor-pointer"
              onClick={() => {
                handleViewAllComments(item.id);
              }}
            >
              View all comments
            </div>
            {/* Comments section */}
            {
              item?.latest_comment && (
                <div className="mt-2 pl-2">
              <div className="mb-2">
                <div className="flex">
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-2 mt-2">
                    <img
                    src={process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + item?.latest_comment?.client?.image}
                    className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2 rounded-lg flex-grow">
                    <div className="flex flex-col bg-gray-100 p-2 rounded-md">
                      <span className="font-medium">
                        {item?.latest_comment?.client?.fname + " " + item?.latest_comment?.client?.last_name }{" "}
                        <span className="text-xs text-gray-500 ml-2">
                          {moment(item?.latest_comment?.created_at)?.fromNow()}
                        </span>
                      </span>
                      <span className="text-gray-700 text-sm">
                        {item?.latest_comment?.content}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex gap-2">
                      <button
                        className="text-gray-500"
                        onClick={() => handleCommentLike(item.id, item.id)}
                        type="button"
                      >
                        Like
                        {/* ({commentLikes[key] || 0}) */}
                      </button>
                      <span>•</span>
                      <button
                        className="text-gray-500"
                        // onClick={() => setReplyInputs(prev => ({ ...prev, [key]: prev[key] === undefined ? "" : prev[key] }))}
                        type="button"
                      >
                        Reply
                      </button>
                    </div>
                    {/* Reply input */}
                    {/* {replyInputs[key] !== undefined && (
                                <div className="flex mt-2">
                                  <input
                                    type="text"
                                    className="w-full focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-100 rounded-full px-2 py-1 text-xs"
                                    placeholder="Write a reply..."
                                    // value={replyInputs[key]}
                                    // onChange={e => setReplyInputs(prev => ({ ...prev, [key]: e.target.value }))}
                                  />
                                  <button
                                    className="ml-2 text-blue-500 text-xs"
                                    onClick={() => handleReplySubmit(item.id, item.id)}
                                    type="button"
                                  >
                                    Send
                                  </button>
                                </div>
                              )} */}
                    {/* Replies */}
                    {/* {(commentReplies[key] || []).map((reply, ri) => (
                                <div className="flex mt-2 ml-8" key={ri}>
                                  <div className="w-6 h-6 rounded-full overflow-hidden mr-2 mt-1">
                                    <img src='/common-avator.jpg' className="w-full h-full object-cover"/>
                                  </div>
                                  <div className="bg-gray-50 p-2 rounded-md flex flex-col">
                                    <span className="font-medium text-xs">{reply.user} <span className="text-gray-400 ml-1">just now</span></span>
                                    <span className="text-gray-700 text-xs">{reply.text}</span>
                                  </div>
                                </div>
                              ))} */}
                  </div>
                </div>
              </div>
            </div>
              )
            }
            <div className="mt-2 pl-2">
              {(item?.comments || []).map((c, i) => {
                const key = `${item.id}-${i}`;
                return (
                  <div className="mb-2" key={i}>
                    <div className="flex">
                      <div className="w-8 h-8 rounded-full overflow-hidden mr-2 mt-2">
                        <img
                    src={process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + c?.client?.image}
                    className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2 rounded-lg flex-grow">
                        <div className="flex flex-col bg-gray-100 p-2 rounded-md">
                          <span className="font-medium">
                            {c.user}{" "}
                            <span className="text-xs text-gray-500 ml-2">
                              {moment(c.created_at)?.fromNow()}
                            </span>
                          </span>
                          <span className="text-gray-700 text-sm">
                            {c.content}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex gap-2">
                          <button
                            className="text-gray-500"
                            onClick={() => handleCommentLike(item.id, i)}
                            type="button"
                          >
                            Like ({commentLikes[key] || 0})
                          </button>
                          <span>•</span>
                          <button
                            className="text-gray-500"
                            onClick={() =>
                              setReplyInputs((prev) => ({
                                ...prev,
                                [key]: prev[key] === undefined ? "" : prev[key],
                              }))
                            }
                            type="button"
                          >
                            Reply
                          </button>
                        </div>
                        {/* Reply input */}
                        {replyInputs[key] !== undefined && (
                          <div className="flex mt-2">
                            <input
                              type="text"
                              className="w-full focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-100 rounded-full px-2 py-1 text-xs"
                              placeholder="Write a reply..."
                              value={replyInputs[key]}
                              onChange={(e) =>
                                setReplyInputs((prev) => ({
                                  ...prev,
                                  [key]: e.target.value,
                                }))
                              }
                            />
                            <button
                              className="ml-2 text-blue-500 text-xs"
                              onClick={() => handleReplySubmit(item.id, i)}
                              type="button"
                            >
                              Send
                            </button>
                          </div>
                        )}
                        {/* Replies */}
                        {(commentReplies[key] || []).map((reply, ri) => (
                          <div className="flex mt-2 ml-8" key={ri}>
                            <div className="w-6 h-6 rounded-full overflow-hidden mr-2 mt-1">
                              <img
                                src="/common-avator.jpg"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="bg-gray-50 p-2 rounded-md flex flex-col">
                              <span className="font-medium text-xs">
                                {reply.user}{" "}
                                <span className="text-gray-400 ml-1">
                                  just now
                                </span>
                              </span>
                              <span className="text-gray-700 text-xs">
                                {reply.text}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

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
            <div className="flex items-center justify-between p-6 pb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={process.env.NEXT_PUBLIC_FILE_PATH + basicPostData?.image}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-semibold">
                    {basicPostData.client?.fname}{" "}
                    {basicPostData.client?.last_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {moment(basicPostData.created_at).fromNow()}
                  </div>
                </div>
              </div>
              <button
                className="text-2xl text-gray-400 hover:text-gray-700 ml-2"
                onClick={() => setShowCommentsModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto flex-1 px-6 pt-4 pb-2">
              {/* Post message */}
              <div className="text-gray-800 mb-4 break-words">
                {basicPostData.message}
              </div>
              {/* Post images if any */}
              {basicPostData.files && basicPostData.files.length > 0 && (
                <div className="rounded-lg overflow-hidden border bg-white mb-4">
                  <img
                    src={
                      process.env.NEXT_PUBLIC_FILE_PATH +
                      "/" +
                      basicPostData.files[0].file_path
                    }
                    alt="Post image"
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
              {/* Comments Section */}
              <h4 className="font-semibold mb-4 text-lg border-t">Comments</h4>
              {basicPostData.comments && basicPostData.comments.length > 0 ? (
                basicPostData?.comments?.map((c, i) => (
                  <div key={i} className="mb-4 flex items-start">
                    <div className="w-9 h-9 rounded-full overflow-hidden mr-3">
                      <img
                    src={process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + c?.client?.image}
                    className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 p-3 rounded-2xl">
                        <div className="font-medium text-sm">
                          {c?.client_comment?.fname +
                            " " +
                            c?.client_comment?.last_name}{" "}
                          <span className="text-xs text-gray-500 ml-2">
                            {moment(c.created_at).fromNow()}
                          </span>
                        </div>
                        <div className="text-gray-700 text-sm mt-1">
                          {c.content}
                        </div>
                      </div>
                      {/* Like and Reply buttons */}
                      <div className="flex gap-3 mt-2 text-xs text-gray-500">
                        <button
                          className="hover:underline"
                          onClick={() => handleModalCommentLike(i)}
                          type="button"
                        >
                          Like ({modalCommentLikes[i] || 0})
                        </button>
                        <button
                          className="hover:underline"
                          onClick={() =>
                            setModalReplyInputs((prev) => ({
                              ...prev,
                              [i]: prev[i] === undefined ? "" : prev[i],
                            }))
                          }
                          type="button"
                        >
                          Reply
                        </button>
                      </div>
                      {/* Reply input */}
                      {modalReplyInputs[i] !== undefined && (
                        <div className="flex mt-2">
                          <input
                            type="text"
                            className="w-full focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-100 rounded-full px-2 py-1 text-xs"
                            placeholder="Write a reply..."
                            value={modalReplyInputs[i]}
                            onChange={(e) =>
                              setModalReplyInputs((prev) => ({
                                ...prev,
                                [i]: e.target.value,
                              }))
                            }
                          />
                          <button
                            className="ml-2 text-blue-500 text-xs"
                            onClick={() => handleModalReplySubmit(i)}
                            type="button"
                          >
                            Send
                          </button>
                        </div>
                      )}
                      {/* Replies */}
                      {(modalReplies[i] || []).map((reply, ri) => (
                        <div className="flex mt-2 ml-8" key={ri}>
                          <div className="w-6 h-6 rounded-full overflow-hidden mr-2 mt-1">
                            <img
                              src="/common-avator.jpg"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="bg-gray-50 w-full p-2 rounded-md flex flex-col">
                            <span className="font-medium text-xs">
                              {reply.user}{" "}
                              <span className="text-gray-400 ml-1">
                                just now
                              </span>
                            </span>
                            <span className="text-gray-700 text-xs">
                              {reply.text}
                            </span>
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
                    src={process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + basicPostData?.image}
                    className="w-full h-full object-cover"
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

    </div>
  );
};

export default PostList;
