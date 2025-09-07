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
  deletePostReaction,
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
import { getMyProfile, getUserProfile, getAllFollowers } from "@/views/settings/store";
import toast from "react-hot-toast";
import Image from "next/image";
import CommentThread from "./CommentThread";

const PostList = ({ postsData }) => {
  const { basicPostData } = useSelector(({ gathering }) => gathering);
  const { profile, myFollowers } = useSelector(({ settings }) => settings);
  const dispatch = useDispatch();
  const params = useParams();
  useEffect(() => {
    dispatch(getGathering());
    dispatch(getPosts(1));
    dispatch(getAllFollowers());
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
  // Track selected images for each reply input in modal (keyed by inputKey)
  const [modalReplyImages, setModalReplyImages] = useState({});
  const [modalReplies, setModalReplies] = useState({});
  const [loadingReplies, setLoadingReplies] = useState({});
  const [showShareModal, setShowShareModal] = useState(false);
  const [postToShare, setPostToShare] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(null); // stores the input key for which emoji picker is open
  const [activeEmojiCategory, setActiveEmojiCategory] = useState('smileys');

  // Emoji categories and data
  const emojiCategories = {
    smileys: {
      name: 'Smileys & People',
      emojis: ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '☺️', '🙂', '🤗', '🤩', '🤔', '🫡', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '🥱', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🫠', '🤑', '😲', '☹️', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '🥴', '😠', '😡', '🤬', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😇', '🥳', '🥺', '🤠', '🤡', '🤥', '🤫', '🤭', '🧐', '🤓', '😈', '👿', '👹', '👺', '💀', '👻', '👽', '🤖', '💩']
    },
    animals: {
      name: 'Animals & Nature',
      emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦫']
    },
    food: {
      name: 'Food & Drink',
      emojis: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜', '🍯']
    },
    activities: {
      name: 'Activities',
      emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️‍♀️', '🏋️', '🏋️‍♂️', '🤼‍♀️', '🤼', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️', '⛹️', '⛹️‍♂️', '🤺', '🤾‍♀️', '🤾', '🤾‍♂️', '🏌️‍♀️', '🏌️', '🏌️‍♂️', '🏇', '🧘‍♀️', '🧘', '🧘‍♂️', '🏄‍♀️', '🏄', '🏄‍♂️', '🏊‍♀️', '🏊', '🏊‍♂️', '🤽‍♀️', '🤽', '🤽‍♂️', '🚣‍♀️', '🚣', '🚣‍♂️', '🧗‍♀️', '🧗', '🧗‍♂️', '🚵‍♀️', '🚵', '🚵‍♂️', '🚴‍♀️', '🚴', '🚴‍♂️', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️']
    },
    objects: {
      name: 'Objects',
      emojis: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⏳', '⌛', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '🪙', '💰', '💳', '💎', '⚖️', '🪜', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🪚', '🔫', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '🪦', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🪠', '🧽', '🧴', '🧷', '🧼', '🪥', '🪒', '🧻', '🚽', '🚿', '🛁', '🪤', '🪣', '🔑', '🗝️']
    },
    symbols: {
      name: 'Symbols',
      emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '💮', '🉐', '㊙️', '㊗️', '🈴', '🈵', '🈹', '🈲', '🅰️', '🅱️', '🆎', '🆑', '🅾️', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼️', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠']
    }
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji, inputKey) => {
    if (inputKey.startsWith("reply-")) {
      const currentValue = modalReplyInputs[inputKey] || '';
      setModalReplyInputs(prev => ({
        ...prev,
        [inputKey]: currentValue + emoji
      }));
    } else {
      const parts = inputKey.split("-");
      const postId = parts[parts.length - 1];
      const currentValue = commentInputs[postId] || '';
      setCommentInputs(prev => ({
        ...prev,
        [postId]: currentValue + emoji
      }));
    }
    setShowEmojiPicker(null); // Close emoji picker
  };

  // Handle emoji picker toggle
  const toggleEmojiPicker = (inputKey) => {
    setShowEmojiPicker(showEmojiPicker === inputKey ? null : inputKey);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showEmojiPicker && !event.target.closest('.emoji-picker-container')) {
        setShowEmojiPicker(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  

  const handleCommentSubmit = (postId) => {
    const inputKey = `modal-comment-${postId}`;
    const comment = commentInputs[postId];
    const images = modalReplyImages[inputKey] || [];
    const hasImage = Array.isArray(images) && images.length > 0;
    if (!comment && !hasImage) return;

    let payload;
    if (hasImage) {
      const fd = new FormData();
      fd.append("post_id", postId);
      if (comment) fd.append("content", comment);
      images.forEach((img, idx) => {
        if (img?.file) fd.append(`files[${idx}]`, img.file);
      });
      payload = fd;
    } else {
      payload = { post_id: postId, content: comment };
    }

    dispatch(storeComments(payload)).then(() => {
      dispatch(getGathering());
      dispatch(getPosts());
      dispatch(getPostById(postId));

      // Clear input and any attached images
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      setModalReplyImages((prev) => {
        const copy = { ...prev };
        const arr = copy[inputKey] || [];
        arr.forEach((img) => { if (img?.previewUrl) URL.revokeObjectURL(img.previewUrl); });
        delete copy[inputKey];
        return copy;
      });
      const ref = fileInputRefs.current[inputKey];
      if (ref) ref.value = "";
    });
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

  const handleDeleteReaction = (postId) => {
    dispatch(deletePostReaction(postId)).then(() => {
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

  // Mention system (modal only)
  const [mentionOpenFor, setMentionOpenFor] = useState(null); // key of active input
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionOptions, setMentionOptions] = useState([]);
  const [mentionActiveIndex, setMentionActiveIndex] = useState(0);
  const inputRefs = useRef({});
  const fileInputRefs = useRef({});
  const mentionMetaRef = useRef({}); // { [inputKey]: { anchor: number } }

  const buildMentionCandidates = (query = "") => {
    // If myFollowers is empty, use dummy data for testing
    const followers = myFollowers && myFollowers.length > 0 ? myFollowers : [
      {
        follower_client: {
          id: 1,
          fname: "John",
          last_name: "Doe",
          image: null
        }
      },
      {
        follower_client: {
          id: 2,
          fname: "Jane",
          last_name: "Smith",
          image: null
        }
      }
    ];

    const list = followers.map((f) => ({
      id: f?.follower_client?.id,
      name: `${f?.follower_client?.fname || ""} ${f?.follower_client?.last_name || ""}`.trim(),
      avatar: f?.follower_client?.image
        ? `${process.env.NEXT_PUBLIC_CLIENT_FILE_PATH}/${f?.follower_client?.image}`
        : "/common-avator.jpg",
    }));
    
    const q = query.toLowerCase();
    const filtered = list.filter((u) => u.id && u.name && (!q || u.name.toLowerCase().includes(q)));
    console.log('Built candidates:', { query, list, filtered });
    
    return filtered.slice(0, 8);
  };

  const getInputValueByKey = (inputKey) => {
    if (inputKey.startsWith("reply-")) {
      return modalReplyInputs[inputKey] || "";
    }
    if (inputKey.startsWith("modal-comment-") || inputKey.startsWith("post-comment-")) {
      const parts = inputKey.split("-");
      const postId = parts[parts.length - 1];
      return commentInputs[postId] || "";
    }
    const parts = inputKey.split("-");
    const postId = parts[parts.length - 1];
    return commentInputs[postId] || "";
  };

  const setInputValueByKey = (inputKey, value) => {
    if (inputKey.startsWith("reply-")) {
      setModalReplyInputs((prev) => ({ ...prev, [inputKey]: value }));
      return;
    }
    if (inputKey.startsWith("modal-comment-") || inputKey.startsWith("post-comment-")) {
      const parts = inputKey.split("-");
      const postId = parts[parts.length - 1];
      setCommentInputs((prev) => ({ ...prev, [postId]: value }));
      return;
    }
    const parts = inputKey.split("-");
    const postId = parts[parts.length - 1];
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  const handleMentionDetect = (e, inputKey) => {
    const value = e.target.value;
    const caret = e.target.selectionStart || value.length;
    const before = value.slice(0, caret);
    const match = before.match(/@([a-zA-Z0-9_.\- ]*)$/);
    
    console.log('Mention detect:', { value, before, match, inputKey, myFollowers: myFollowers?.length });
    
    if (match) {
      const q = match[1];
      const candidates = buildMentionCandidates(q);
      console.log('Mention candidates:', candidates);
      
      mentionMetaRef.current[inputKey] = { anchor: caret - match[0].length };
      setMentionOptions(candidates);
      setMentionQuery(q);
      setMentionActiveIndex(0);
      setMentionOpenFor(inputKey);
    } else if (mentionOpenFor === inputKey) {
      setMentionOpenFor(null);
      setMentionQuery("");
      setMentionOptions([]);
    }
  };

  const insertMentionToken = (user, inputKey) => {
    const value = getInputValueByKey(inputKey);
    const input = inputRefs.current[inputKey];
    const caret = input?.selectionStart ?? value.length;
    const meta = mentionMetaRef.current[inputKey] || { anchor: value.lastIndexOf("@") };
    const before = value.slice(0, meta.anchor);
    const after = value.slice(caret);
    const token = `@[${user.name}](${user.id}) `;
    const newValue = before + token + after;
    setInputValueByKey(inputKey, newValue);
    setMentionOpenFor(null);
    setMentionQuery("");
    setMentionOptions([]);
    setMentionActiveIndex(0);
    setTimeout(() => {
      if (input) {
        const newCaret = (before + token).length;
        input.focus();
        input.setSelectionRange(newCaret, newCaret);
      }
    }, 0);
  };

  const handleMentionKeyDown = (e, inputKey) => {
    if (mentionOpenFor !== inputKey || mentionOptions.length === 0) return false;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setMentionActiveIndex((idx) => (idx + 1) % mentionOptions.length);
      return true;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setMentionActiveIndex((idx) => (idx - 1 + mentionOptions.length) % mentionOptions.length);
      return true;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const chosen = mentionOptions[mentionActiveIndex];
      if (chosen) insertMentionToken(chosen, inputKey);
      return true;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setMentionOpenFor(null);
      return true;
    }
    return false;
  };

  // Render content with @[Name](id)
  const renderContentWithMentions = (text) => {
    if (!text) return null;
    const regex = /@\[(.+?)\]\((\d+)\)/g;
    const elements = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const start = match.index;
      const [full, name, id] = match;
      if (start > lastIndex) {
        elements.push(text.slice(lastIndex, start));
      }
      elements.push(
        <Link href={`/user/user-profile/${id}`} className="text-black hover:underline font-semibold" key={`m-${start}`}>
          {name}
        </Link>
      );
      lastIndex = start + full.length;
    }
    if (lastIndex < text.length) {
      elements.push(text.slice(lastIndex));
    }
    return elements;
  };

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
    const inputKey = `${commentIndex}`;
    const reply = modalReplyInputs[inputKey];
    const hasImage = Array.isArray(modalReplyImages[inputKey]) && modalReplyImages[inputKey].length > 0;
    if (!reply && !hasImage) return;

    // Get the comment object from basicPostData
    const comment = basicPostData?.comments?.[commentIndex];

    // Build payload; use FormData when image present
    let payload;
    if (hasImage) {
      const fd = new FormData();
      fd.append("comment_id", comment.id);
      fd.append("parent_id", "null");
      if (reply) fd.append("content", reply);
      (modalReplyImages[inputKey] || []).forEach((img, idx) => {
        if (img?.file) fd.append(`files[${idx}]`, img.file);
      });
      payload = fd;
    } else {
      payload = { comment_id: comment.id, parent_id: "null", content: reply };
    }

    // Call API to save reply
    dispatch(replyToComment(payload))
      .then(() => {
        dispatch(getPostById(basicPostData.id));
        setModalReplyInputs((prev) => ({ ...prev, [inputKey]: "" }));
        setModalReplyImages((prev) => {
          const copy = { ...prev };
          const arr = copy[inputKey] || [];
          arr.forEach((img) => { if (img?.previewUrl) URL.revokeObjectURL(img.previewUrl); });
          delete copy[inputKey];
          return copy;
        });
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

  // Render reply tree recursively under a comment
  const renderReplies = (replies, commentIndex, level = 1, parentFirstReplyId = null) => {
    if (!Array.isArray(replies) || replies.length === 0) return null;
    return replies.map((reply, ri) => (
      <div className="relative flex mt-2" style={{ marginLeft: `${level * 16}px` }} key={`${reply?.id || ri}-${level}`}>
        <div className="w-6 h-6 rounded-full overflow-hidden mr-2 mt-1">
          <img
            src={
              (reply?.client_comment?.image && `${process.env.NEXT_PUBLIC_CLIENT_FILE_PATH}${reply?.client_comment?.image?.startsWith('/') ? '' : '/'}${reply?.client_comment?.image}`) || "/common-avator.jpg"
            }
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/common-avator.jpg";
            }}
          />
        </div>
        {/* <div className="absolute border -left-13 top-[14px] w-10 h-px bg-gray-200"></div> */}

        <div className="flex flex-col w-full">
          <div className="bg-gray-50 w-full p-2 rounded-md flex flex-col">
            <span className="font-medium text-xs">
              <Link href={`/user/user-profile/${reply?.client_id}`} className="cursor-pointer hover:underline">
                {`${reply?.client_comment?.fname || ""} ${reply?.client_comment?.last_name || ""}`.trim() || reply?.user}
              </Link>
              <span className="text-gray-400 ml-1">
                {reply?.created_at ? formatCompactTime(reply.created_at) : "0s"}
              </span>
            </span>
            <span className="text-gray-700 text-xs">
              {renderContentWithMentions(reply?.content)}
              {reply?.files?.length > 0 ? (
                <img 
                  src={process.env.NEXT_PUBLIC_FILE_PATH + "/reply/" + reply?.files[0]?.file_path}
                  width={100}
                  height={100}
                  className="mt-2"
                  />

                ) : ""}
            </span>
          </div>

          <div className="flex gap-3 mt-1 ml-2 text-xs text-gray-500">
            <div>{formatCompactTime(reply?.created_at)}</div>
            <button
              className="hover:underline relative cursor-pointer"
              onClick={() =>
                setShowCommentReactionsFor(showCommentReactionsFor === reply.id ? null : reply.id)
              }
              type="button"
            >
              {!reply?.single_reaction ? (
                <span>Like</span>
              ) : (
                <span className="inline-block">
                  {reply?.single_reaction?.type === "like" && (
                    <span className="font-semibold">
                      <span className="text-blue-500 text-[12px]">Like</span>
                    </span>
                  )}
                  {reply?.single_reaction?.type === "love" && (
                    <span className="font-semibold">
                      <span className="text-red-700 text-[12px]">Love</span>
                    </span>
                  )}
                  {reply?.single_reaction?.type === "care" && (
                    <span className="font-semibold">
                      <span className="text-yellow-700 text-[12px]">Care</span>
                    </span>
                  )}
                  {reply?.single_reaction?.type === "haha" && (
                    <span className="font-semibold">
                      <span className="text-yellow-700 text-[12px]">Haha</span>
                    </span>
                  )}
                  {reply?.single_reaction?.type === "wow" && (
                    <span className="font-semibold">
                      <span className="text-yellow-700 text-[12px]">Wow</span>
                    </span>
                  )}
                  {reply?.single_reaction?.type === "sad" && (
                    <span className="font-semibold">
                      <span className="text-yellow-700 text-[12px]">Sad</span>
                    </span>
                  )}
                  {reply?.single_reaction?.type === "angry" && (
                    <span className="font-semibold">
                      <span className="text-red-500 text-[12px]">Angry</span>
                    </span>
                  )}
                </span>
              )}
              {showCommentReactionsFor === reply.id && (
                <div ref={commentReactionRef} className="absolute bottom-full w-50 bg-white p-2 rounded-full shadow-lg flex space-x-2 z-10">
                  <img src="/like.png" alt="Like" className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer" onClick={(e) => { e.stopPropagation(); handleReplyReaction(reply.id, "like", reply.comment_id, commentIndex); }} />
                  <img src="/love.png" alt="Love" className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer" onClick={(e) => { e.stopPropagation(); handleReplyReaction(reply.id, "love", reply.comment_id, commentIndex); }} />
                  <img src="/care.png" alt="Care" className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer" onClick={(e) => { e.stopPropagation(); handleReplyReaction(reply.id, "care", reply.comment_id, commentIndex); }} />
                  <img src="/haha.png" alt="Haha" className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer" onClick={(e) => { e.stopPropagation(); handleReplyReaction(reply.id, "haha", reply.comment_id, commentIndex); }} />
                  <img src="/wow.png" alt="Wow" className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer" onClick={(e) => { e.stopPropagation(); handleReplyReaction(reply.id, "wow", reply.comment_id, commentIndex); }} />
                  <img src="/sad.png" alt="Sad" className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer" onClick={(e) => { e.stopPropagation(); handleReplyReaction(reply.id, "sad", reply.comment_id, commentIndex); }} />
                  <img src="/angry.png" alt="Angry" className="w-5 h-5 bg-white transform hover:scale-125 transition-transform cursor-pointer" onClick={(e) => { e.stopPropagation(); handleReplyReaction(reply.id, "angry", reply.comment_id, commentIndex); }} />
                </div>
              )}
            </button>

           
              <button className="hover:underline cursor-pointer" onClick={() => handleReplyToReply(commentIndex, reply, parentFirstReplyId || reply?.id)} type="button">
                Reply
              </button>
           
          </div>

          {/* input for replying to this reply - Facebook Style */}
          {modalReplyInputs[`reply-${commentIndex}-${reply.id}`] !== undefined && (
            <div className="flex items-start mt-3 ml-6">
              {/* User Avatar */}
              <img 
                src={ profile?.client?.image ? 
                  process.env.NEXT_PUBLIC_CLIENT_FILE_PATH +
                  profile?.client?.image : "/common-avator.jpg"
                }
                className="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0"
                alt="Your avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/common-avator.jpg";
                }}
              />
              
              {/* Input Container */}
              <div className="flex-1 bg-gray-100 rounded-2xl border border-gray-200 hover:bg-gray-50 focus-within:bg-white focus-within:border-blue-500 transition-all duration-200">
                <div className="flex items-center px-3 py-2">
                  <input
                    type="text"
                    className="flex-1 bg-transparent focus:outline-none text-sm placeholder-gray-500"
                    placeholder={`Reply to ${reply?.client_comment?.fname || ""}...`}
                    value={modalReplyInputs[`reply-${commentIndex}-${reply.id}`] || ""}
                    ref={(el) => (inputRefs.current[`reply-${commentIndex}-${reply.id}`] = el)}
                    onChange={(e) => { setModalReplyInputs((prev) => ({ ...prev, [`reply-${commentIndex}-${reply.id}`]: e.target.value })); handleMentionDetect(e, `reply-${commentIndex}-${reply.id}`); }}
                    onKeyDown={(e) => { const handled = handleMentionKeyDown(e, `reply-${commentIndex}-${reply.id}`); if (!handled && e.key === 'Enter') { e.preventDefault(); handleReplyToReplySubmit(commentIndex, reply.id); } }}
                  />
                  
                  {/* Facebook-style action buttons */}
                  <div className="flex items-center gap-1 ml-2 relative">
                    {/* Emoji button */}
                    <div className="relative">
                      <button
                        type="button"
                        className={`w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700 ${showEmojiPicker === `reply-${commentIndex}-${reply.id}` ? 'bg-blue-200' : ''}`}
                        title="Choose an emoji"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleEmojiPicker(`reply-${commentIndex}-${reply.id}`);
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zM5.5 6.5c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm5 0c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm1.5 4c-.4 1.2-1.5 2-2.8 2.1-.1 0-.1 0-.2 0-.1 0-.1 0-.2 0-1.3-.1-2.4-.9-2.8-2.1-.1-.3.1-.5.4-.5h4.8c.3 0 .5.2.4.5-.4z"/>
                        </svg>
                      </button>
                      
                      {/* Emoji Picker */}
                      {showEmojiPicker === `reply-${commentIndex}-${reply.id}` && (
                        <div className="emoji-picker-container absolute bottom-full right-0 mb-2 bg-white border rounded-lg shadow-xl z-50 w-80 max-h-96 overflow-hidden">
                          {/* Category tabs */}
                          <div className="flex border-b bg-gray-50 p-2 gap-1">
                            {Object.keys(emojiCategories).map((category) => (
                              <button
                                key={category}
                                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                  activeEmojiCategory === category 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                                onClick={() => setActiveEmojiCategory(category)}
                              >
                                {emojiCategories[category].name.split(' ')[0]}
                              </button>
                            ))}
                          </div>
                          
                          {/* Emoji grid */}
                          <div className="p-3 max-h-64 overflow-y-auto">
                            <div className="grid grid-cols-8 gap-1">
                              {emojiCategories[activeEmojiCategory].emojis.map((emoji, idx) => (
                                <button
                                  key={idx}
                                  className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                  onClick={() => handleEmojiSelect(emoji, `reply-${commentIndex}-${reply.id}`)}
                                  title={emoji}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                  
                    
                    {/* GIF button */}
                    <button
                      type="button"
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                      title="Choose a GIF"
                    >
                      <span className="text-xs font-bold">GIF</span>
                    </button>
                    
                    {/* Camera/Photo button */}
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        ref={(el) => (fileInputRefs.current[`reply-${commentIndex}-${reply.id}`] = el)}
                        onChange={(e) => handleReplyImageChange(e, `reply-${commentIndex}-${reply.id}`)}
                      />
                      <button
                        type="button"
                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                        title="Attach a photo"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleReplyImageClick(`reply-${commentIndex}-${reply.id}`);
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M14.5 2h-13C.7 2 0 2.7 0 3.5v9c0 .8.7 1.5 1.5 1.5h13c.8 0 1.5-.7 1.5-1.5v-9c0-.8-.7-1.5-1.5-1.5zM5 4.5c.8 0 1.5.7 1.5 1.5S5.8 7.5 5 7.5 3.5 6.8 3.5 6 4.2 4.5 5 4.5zM13 12H3l2.5-3 1.5 2 3-4 3 5z"/>
                        </svg>
                      </button>
                    </>

                    {/* Sticker button */}
                    <button
                      type="button"
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                      title="Choose a sticker"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 1.5c-3.6 0-6.5 2.9-6.5 6.5 0 1.4.4 2.7 1.2 3.8l-.9 2.6c-.1.2 0 .4.2.5.1 0 .2.1.3.1.1 0 .2 0 .2-.1l2.6-.9c1.1.8 2.4 1.2 3.9 1.2 3.6 0 6.5-2.9 6.5-6.5S11.6 1.5 8 1.5zm-2 5.5c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm4 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1 3c-.3.8-1 1.4-1.8 1.7-.2.1-.4 0-.5-.2-.1-.2 0-.4.2-.5.6-.2 1.1-.6 1.3-1.2.1-.2.3-.3.5-.2s.3.3.3.4z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Selected image previews (reply to reply) under input */}
                {Array.isArray(modalReplyImages[`reply-${commentIndex}-${reply.id}`]) && modalReplyImages[`reply-${commentIndex}-${reply.id}`].length > 0 && (
                  <div className="px-3 pb-2">
                    <div className="flex flex-wrap gap-2">
                      {modalReplyImages[`reply-${commentIndex}-${reply.id}`].map((img, idx) => (
                        <div key={img.id || idx} className="inline-flex items-center gap-2 bg-white rounded-md border p-1">
                          <img
                            src={img.previewUrl}
                            className="w-12 h-12 object-cover rounded"
                            alt="preview"
                          />
                          <button
                            type="button"
                            className="text-xs text-red-600 hover:underline"
                            onClick={() => clearReplyImage(`reply-${commentIndex}-${reply.id}`, idx)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mention dropdown */}
                {mentionOpenFor === `reply-${commentIndex}-${reply.id}` && mentionOptions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-50 max-h-56 overflow-auto">
                    {mentionOptions.map((u, idx) => (
                      <div
                        key={u.id}
                        className={`flex items-center gap-2 px-2 py-1 cursor-pointer ${idx === mentionActiveIndex ? 'bg-gray-100' : ''}`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          insertMentionToken(u, `reply-${commentIndex}-${reply.id}`);
                        }}
                      >
                        <img src={u.avatar} className="w-5 h-5 rounded-full object-cover" />
                        <span className="text-xs">{u.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Send button - show when there's text or image */}
              {(modalReplyInputs[`reply-${commentIndex}-${reply.id}`]?.trim() || (Array.isArray(modalReplyImages[`reply-${commentIndex}-${reply.id}`]) && modalReplyImages[`reply-${commentIndex}-${reply.id}`].length > 0)) && (
                <button
                  className="ml-2 w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                  onClick={() => handleReplyToReplySubmit(commentIndex, reply.id)}
                  type="button"
                  title="Send"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* children (only show one more layer: reply of reply); API may name it `children` or `chidren` */}
          {level < 2 && renderReplies(
            reply?.children || [],
            commentIndex,
            level + 1,
            parentFirstReplyId || reply?.id
          )}
        </div>
      </div>
    ));
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

  const handleReplyToReply = (commentIndex, replyOrId, firstLevelReplyId = null) => {
    const replyId = typeof replyOrId === 'object' ? replyOrId?.id : replyOrId;
    const inputKey = `reply-${commentIndex}-${replyId}`;
    // Pre-fill with @ mention token and focus
    let defaultValue = "";
    if (typeof replyOrId === 'object') {
      const name = `${replyOrId?.client_comment?.fname || ""} ${replyOrId?.client_comment?.last_name || ""}`.trim();
      const id = replyOrId?.client_id;
      if (name && id) {
        defaultValue = `@[${name}](${id}) `;
      } else if (name) {
        defaultValue = `@${name} `;
      }
    }
    // Keep only the targeted reply box open; close others
    setModalReplyInputs(prev => {
      const next = {};
      if (firstLevelReplyId) {
        next[`first-parent-${commentIndex}`] = firstLevelReplyId;
      } else if (prev[`first-parent-${commentIndex}`] !== undefined) {
        next[`first-parent-${commentIndex}`] = prev[`first-parent-${commentIndex}`];
      }
      next[inputKey] = prev[inputKey] === undefined ? defaultValue : prev[inputKey];
      return next;
    });
    // Also retain images only for the active reply input
    setModalReplyImages(prev => (prev && prev[inputKey] ? { [inputKey]: prev[inputKey] } : {}));
    setTimeout(() => {
      const el = inputRefs.current[inputKey];
      if (el) {
        el.focus();
        const caret = (el.value || '').length;
        el.setSelectionRange(caret, caret);
      }
    }, 0);
  };

  const handleReplyToReplySubmit = (commentIndex, replyId) => {
    const inputKey = `reply-${commentIndex}-${replyId}`;
    const reply = modalReplyInputs[inputKey];
    const hasImage = Array.isArray(modalReplyImages[inputKey]) && modalReplyImages[inputKey].length > 0;
    if (!reply && !hasImage) return;
    const comment = basicPostData?.comments?.[commentIndex];
    // If replying within a second-level thread, keep it as first-level reply-of-a-reply
    const firstParent = modalReplyInputs[`first-parent-${commentIndex}`];
    const parentId = firstParent || (replyId === comment.id ? null : replyId);
    // Build payload; use FormData when image present
    let payload;
    if (hasImage) {
      const fd = new FormData();
      fd.append("comment_id", comment.id);
      if (parentId !== null && parentId !== undefined) fd.append("parent_id", parentId);
      if (reply) fd.append("content", reply);
      (modalReplyImages[inputKey] || []).forEach((img, idx) => {
        if (img?.file) fd.append(`files[${idx}]`, img.file);
      });
      payload = fd;
    } else {
      payload = { comment_id: comment.id, parent_id: parentId, content: reply };
    }
    dispatch(replyToComment(payload))
      .then(() => {
        dispatch(getPostById(basicPostData.id));
        setModalReplyInputs(prev => ({ ...prev, [inputKey]: "" }));
        setModalReplyImages((prev) => {
          const copy = { ...prev };
          const arr = copy[inputKey] || [];
          arr.forEach((img) => { if (img?.previewUrl) URL.revokeObjectURL(img.previewUrl); });
          delete copy[inputKey];
          return copy;
        });
        handleViewAllReplies(comment?.id, commentIndex);
      })
      .catch((error) => {
        console.error("Failed to submit reply to reply:", error);
      });
  };

  // Image attach handlers for reply inputs in modal
  const handleReplyImageClick = (inputKey) => {
    const ref = fileInputRefs.current[inputKey];
    if (ref && ref.click) ref.click();
  };

  const handleReplyImageChange = (e, inputKey) => {
    const files = Array.from(e?.target?.files || []);
    if (!files.length) return;
    const newItems = files.map((file) => ({ file, previewUrl: URL.createObjectURL(file), id: `${Date.now()}-${Math.random()}` }));
    setModalReplyImages((prev) => ({
      ...prev,
      [inputKey]: [ ...(prev[inputKey] || []), ...newItems ],
    }));
    const ref = fileInputRefs.current[inputKey];
    if (ref) ref.value = "";
  };

  const clearReplyImage = (inputKey, index = null) => {
    setModalReplyImages((prev) => {
      const copy = { ...prev };
      const arr = copy[inputKey] || [];
      if (index === null) {
        arr.forEach((img) => { if (img?.previewUrl) URL.revokeObjectURL(img.previewUrl); });
        delete copy[inputKey];
      } else {
        if (arr[index]?.previewUrl) URL.revokeObjectURL(arr[index].previewUrl);
        copy[inputKey] = arr.filter((_, i) => i !== index);
        if (copy[inputKey].length === 0) delete copy[inputKey];
      }
      return copy;
    });
    const ref = fileInputRefs.current[inputKey];
    if (ref) ref.value = "";
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

  // reactions image component
  const ReactImage = (props) => {
    const {reactLink, reactType, reaction, className, showText, textclass=""} = props;
    return(
      <>
         {reaction?.type === reactType && (
           <>
            <Image
              src={reactLink}
              className={className}
              width={100}
              height={100}
              alt="old club man"
            />
            {showText && <div className={textclass}>{showText}</div>}
           </>
          )}
      </>
    )
  }

  // show reactions counts and reactions
  const showingReactionsIcon = (item, index) => {
    return(
      <span role="img" aria-label="surprised" className="text-xl">
            <span key={index} className="inline-block">
              <ReactImage
                reactLink="/like.png"
                reactType="like"
                reaction={item}
                className="w-4 h-4 mb-[4px] inline-block"
              />
              <ReactImage
                reactLink="/love.png"
                reactType="love"
                reaction={item}
                className="w-4 h-4 mb-[4px] inline-block"
              />
              <ReactImage
                reactLink="/care.png"
                reactType="care"
                reaction={item}
                className="w-4 h-4 mb-[4px] inline-block"
              />
              <ReactImage
                reactLink="/haha.png"
                reactType="haha"
                reaction={item}
                className="w-4 h-4 mb-[4px] inline-block"
              />
              <ReactImage
                reactLink="/wow.png"
                reactType="wow"
                reaction={item}
                className="w-4 h-4 mb-[4px] inline-block"
              />
              <ReactImage
                reactLink="/sad.png"
                reactType="sad"
                reaction={item}
                className="w-4 h-4 mb-[4px] inline-block"
              />
              <ReactImage
                reactLink="/angry.png"
                reactType="angry"
                reaction={item}
                className="w-4 h-4 mb-[4px] inline-block"
              />
            </span>
    </span>
    )
  }


  // liking sections for post
const likingReactions = (item) => {
  return(
    <span className="font-semibold flex gap-1">
      <ReactImage
        reactLink="/like.png"
        reactType="like"
        reaction={item}
        className="w-5 h-5 mb-[4px] inline-block"
        textclass="text-[14px]"
        showText="Like"
      />
      <ReactImage
         reactLink="/love.png"
        reactType="love"
        reaction={item}
        className="w-5 h-5 mb-[4px] inline-block"
        textclass="text-red-700 text-[14px]"
        showText="Love"
      />
      <ReactImage
         reactLink="/care.png"
        reactType="care"
        reaction={item}
        className="w-5 h-5 mb-[4px] inline-block"
        textclass="text-yellow-700 text-[14px]"
        showText="Care"
      />
      <ReactImage
         reactLink="/haha.png"
        reactType="haha"
        reaction={item}
        className="w-5 h-5 mb-[4px] inline-block"
        textclass="text-yellow-700 text-[14px]"
        showText="Haha"
      />
       <ReactImage
        reactLink="/wow.png"
        reactType="wow"
        reaction={item}
        className="w-5 h-5 mb-[4px] inline-block"
        textclass="text-yellow-700 text-[14px]"
        showText="Wow"
      />
      <ReactImage
        reactLink="/sad.png"
        reactType="sad"
        reaction={item}
        className="w-5 h-5 mb-[4px] inline-block"
        textclass="text-yellow-700 text-[14px]"
        showText="Sad"
      />
      <ReactImage
        reactLink="/angry.png"
        reactType="angry"
        reaction={item}
        className="w-5 h-5 mb-[4px] inline-block"
        textclass="text-red-500 text-[14px]"
        showText="Angry"
      />
    </span>
  )
}

const reactionsImages = (item) => {

  const CommonDesign = (props) => {
    const {onClick, reactLink, className} = props;
    return(
      <button
        className="transform w-6 cursor-pointer hover:scale-125 transition-transform"
        onClick={() => onClick()}
      >
         <ReactImage
            reactLink={reactLink}
            className={className}
          />
      </button>
    )
  }
  return(
    <div
        className="absolute bottom-full left-0 mb-0 bg-white p-1 rounded-full shadow-lg flex space-x-2 z-10"
      >
        <CommonDesign
          reactLink="/like.png"
          className=""
          onClick={() => handleReaction(item.id, "like")}
        />

        <CommonDesign
          reactLink="/love.png"
          className=""
          onClick={() => handleReaction(item.id, "love")}
        />

        <CommonDesign
          reactLink="/care.png"
          className=""
          onClick={() => handleReaction(item.id, "care")}
        />

        <CommonDesign
          reactLink="/haha.png"
          className=""
          onClick={() => handleReaction(item.id, "haha")}
        />
        <CommonDesign
          reactLink="/wow.png"
          className=""
          onClick={() => handleReaction(item.id, "wow")}
        />
        <CommonDesign
          reactLink="/sad.png"
          className=""
          onClick={() => handleReaction(item.id, "sad")}
        />
        <CommonDesign
          reactLink="/angry.png"
          className=""
          onClick={() => handleReaction(item.id, "angry")}
        />
      </div>
  )
}



  return (
    <div className="">
      {postsData?.data?.map((item, index) => {
        const totalCount = item.multiple_reaction_counts.reduce(
          (sum, dd) => Number(sum) + Number(dd.count),
          0
        );

        const itemUrl = item?.background_url;

        const hasPath = /\/post_background\/.+/.test(itemUrl);

        return (
          <div
            className="bg-white rounded-lg shadow-sm p-4 mb-4"
            key={item.id || index}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex">
                <div className="w-10 h-10 border border-blue-600 rounded-full overflow-hidden mr-3">
                  <Image
                    // src={ item?.client?.image ?
                    //   process.env.NEXT_PUBLIC_CLIENT_FILE_PATH +
                    //   item?.client?.image : "/common-avator.jpg"
                    // }
                    src={ item?.client?.image ?
                      process.env.NEXT_PUBLIC_CLIENT_FILE_PATH +
                      item?.client?.image : "/common-avator.jpg"
                    }
                    className="w-full h-full object-cover"

                     alt="oldclubman"
                    width={1280}
                    height={720}
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
              {hasPath ? 
              <>
                <div 
                className="relative text-white text-center p-4 text-[40px] w-full min-h-[300px] rounded-lg flex items-center justify-center bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${itemUrl})`,
                }}
              >
                {item?.message}
               
              </div>
              </>
              : <p className="text-gray-700 py-2">{item?.message}</p>
              
              }

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
                    // Build robust base + prefix
                    const base = process.env.NEXT_PUBLIC_FILE_PATH || '';
                    const prefix = base ? `${base.replace(/\/+$/, '')}/post/` : '/uploads/post/';
                    const cleanPath = String(filePath || '').replace(/^\/+/, '');
                    const src = `${prefix}${cleanPath}`;
                    
                    // Prepare all images for preview
                    const allImages = (item.files || [])
                      .filter(f => {
                        const fPath = f.file_path || f.path || f.url || f.file_url || '';
                        return !/\.(mp4|webm|ogg|mov|avi)$/i.test(fPath);
                      })
                      .map(f => {
                        const fPath = f.file_path || f.path || f.url || f.file_url || '';
                        const cPath = String(fPath || '').replace(/^\/+/, '');
                        return `${prefix}${cPath}`;
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
                          <Image
                            src={src}
                            alt="oldclubman"
                            className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => handleImagePreview(src, allImages, imageIndex)}
                            width={1920}
                            height={1080}
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
                  {/* showing reactions and counts immidiate after post */}
                  {item?.multiple_reaction_counts?.length > 0 &&
                    item?.multiple_reaction_counts
                      ?.slice(0, 2)
                      .map((reaction, index) => (
                        showingReactionsIcon(reaction, index)
                    ))}
                </span>
                {/* <span className="text-sm">{item?.single_reaction?.client?.fname + " " + item?.single_reaction?.client?.last_name + " and " + totalCount }</span> */}
                <span className="text-sm">{Number(totalCount)}</span>
                <span className="flex items-center gap-2 ml-auto text-sm text-gray-500">
                  {item?.length} <FaRegComment className="" />
                </span>
              </div>
            </div>

            <div className="flex justify-between py-1 border-gray-200 border-b">
              <div className="flex-1 relative">
                <div className="relative">
                  <button
                    className="w-full py-1 cursor-pointer text-center text-blue-500 bg-gray-100 rounded-md"
                    onMouseEnter={() =>
                      setShowReactionsFor(
                        showReactionsFor === item.id ? null : item.id
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
                      if (item.single_reaction) {
                        handleDeleteReaction(item.id);
                      }
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {!item.single_reaction ? (
                        <>
                          <SlLike /> <span>Like</span>
                        </>
                      ) : (
                        <span className="inline-block">
                          {/* post liking section */}
                          {likingReactions(item?.single_reaction)}
                        </span>
                      )}
                    </div>
                  </button>
                  {showReactionsFor === item.id && (
                    <div 
                      className="reactions-container"
                      onMouseEnter={() => setShowReactionsFor(item.id)}
                      onMouseLeave={() => setShowReactionsFor(null)}
                    >
                      {reactionsImages(item)}
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
                        <span>•</span>
                        <button
                          className="hover:underline cursor-pointer font-semibold"
                          onClick={() => handleReplyToReply(i, c.id)}
                          type="button"
                        >
                          Reply
                        </button>
                        <span>•</span>
                        <button className="hover:underline cursor-pointer font-semibold" type="button">
                          See translation
                        </button>
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
                    ref={(el) => (inputRefs.current[`post-comment-${item.id}`] = el)}
                    onChange={(e) => {
                      setCommentInputs({
                        ...commentInputs,
                        [item.id]: e.target.value,
                      });
                      handleMentionDetect(e, `post-comment-${item.id}`);
                    }}
                    onKeyDown={(e) => {
                      const handled = handleMentionKeyDown(e, `post-comment-${item.id}`);
                      if (!handled && e.key === 'Enter') {
                        e.preventDefault();
                        handleCommentSubmit(item.id);
                      }
                    }}
                  />
                  {mentionOpenFor === `post-comment-${item.id}` && mentionOptions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-50 max-h-56 overflow-auto">
                      {mentionOptions.map((u, idx) => (
                        <div
                          key={u.id}
                          className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 ${idx === mentionActiveIndex ? 'bg-gray-100' : ''}`}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            insertMentionToken(u, `post-comment-${item.id}`);
                          }}
                        >
                          <img src={u.avatar} className="w-8 h-8 rounded-full object-cover" />
                          <span className="text-sm font-medium">{u.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
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
                    // Build robust base + prefix
                    const base = process.env.NEXT_PUBLIC_FILE_PATH || '';
                    const prefix = base ? `${base.replace(/\/+$/, '')}/post/` : '/uploads/post/';
                    const cleanPath = String(filePath || '').replace(/^\/+/, '');
                    const src = `${prefix}${cleanPath}`;
                    
                    // Prepare all images for preview
                    const allImages = (basicPostData.files || [])
                      .filter(f => {
                        const fPath = f.file_path || f.path || f.url || f.file_url || '';
                        return !/\.(mp4|webm|ogg|mov|avi)$/i.test(fPath);
                      })
                      .map(f => {
                        const fPath = f.file_path || f.path || f.url || f.file_url || '';
                        const cPath = String(fPath || '').replace(/^\/+/, '');
                        return `${prefix}${cPath}`;
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



              {/* ****************************************************
              comments start
              ******************************************************** */}


              {/* Comments Section */}
              <h4 className="font-semibold mb-4 text-lg">Comments</h4>
              {basicPostData?.comments &&
              basicPostData?.comments?.length > 0 ? (
                basicPostData?.comments?.map((c, i) => (
                  <div key={i} className="mb-4 flex items-start relative">
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
                      {/* Thread line */}
        {/* <div className="absolute border h-100 left-[18px] top-[36px] bottom-0 w-px"></div> */}
                    </div>
                    <div className="flex-1">
                      <div className="bg-gray-100 p-3 rounded-2xl relative border border-gray-200">
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
                          {renderContentWithMentions(c.content)}
                        </div>

                        {/* Reaction count pill overlay */}
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
                      <div className="flex items-center gap-3 ml-2 text-[12px] text-gray-600 mt-1">
                        <span className="text-gray-500">{formatCompactTime(c.created_at)}</span>
                        <span>•</span>
                        <button
                          className="hover:underline relative cursor-pointer font-semibold"
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
                      {/* Reply input of comment */}
                      {modalReplyInputs[`reply-${i}-${c.id}`] !== undefined && (
                        <div className="flex items-start mt-3 ml-2">
                          {/* User Avatar */}
                          <img 
                            src={ profile?.client?.image ? 
                              process.env.NEXT_PUBLIC_CLIENT_FILE_PATH +
                              profile?.client?.image : "/common-avator.jpg"
                            }
                            className="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0"
                            alt="Your avatar"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/common-avator.jpg";
                            }}
                          />
                          
                          {/* Input Container */}
                          <div className="flex-1 bg-gray-100 rounded-2xl border border-gray-200 hover:bg-gray-50 focus-within:bg-white focus-within:border-blue-500 transition-all duration-200">
                            <div className="flex items-center px-3 py-2">
                          <input
                            type="text"
                                className="flex-1 bg-transparent focus:outline-none text-sm placeholder-gray-500"
                                placeholder={`Reply to ${c?.client_comment?.fname || ""}...`}
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
                              
                                                            {/* Facebook-style action buttons */}
                              <div className="flex items-center gap-1 ml-2 relative">
                                {/* Emoji button */}
                                <div className="relative">
                                  <button
                                    type="button"
                                    className={`w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700 ${showEmojiPicker === `reply-${i}-${c.id}` ? 'bg-blue-200' : ''}`}
                                    title="Choose an emoji"
                                                                            onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          toggleEmojiPicker(`reply-${i}-${c.id}`);
                                        }}
                                  >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                      <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zM5.5 6.5c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm5 0c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm1.5 4c-.4 1.2-1.5 2-2.8 2.1-.1 0-.1 0-.2 0-.1 0-.1 0-.2 0-1.3-.1-2.4-.9-2.8-2.1-.1-.3.1-.5.4-.5h4.8c.3 0 .5.2.4.5-.4z"/>
                                    </svg>
                                  </button>
                                  
                                  {/* Emoji Picker - positioned relative to emoji button */}
                                  {showEmojiPicker === `reply-${i}-${c.id}` && (
                                    <div className="emoji-picker-container absolute bottom-full right-0 mb-2 bg-white border rounded-lg shadow-xl z-50 w-80 max-h-96 overflow-hidden">
                                      {/* Category tabs */}
                                      <div className="flex border-b bg-gray-50 p-2 gap-1">
                                        {Object.keys(emojiCategories).map((category) => (
                                          <button
                                            key={category}
                                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                              activeEmojiCategory === category 
                                                ? 'bg-blue-500 text-white' 
                                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                            }`}
                                            onClick={() => setActiveEmojiCategory(category)}
                                          >
                                            {emojiCategories[category].name.split(' ')[0]}
                                          </button>
                                        ))}
                                      </div>
                                      
                                      {/* Emoji grid */}
                                      <div className="p-3 max-h-64 overflow-y-auto">
                                        <div className="grid grid-cols-8 gap-1">
                                          {emojiCategories[activeEmojiCategory].emojis.map((emoji, idx) => (
                                            <button
                                              key={idx}
                                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                              onClick={() => handleEmojiSelect(emoji, `reply-${i}-${c.id}`)}
                                              title={emoji}
                                            >
                                              {emoji}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Camera/Photo button */}
                                <>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    style={{ display: 'none' }}
                                    ref={(el) => (fileInputRefs.current[`reply-${i}-${c.id}`] = el)}
                                    onChange={(e) => handleReplyImageChange(e, `reply-${i}-${c.id}`)}
                                  />
                                  <button
                                    type="button"
                                    className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                                    title="Attach a photo"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleReplyImageClick(`reply-${i}-${c.id}`);
                                    }}
                                  >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                      <path d="M14.5 2h-13C.7 2 0 2.7 0 3.5v9c0 .8.7 1.5 1.5 1.5h13c.8 0 1.5-.7 1.5-1.5v-9c0-.8-.7-1.5-1.5-1.5zM5 4.5c.8 0 1.5.7 1.5 1.5S5.8 7.5 5 7.5 3.5 6.8 3.5 6 4.2 4.5 5 4.5zM13 12H3l2.5-3 1.5 2 3-4 3 5z"/>
                                    </svg>
                                  </button>
                                </>
                                
                                {/* GIF button */}
                                <button
                                  type="button"
                                  className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                                  title="Choose a GIF"
                                >
                                  <span className="text-xs font-bold">GIF</span>
                                </button>
                                
                                {/* Sticker button */}
                                <button
                                  type="button"
                                  className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                                  title="Choose a sticker"
                                >
                                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 1.5c-3.6 0-6.5 2.9-6.5 6.5 0 1.4.4 2.7 1.2 3.8l-.9 2.6c-.1.2 0 .4.2.5.1 0 .2.1.3.1.1 0 .2 0 .2-.1l2.6-.9c1.1.8 2.4 1.2 3.9 1.2 3.6 0 6.5-2.9 6.5-6.5S11.6 1.5 8 1.5zm-2 5.5c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm4 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1 3c-.3.8-1 1.4-1.8 1.7-.2.1-.4 0-.5-.2-.1-.2 0-.4.2-.5.6-.2 1.1-.6 1.3-1.2.1-.2.3-.3.5-.2s.3.3.3.4z"/>
                                  </svg>
                                </button>
                              </div>
                            </div>

                            {/* Selected image previews (reply to comment) under input */}
                            {Array.isArray(modalReplyImages[`reply-${i}-${c.id}`]) && modalReplyImages[`reply-${i}-${c.id}`].length > 0 && (
                              <div className="px-3 pb-2">
                                <div className="flex flex-wrap gap-2">
                                  {modalReplyImages[`reply-${i}-${c.id}`].map((img, idx) => (
                                    <div key={img.id || idx} className="inline-flex items-center gap-2 bg-white rounded-md border p-1">
                                      <img
                                        src={img.previewUrl}
                                        className="w-12 h-12 object-cover rounded"
                                        alt="preview"
                                      />
                                      <button
                                        type="button"
                                        className="text-xs text-red-600 hover:underline"
                                        onClick={() => clearReplyImage(`reply-${i}-${c.id}`, idx)}
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Mention dropdown */}
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
                          
                          {/* Send button - show when there's text or image */}
                          {(modalReplyInputs[`reply-${i}-${c.id}`]?.trim() || (Array.isArray(modalReplyImages[`reply-${i}-${c.id}`]) && modalReplyImages[`reply-${i}-${c.id}`].length > 0)) && (
                            <button
                              className="ml-2 w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                              onClick={() => handleReplyToReplySubmit(i, c.id)}
                              type="button"
                              title="Send"
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                              </svg>
                            </button>
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

                      {/************************************
                      111111111 reply Display replies of comments (filter out replies that are children to avoid duplication) 
                       *********************************************************************/}
                      {(() => {
                        const repliesForComment = modalReplies[i] || [];
                        const childIds = new Set();
                        repliesForComment.forEach(r => (r?.children || []).forEach(ch => ch?.id && childIds.add(ch.id)));
                        const topLevelReplies = repliesForComment.filter(r => !childIds.has(r?.id));
                        return topLevelReplies;
                      })()?.map((reply, ri, repliesArray) => (
                        <div className="relative flex mt-2 ml-8" key={ri}>
                          {/* Horizontal line from parent comment profile to reply profile */}
              {/* <div className="absolute border -left-15 top-[14px] w-10 h-px bg-gray-200"></div> */}
                          {/* Vertical line connecting from parent profile down */}
                          {/* {ri < repliesArray.length - 1 && (
                            <div className="absolute -left-[50px] top-[14px] bottom-0 w-px bg-gray-200"></div>
                          )} */}
                          <div className="relative w-7 h-7 rounded-full overflow-hidden mr-2 mt-1">
                            <img
                              src={
                                (reply?.client_comment?.image && `${process.env.NEXT_PUBLIC_CLIENT_FILE_PATH}${reply?.client_comment?.image?.startsWith('/') ? '' : '/'}${reply?.client_comment?.image}`) || "/common-avator.jpg"
                              }
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "/common-avator.jpg";
                              }}
                            />

                          </div>
              {/* <div className="absolute border left-[12px] top-[36px] bottom-0 w-px bg-gray-500"></div> */}

                          <div className="flex flex-col w-full">
                            <div className="bg-gray-50 w-full p-2 rounded-2xl border border-gray-200 flex flex-col">
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
                                {renderContentWithMentions(reply.content)}
                              {reply?.files?.length > 0 ? (
                              <img 
                                src={process.env.NEXT_PUBLIC_FILE_PATH + "/reply/" + reply?.files[0]?.file_path}
                                width={100}
                                height={100}
                                className="mt-2"
                                />

                              ) : ""}
                              </span>
                            </div>
                            
                            {/* Reply actions row */}
                            <div className="flex items-center gap-3 mt-1 ml-2 text-[12px] text-gray-600">
                              <span className="text-gray-500">{formatCompactTime(reply.created_at)}</span>
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
                                className="hover:underline cursor-pointer font-semibold"
                                onClick={() => handleReplyToReply(i, reply)}
                                type="button"
                              >
                                Reply
                              </button>
                              <span>•</span>
                              <button className="hover:underline cursor-pointer font-semibold" type="button">
                                See translation
                              </button>
                            </div>
                            {/* Reply-to-reply input box - Facebook Style */}
                            {modalReplyInputs[`reply-${i}-${reply.id}`] !== undefined && (
                              <div className="flex items-start mt-3 ml-6">
                                {/* User Avatar */}
                                <img 
                                  src={ profile?.client?.image ? 
                                    process.env.NEXT_PUBLIC_CLIENT_FILE_PATH +
                                    profile?.client?.image : "/common-avator.jpg"
                                  }
                                  className="w-8 h-8 rounded-full object-cover mr-2 flex-shrink-0"
                                  alt="Your avatar"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/common-avator.jpg";
                                  }}
                                />
                                
                                {/* Input Container */}
                                <div className="flex-1 bg-gray-100 rounded-2xl border border-gray-200 hover:bg-gray-50 focus-within:bg-white focus-within:border-blue-500 transition-all duration-200">
                                  <div className="flex items-center px-3 py-2">
                                    <input
                                      type="text"
                                      className="flex-1 bg-transparent focus:outline-none text-sm placeholder-gray-500"
                                      placeholder={`Reply to ${reply?.client_comment?.fname || ""}...`}
                                      value={modalReplyInputs[`reply-${i}`] || ""}
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
                                    
                                    {/* Facebook-style action buttons */
                                    }
                                    <div className="flex items-center gap-1 ml-2 relative">
                                      {/* Emoji button */}
                                      <div className="relative">
                                        <button
                                          type="button"
                                          className={`w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700 ${showEmojiPicker === `reply-${i}-${reply.id}` ? 'bg-blue-200' : ''}`}
                                          title="Choose an emoji"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            toggleEmojiPicker(`reply-${i}-${reply.id}`);
                                          }}
                                        >
                                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zM5.5 6.5c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm5 0c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm1.5 4c-.4 1.2-1.5 2-2.8 2.1-.1 0-.1 0-.2 0-.1 0-.1 0-.2 0-1.3-.1-2.4-.9-2.8-2.1-.1-.3.1-.5.4-.5h4.8c.3 0 .5.2.4.5-.4z"/>
                                          </svg>
                                        </button>
                                        
                                        {/* Emoji Picker */}
                                        {showEmojiPicker === `reply-${i}-${reply.id}` && (
                                          <div className="emoji-picker-container absolute bottom-full right-0 mb-2 bg-white border rounded-lg shadow-xl z-50 w-80 max-h-96 overflow-hidden">
                                            {/* Category tabs */}
                                            <div className="flex border-b bg-gray-50 p-2 gap-1">
                                              {Object.keys(emojiCategories).map((category) => (
                                                <button
                                                  key={category}
                                                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                                    activeEmojiCategory === category 
                                                      ? 'bg-blue-500 text-white' 
                                                      : 'bg-white text-gray-600 hover:bg-gray-100'
                                                  }`}
                                                  onClick={() => setActiveEmojiCategory(category)}
                                                >
                                                  {emojiCategories[category].name.split(' ')[0]}
                                                </button>
                                              ))}
                                            </div>
                                            
                                            {/* Emoji grid */}
                                            <div className="p-3 max-h-64 overflow-y-auto">
                                              <div className="grid grid-cols-8 gap-1">
                                                {emojiCategories[activeEmojiCategory].emojis.map((emoji, idx) => (
                                                  <button
                                                    key={idx}
                                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded text-lg"
                                                    onClick={() => handleEmojiSelect(emoji, `reply-${i}-${reply.id}`)}
                                                    title={emoji}
                                                  >
                                                    {emoji}
                                                  </button>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                      
                                      {/* Camera/Photo button */}
                                      <>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          multiple
                                          style={{ display: 'none' }}
                                          ref={(el) => (fileInputRefs.current[`reply-${i}-${reply.id}`] = el)}
                                          onChange={(e) => handleReplyImageChange(e, `reply-${i}-${reply.id}`)}
                                        />
                                        <button
                                          type="button"
                                          className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                                          title="Attach a photo"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleReplyImageClick(`reply-${i}-${reply.id}`);
                                          }}
                                        >
                                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path d="M14.5 2h-13C.7 2 0 2.7 0 3.5v9c0 .8.7 1.5 1.5 1.5h13c.8 0 1.5-.7 1.5-1.5v-9c0-.8-.7-1.5-1.5-1.5zM5 4.5c.8 0 1.5.7 1.5 1.5S5.8 7.5 5 7.5 3.5 6.8 3.5 6 4.2 4.5 5 4.5zM13 12H3l2.5-3 1.5 2 3-4 3 5z"/>
                                          </svg>
                                        </button>
                                      </>
                                      
                                      {/* GIF button */}
                                      <button
                                        type="button"
                                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                                        title="Choose a GIF"
                                      >
                                        <span className="text-xs font-bold">GIF</span>
                                      </button>
                                      
                                      {/* Sticker button */}
                                      <button
                                        type="button"
                                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                                        title="Choose a sticker"
                                      >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                          <path d="M8 1.5c-3.6 0-6.5 2.9-6.5 6.5 0 1.4.4 2.7 1.2 3.8l-.9 2.6c-.1.2 0 .4.2.5.1 0 .2.1.3.1.1 0 .2 0 .2-.1l2.6-.9c1.1.8 2.4 1.2 3.9 1.2 3.6 0 6.5-2.9 6.5-6.5S11.6 1.5 8 1.5zm-2 5.5c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm4 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1 3c-.3.8-1 1.4-1.8 1.7-.2.1-.4 0-.5-.2-.1-.2 0-.4.2-.5.6-.2 1.1-.6 1.3-1.2.1-.2.3-.3.5-.2s.3.3.3.4z"/>
                                        </svg>
                                      </button>
                                    </div>
                                  </div>

                                {/* Selected image previews (threaded reply) under input */}
                                  {Array.isArray(modalReplyImages[`reply-${i}-${reply.id}`]) && modalReplyImages[`reply-${i}-${reply.id}`].length > 0 && (
                                    <div className="px-3 pb-2">
                                      <div className="flex flex-wrap gap-2">
                                        {modalReplyImages[`reply-${i}-${reply.id}`].map((img, idx) => (
                                          <div key={img.id || idx} className="inline-flex items-center gap-2 bg-white rounded-md border p-1">
                                            <img
                                              src={img.previewUrl}
                                              className="w-12 h-12 object-cover rounded"
                                              alt="preview"
                                            />
                                            <button
                                              type="button"
                                              className="text-xs text-red-600 hover:underline"
                                              onClick={() => clearReplyImage(`reply-${i}-${reply.id}`, idx)}
                                            >
                                              Remove
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Mention dropdown */}
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
                                
                                

                                {/* Send button - show when there's text or image */}
                                {(modalReplyInputs[`reply-${i}-${reply.id}`]?.trim() || (Array.isArray(modalReplyImages[`reply-${i}-${reply.id}`]) && modalReplyImages[`reply-${i}-${reply.id}`].length > 0)) && (
                                  <button
                                    className="ml-2 w-8 h-8 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                                    onClick={() => handleReplyToReplySubmit(i, reply.id)}
                                    type="button"
                                    title="Send"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                    </svg>
                                  </button>
                                )}
                              </div>
                            )}
                            {/* children replies */}
                            {renderReplies(reply?.children || [], i, 2)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</div>
              )}


              
              {/* **********************************************************
            comments end
            *************************************************************** */}
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
                {/* Combined input container so images appear inside */}
                <div className="w-full border rounded-full px-2 py-1 text-sm bg-white flex items-center gap-2 focus-within:ring-2 focus-within:ring-blue-400">
                  {/* Thumbnails inside the input */}
                  {Array.isArray(modalReplyImages[`modal-comment-${basicPostData.id}`]) && modalReplyImages[`modal-comment-${basicPostData.id}`].length > 0 && (
                    <div className="flex items-center gap-1 max-w-32 overflow-x-auto">
                      {modalReplyImages[`modal-comment-${basicPostData.id}`].map((img, idx) => (
                        <div key={img.id || idx} className="relative w-7 h-7 flex-shrink-0">
                          <img src={img.previewUrl} className="w-7 h-7 object-cover rounded" alt="preview" />
                          <button
                            type="button"
                            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-[10px] leading-4 text-red-600 border"
                            onClick={() => clearReplyImage(`modal-comment-${basicPostData.id}`, idx)}
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

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
                    className="flex-1 bg-transparent outline-none border-0 px-2 py-1"
                  />

                  {/* Inline action buttons (emoji, GIF, photo, sticker) */}
                  <div className="flex items-center gap-1">
                    {/* Emoji button */}
                    <button
                      type="button"
                      className={`w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700 ${showEmojiPicker === `modal-comment-${basicPostData.id}` ? 'bg-blue-200' : ''}`}
                      title="Choose an emoji"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleEmojiPicker(`modal-comment-${basicPostData.id}`);
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 1C4.1 1 1 4.1 1 8s3.1 7 7 7 7-3.1 7-7-3.1-7-7-7zM5.5 6.5c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm5 0c.6 0 1-.4 1-1s-.4-1-1-1-1 .4-1 1 .4 1 1 1zm1.5 4c-.4 1.2-1.5 2-2.8 2.1-.1 0-.1 0-.2 0-.1 0-.1 0-.2 0-1.3-.1-2.4-.9-2.8-2.1-.1-.3.1-.5.4-.5h4.8c.3 0 .5.2.4.5-.4z"/>
                      </svg>
                    </button>

                    {/* GIF button (placeholder) */}
                    <button
                      type="button"
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                      title="Choose a GIF"
                    >
                      <span className="text-xs font-bold">GIF</span>
                    </button>

                    {/* Photo attach */}
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        ref={(el) => (fileInputRefs.current[`modal-comment-${basicPostData.id}`] = el)}
                        onChange={(e) => handleReplyImageChange(e, `modal-comment-${basicPostData.id}`)}
                      />
                      <button
                        type="button"
                        className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                        title="Attach a photo"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleReplyImageClick(`modal-comment-${basicPostData.id}`);
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M14.5 2h-13C.7 2 0 2.7 0 3.5v9c0 .8.7 1.5 1.5 1.5h13c.8 0 1.5-.7 1.5-1.5v-9c0-.8-.7-1.5-1.5-1.5zM5 4.5c.8 0 1.5.7 1.5 1.5S5.8 7.5 5 7.5 3.5 6.8 3.5 6 4.2 4.5 5 4.5zM13 12H3l2.5-3 1.5 2 3-4 3 5z"/>
                        </svg>
                      </button>
                    </>

                    {/* Sticker button (placeholder) */}
                    <button
                      type="button"
                      className="w-7 h-7 flex items-center justify-center hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                      title="Choose a sticker"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 1.5c-3.6 0-6.5 2.9-6.5 6.5 0 1.4.4 2.7 1.2 3.8l-.9 2.6c-.1.2 0 .4.2.5.1 0 .2.1.3.1.1 0 .2 0 .2-.1l2.6-.9c1.1.8 2.4 1.2 3.9 1.2 3.6 0 6.5-2.9 6.5-6.5S11.6 1.5 8 1.5zm-2 5.5c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm4 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1 3c-.3.8-1 1.4-1.8 1.7-.2.1-.4 0-.5-.2-.1-.2 0-.4.2-.5.6-.2 1.1-.6 1.3-1.2.1-.2.3-.3.5-.2s.3.3.3.4z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Emoji Picker for comment */}
                  {showEmojiPicker === `modal-comment-${basicPostData.id}` && (
                    <div className="emoji-picker-container absolute bottom-full right-0 mb-2 bg-white border rounded-lg shadow-xl z-50 w-80 max-h-96 overflow-hidden">
                      <div className="flex border-b bg-gray-50 p-2 gap-1">
                        {Object.keys(emojiCategories).map((category) => (
                          <button
                            key={category}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              activeEmojiCategory === category 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                            }`}
                            onClick={() => setActiveEmojiCategory(category)}
                          >
                            {emojiCategories[category].name.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                      <div className="p-3 max-h-64 overflow-y-auto">
                        <div className="grid grid-cols-8 gap-1">
                          {emojiCategories[activeEmojiCategory].emojis.map((emoji, idx) => (
                            <button
                              key={idx}
                              className="text-xl hover:bg-gray-100 rounded p-1"
                              onClick={() => handleEmojiSelect(emoji, `modal-comment-${basicPostData.id}`)}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Selected image previews are now inside the input container */}
                  {mentionOpenFor === `modal-comment-${basicPostData.id}` && mentionOptions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border rounded-md shadow-lg z-50 max-h-56 overflow-auto">
                      {mentionOptions.map((u, idx) => (
                        <div
                          key={u.id}
                          className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-100 ${idx === mentionActiveIndex ? 'bg-gray-100' : ''}`}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            insertMentionToken(u, `modal-comment-${basicPostData.id}`);
                          }}
                        >
                          <img src={u.avatar} className="w-8 h-8 rounded-full object-cover" />
                          <span className="text-sm font-medium">{u.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
              <button
                onClick={() => handleCommentSubmit(basicPostData.id)}
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold disabled:opacity-50"
                disabled={!((commentInputs[basicPostData.id] && commentInputs[basicPostData.id].trim()) || (Array.isArray(modalReplyImages[`modal-comment-${basicPostData.id}`]) && modalReplyImages[`modal-comment-${basicPostData.id}`].length > 0))}
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
