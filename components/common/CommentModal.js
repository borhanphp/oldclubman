"use client";

import React from "react";
import moment from "moment";
import Link from "next/link";
import { FaGlobeAmericas, FaLock } from "react-icons/fa";
import { SlLike } from "react-icons/sl";
import { IoMdShareAlt } from "react-icons/io";
import { FaRegComment } from "react-icons/fa6";

const CommentModal = ({
  isOpen,
  onClose,
  basicPostData,
  renderContentWithMentions,
  showingReactionsIcon,
  likingReactions,
  reactionsImages,
  showReactionsFor,
  setShowReactionsFor,
  handleDeleteReaction,
  handleShare,
  handleImagePreview,
  formatCompactTime,
  handleModalCommentLike,
  showCommentReactionsFor,
  setShowCommentReactionsFor,
  commentReactionRef,
  handleCommentReaction,
  handleReplyToReply,
  modalReplyInputs,
  setModalReplyInputs,
  inputRefs,
  handleMentionDetect,
  handleMentionKeyDown,
  handleReplyToReplySubmit,
  mentionOpenFor,
  mentionOptions,
  mentionActiveIndex,
  insertMentionToken,
  handleViewAllReplies,
  loadingReplies,
  modalReplies,
  renderReplies,
  profile,
  commentInputs,
  setCommentInputs,
  handleCommentSubmit,
}) => {
  if (!isOpen || !basicPostData) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
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
              onClick={onClose}
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
                href={`/${basicPostData?.client?.id}`}
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
                  moment(basicPostData.created_at).format("HH:MM A")} {" "}
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
          {/\/post_background\/.+/.test(basicPostData?.background_url) ? 
          <>
            <div 
            className="relative text-white p-4 text-center text-[40px] w-full min-h-[300px] rounded-lg flex items-center justify-center bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${basicPostData?.background_url})`,
            }}
          >
          
            {basicPostData?.message}
            
           
          </div>
          </>
          :  
          <div className="text-gray-800 mb-4 break-words">
            {renderContentWithMentions(basicPostData.message)}
          </div>
          }
         
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
                        showingReactionsIcon(reaction, index)
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
                  onMouseEnter={() =>
                    setShowReactionsFor(
                      showReactionsFor === basicPostData.id ? null : basicPostData.id
                    )
                  }
                  onMouseLeave={(e) => {
                    // Check if the mouse is moving to the reactions area
                    const relatedTarget = e.relatedTarget;
                    if (relatedTarget && relatedTarget.closest('.reactions-container')) {
                      return; // Don't hide if moving to reactions
                    }
                    setShowReactionsFor(null);
                  }}
                  onClick={() => {
                    if (basicPostData.single_reaction) {
                      handleDeleteReaction(basicPostData.id);
                    }
                  }}
                >
                  <div className="flex items-center justify-center gap-2">
                    {!basicPostData.single_reaction ? (
                      <>
                        <SlLike /> <span>Like</span>
                      </>
                    ) : (
                      <span className="inline-block">
                        {likingReactions(basicPostData?.single_reaction)}
                      </span>
                    )}
                  </div>
                </button>
                {showReactionsFor === basicPostData.id && (
                   <div 
                   className="reactions-container"
                   onMouseEnter={() => setShowReactionsFor(basicPostData.id)}
                   onMouseLeave={() => setShowReactionsFor(null)}
                 >
                   {reactionsImages(basicPostData)}
                 </div>
                )}
              </div>
            </div>
            <button 
             onClick={() => {handleShare(basicPostData?.id)}}
            className="flex-1 py-1 cursor-pointer text-center text-gray-500 hover:bg-gray-100 rounded-md">
              <div className="flex items-center justify-center gap-2">
                <IoMdShareAlt /> <span>Share</span>
              </div>
            </button>
          </div>

          {/* Comments Section */}
          <h4 className="font-semibold mb-4 text-lg">Comments</h4>
          {basicPostData?.comments &&
          basicPostData?.comments?.length > 0 ? (
            basicPostData?.comments?.map((c, i) => (
              <div key={i} className="mb-4 flex items-start">
                <div className="relative mr-3">
                  <div className="w-9 h-9 rounded-full overflow-hidden">
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
                  <div className="absolute left-[18px] top-[36px] bottom-0 w-px bg-gray-200"></div>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 p-3 rounded-2xl relative border border-gray-200">
                    <div className="font-medium text-sm">
                      <Link
                        href={`/${c?.client_id}`}
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
                      {renderContentWithMentions(c.content)}
                    </div>
                    {c?.reactions?.length > 0 && (
                      <div className="absolute -bottom-2 right-3 flex items-center gap-1 bg-white rounded-full px-1.5 py-0.5 shadow-sm border border-gray-200">
                        <div className="flex -space-x-1">
                          {c.reactions.slice(0, 2).map((reaction, idx) => (
                            <span key={idx} className="inline-flex">{showingReactionsIcon(reaction, idx)}</span>
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-600">{c.reactions.length}</span>
                      </div>
                    )}
                  </div>
                  {/* Actions row */}
                  <div className="flex items-center gap-2 ml-2 text-[12px] text-gray-600">
                    <span>{formatCompactTime(c.created_at)}</span>
                    <span>•</span>
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
                    <span>•</span>
                    <button
                      className="hover:underline cursor-pointer"
                      onClick={() => handleReplyToReply(i, c.id)}
                      type="button"
                    >
                      Reply
                    </button>
                    <span>•</span>
                    <button className="hover:underline cursor-pointer" type="button">
                      See translation
                    </button>
                  </div>
                  {/* Reply input */}
                  {modalReplyInputs[`reply-${i}-${c.id}`] !== undefined && (
                    <div className="flex mt-2 relative">
                      <input
                        type="text"
                        className="w-full focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-100 rounded-full px-2 py-1 text-xs"
                        placeholder={`Reply to ${c?.client_comment?.fname || ""}`}
                        value={modalReplyInputs[`reply-${i}-${c.id}`] || ""}
                        ref={(el) => (inputRefs.current[`reply-${i}-${c.id}`] = el)}
                        onChange={(e) =>
                          { setModalReplyInputs((prev) => ({
                              ...prev,
                              [`reply-${i}-${c.id}`]: e.target.value,
                            }));
                            handleMentionDetect(e, `reply-${i}-${c.id}`);
                          }
                        }
                        onKeyDown={(e) => {
                          const handled = handleMentionKeyDown(e, `reply-${i}-${c.id}`);
                          if (!handled && e.key === 'Enter') {
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
                      {mentionOpenFor === `reply-${i}-${c.id}` && mentionOptions.length > 0 && (
                        <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-50 max-h-56 overflow-auto">
                          {mentionOptions.map((u, idx) => (
                            <div
                              key={u.id}
                              className={`flex items-center gap-2 px-2 py-1 cursor-pointer ${idx === mentionActiveIndex ? 'bg-gray-100' : ''}`}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                insertMentionToken(u, `reply-${i}-${c.id}`);
                              }}
                            >
                              <img src={u.avatar} className="w-5 h-5 rounded-full object-cover" />
                              <span className="text-xs">{u.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
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

                  {/* Display replies (filter out replies that are children to avoid duplication) */}
                  {(() => {
                    const repliesForComment = modalReplies[i] || [];
                    const childIds = new Set();
                    repliesForComment.forEach(r => (r?.children || []).forEach(ch => ch?.id && childIds.add(ch.id)));
                    const topLevelReplies = repliesForComment.filter(r => !childIds.has(r?.id));
                    return topLevelReplies;
                  })()?.map((reply, ri) => (
                    <div className="relative flex mt-2 ml-8" key={ri}>
                      <div className="absolute -left-3 top-0 bottom-0 w-px bg-gray-200"></div>
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
                        <div className="bg-gray-50 w-full p-2 rounded-2xl border border-gray-200 flex flex-col">
                          <span className="font-medium text-xs">
                            <Link
                              href={`/${reply?.client_id}`}
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
                            {renderContentWithMentions(reply.content || reply.text)}
                          </span>
                        </div>
                        
                        {/* Reply actions row */}
                        <div className="flex items-center gap-2 mt-1 ml-2 text-[12px] text-gray-600">
                          <span>{formatCompactTime(reply.created_at)}</span>
                          <span>•</span>
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
                          <span>•</span>
                          <button
                            className="hover:underline cursor-pointer"
                            onClick={() => handleReplyToReply(i, reply)}
                            type="button"
                          >
                            Reply
                          </button>
                          <span>•</span>
                          <button className="hover:underline cursor-pointer" type="button">
                            See translation
                          </button>
                        </div>
                        {/* Reply-to-reply input box */}
                        {modalReplyInputs[`reply-${i}-${reply.id}`] !== undefined && (
                          <div className="flex mt-2 ml-6 relative">
                            <input
                              type="text"
                              className="w-full focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-100 rounded-full px-2 py-1 text-xs"
                              placeholder={`Reply to ${reply?.client_comment?.fname || ""}`}
                              value={modalReplyInputs[`reply-${i}-${reply.id}`] || ""}
                              ref={(el) => (inputRefs.current[`reply-${i}-${reply.id}`] = el)}
                              onChange={(e) => {
                                setModalReplyInputs((prev) => ({
                                  ...prev,
                                  [`reply-${i}-${reply.id}`]: e.target.value,
                                }));
                                handleMentionDetect(e, `reply-${i}-${reply.id}`);
                              }}
                              onKeyDown={(e) => {
                                const handled = handleMentionKeyDown(e, `reply-${i}-${reply.id}`);
                                if (!handled && e.key === 'Enter') {
                                  e.preventDefault();
                                  handleReplyToReplySubmit(i, reply.id);
                                }
                              }}
                            />
                            <button
                              className="ml-2 text-blue-500 text-xs cursor-pointer"
                              onClick={() => handleReplyToReplySubmit(i, reply.id)}
                              type="button"
                            >
                              Send
                            </button>
                            {mentionOpenFor === `reply-${i}-${reply.id}` && mentionOptions.length > 0 && (
                              <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-50 max-h-56 overflow-auto">
                                {mentionOptions.map((u, idx) => (
                                  <div
                                    key={u.id}
                                    className={`flex items-center gap-2 px-2 py-1 cursor-pointer ${idx === mentionActiveIndex ? 'bg-gray-100' : ''}`}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                      insertMentionToken(u, `reply-${i}-${reply.id}`);
                                    }}
                                  >
                                    <img src={u.avatar} className="w-5 h-5 rounded-full object-cover" />
                                    <span className="text-xs">{u.name}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        {/* children replies */}
                        {renderReplies(reply?.children || reply?.chidren || [], i, 2)}
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
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentInputs[basicPostData.id] || ""}
              ref={(el) => (inputRefs.current[`modal-comment-${basicPostData.id}`] = el)}
              onChange={(e) => {
                setCommentInputs({
                  ...commentInputs,
                  [basicPostData.id]: e.target.value,
                });
                handleMentionDetect(e, `modal-comment-${basicPostData.id}`);
              }}
              onKeyDown={(e) => {
                const handled = handleMentionKeyDown(e, `modal-comment-${basicPostData.id}`);
                if (!handled && e.key === 'Enter') {
                  e.preventDefault();
                  handleCommentSubmit(basicPostData.id);
                }
              }}
              className="w-full border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />
            {mentionOpenFor === `modal-comment-${basicPostData.id}` && mentionOptions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-50 max-h-56 overflow-auto">
                {mentionOptions.map((u, idx) => (
                  <div
                    key={u.id}
                    className={`flex items-center gap-2 px-2 py-1 cursor-pointer ${idx === mentionActiveIndex ? 'bg-gray-100' : ''}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      insertMentionToken(u, `modal-comment-${basicPostData.id}`);
                    }}
                  >
                    <img src={u.avatar} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-sm">{u.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => handleCommentSubmit(basicPostData.id)}
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;


