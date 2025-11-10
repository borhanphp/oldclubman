"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  FaSearch, FaUserFriends, FaSmile, FaPaperclip, FaPaperPlane, 
  FaCheckCircle, FaImage, FaFile, FaFileAlt, FaFilePdf, 
  FaFileWord, FaFileExcel, FaFileImage, FaTimesCircle, 
  FaCommentAlt, FaAddressBook, FaEnvelope, FaBars, FaArrowLeft
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getAllChat, getMessage, sendMessage, startConversation } from './store';
import { getMyProfile, getUserFollowers, getUserFollowing, getUserProfile, getAllFollowers, getFollowSuggestions } from '../settings/store';
import api from '@/helpers/axios';
import toast from 'react-hot-toast';
import { useChatPusher } from '@/components/custom/useChatPusher';
import { pusherService } from '@/utility/pusher';
import { ClientSegmentRoot } from 'next/dist/client/components/client-segment';
import moment from 'moment';

const MessagingContent = () => {
  const searchParams = useSearchParams();
  const { allChat, prevChat, convarsationData } = useSelector(({chat}) => chat);
  const { userFollowers, profile, userProfileData, myFollowers } = useSelector(({settings}) => settings);
  const dispatch = useDispatch();
 
  // State for active chats
  const [currentChat, setCurrentChat] = useState(null);
  const [activeTab, setActiveTab] = useState('chats');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [allContacts, setAllContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true); // Mobile: show sidebar or chat
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize Pusher service when component mounts
  useEffect(() => {
    pusherService.initialize();
    return () => {
      pusherService.disconnect();
    };
  }, []);

  // Initial data fetching
  useEffect(() => {
    dispatch(getAllChat());
    dispatch(getMyProfile());
  }, [dispatch]);

  // Handle window resize - show sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowSidebar(true);
      } else if (!currentChat) {
        // On mobile, show sidebar if no chat is selected
        setShowSidebar(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentChat]);

  // Show sidebar on mobile when no chat is selected
  useEffect(() => {
    if (window.innerWidth < 768 && !currentChat) {
      setShowSidebar(true);
    }
  }, [currentChat]);

  // Fetch all contacts when contacts tab is active
  useEffect(() => {
    const fetchAllContacts = async () => {
      if (activeTab === 'contacts') {
        setContactsLoading(true);
        try {
          // Fetch followers, following, and suggestions
          const [followersRes, followingRes, suggestionsRes] = await Promise.allSettled([
            dispatch(getAllFollowers()).unwrap(),
            dispatch(getUserFollowing(profile?.client?.id)).unwrap(),
            dispatch(getFollowSuggestions(1)).unwrap(),
          ]);

          const contactsMap = new Map();
          const currentUserId = profile?.client?.id;

          // Add followers
          if (followersRes.status === 'fulfilled' && followersRes.value) {
            followersRes.value.forEach(follower => {
              const userId = follower.follower_client?.id;
              if (userId && userId !== currentUserId) {
                contactsMap.set(userId, {
                  id: userId,
                  name: `${follower.follower_client?.fname || ''} ${follower.follower_client?.last_name || ''}`.trim(),
                  avatar: follower.follower_client?.image 
                    ? `${process.env.NEXT_PUBLIC_CLIENT_FILE_PATH}${follower.follower_client.image}`
                    : "/common-avator.jpg",
                  isOnline: follower.follower_client?.is_online || false,
                  userId: userId,
                  source: 'follower'
                });
              }
            });
          }

          // Add following
          if (followingRes.status === 'fulfilled' && followingRes.value) {
            followingRes.value.forEach(following => {
              const userId = following.follower_client?.id || following.following_client?.id;
              if (userId && userId !== currentUserId) {
                const userData = following.follower_client || following.following_client;
                if (!contactsMap.has(userId)) {
                  contactsMap.set(userId, {
                    id: userId,
                    name: `${userData?.fname || ''} ${userData?.last_name || ''}`.trim(),
                    avatar: userData?.image 
                      ? `${process.env.NEXT_PUBLIC_CLIENT_FILE_PATH}${userData.image}`
                      : "/common-avator.jpg",
                    isOnline: userData?.is_online || false,
                    userId: userId,
                    source: 'following'
                  });
                }
              }
            });
          }

          // Add suggestions
          if (suggestionsRes.status === 'fulfilled' && suggestionsRes.value) {
            suggestionsRes.value.forEach(suggestion => {
              const userId = suggestion.follower_client?.id || suggestion.following_client?.id;
              if (userId && userId !== currentUserId) {
                const userData = suggestion.follower_client || suggestion.following_client;
                if (!contactsMap.has(userId)) {
                  contactsMap.set(userId, {
                    id: userId,
                    name: `${userData?.fname || ''} ${userData?.last_name || ''}`.trim(),
                    avatar: userData?.image 
                      ? `${process.env.NEXT_PUBLIC_CLIENT_FILE_PATH}${userData.image}`
                      : "/common-avator.jpg",
                    isOnline: userData?.is_online || false,
                    userId: userId,
                    source: 'suggestion'
                  });
                }
              }
            });
          }

          // If search term exists, also search for users
          if (searchTerm && searchTerm.length >= 2) {
            try {
              const searchResponse = await api.get(`/client/search_by_people?search=${encodeURIComponent(searchTerm)}`);
              const searchResults = searchResponse.data?.data?.follow_connections || [];
              
              searchResults.forEach(result => {
                const userId = result.follower_client?.id || result.following_client?.id;
                if (userId && userId !== currentUserId) {
                  const userData = result.follower_client || result.following_client;
                  if (!contactsMap.has(userId)) {
                    contactsMap.set(userId, {
                      id: userId,
                      name: `${userData?.fname || ''} ${userData?.last_name || ''}`.trim(),
                      avatar: userData?.image 
                        ? `${process.env.NEXT_PUBLIC_CLIENT_FILE_PATH}${userData.image}`
                        : "/common-avator.jpg",
                      isOnline: userData?.is_online || false,
                      userId: userId,
                      source: 'search'
                    });
                  }
                }
              });
            } catch (searchError) {
              console.error('Search error:', searchError);
            }
          }

          setAllContacts(Array.from(contactsMap.values()));
        } catch (error) {
          console.error('Error fetching contacts:', error);
        } finally {
          setContactsLoading(false);
        }
      }
    };

    fetchAllContacts();
  }, [activeTab, dispatch, profile?.client?.id, searchTerm]);

  // Handle chat selection
  const handleChatSelect2 = useCallback(async (conversation) => {
    try {
      setCurrentChat(conversation);
      const response = await dispatch(getMessage({ id: conversation.id })).unwrap();
      
      if (response) {
        console.log('Chat selected:', conversation);
        console.log('Messages loaded:', response);
        // On mobile, hide sidebar and show chat
        if (window.innerWidth < 768) {
          setShowSidebar(false);
        }
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  }, [dispatch]);

  // Handle conversation query parameter (from product page redirect)
  useEffect(() => {
    const conversationId = searchParams?.get('conversation');
    if (conversationId && allChat && allChat.length > 0) {
      const conversation = allChat.find(chat => chat.id === Number(conversationId));
      if (conversation) {
        handleChatSelect2(conversation);
      }
    }
  }, [searchParams, allChat, handleChatSelect2]);

  // Handle new message received via Pusher
  const handleMessageReceived = useCallback((data) => {
    if (Number(data.conversation_id) === Number(convarsationData?.id)) {
      dispatch(getMessage({id: Number(convarsationData.id)}));
    }
  }, [convarsationData?.id, dispatch]);

  // Handle typing event
  const handleTyping = useCallback((data) => {
    if (data.user_id !== profile?.client?.id) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    }
  }, [profile?.client?.id]);

  // Use the custom Pusher hook
  useChatPusher(
    Number(convarsationData?.id),
    handleMessageReceived,
    handleTyping
  );

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [prevChat]);

  // Filter chats based on search term
  const filteredChats = allChat?.filter(chat => 
    chat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter contacts based on search term
  const filteredContacts = allContacts?.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];


  // Handle contact selection - using the same robust logic from FeedHeader
  const handleContactSelect = async (contactId) => {
    try {
      const profileResponse = await dispatch(getUserProfile(contactId)).unwrap();
      const userData = profileResponse?.client;
      
      if (!userData) {
        console.error('No user data received');
        toast.error('User data not available');
        return;
      }

      // Don't allow messaging yourself
      if (contactId === profile?.client?.id) {
        toast.error("You cannot message yourself");
        return;
      }

      // Helper function to find conversation by user ID
      const findConversationByUserId = (chats, userId) => {
        if (!chats || !Array.isArray(chats)) return null;
        
        return chats.find(chat => {
          if (chat.user_ids) {
            const userIds = Array.isArray(chat.user_ids) ? chat.user_ids : [chat.user_ids];
            if (userIds.some(id => Number(id) === Number(userId))) return true;
          }
          if (chat.participants?.some(p => 
            Number(p.id) === Number(userId) || 
            Number(p.user_id) === Number(userId) ||
            Number(p.client_id) === Number(userId)
          )) return true;
          if (chat.other_user && (
            chat.other_user.id === Number(userId) ||
            chat.other_user.user_id === Number(userId) ||
            chat.other_user.client_id === Number(userId)
          )) return true;
          return false;
        });
      };

      // First, check if conversation already exists
      let conversation = null;
      
      try {
        const allChats = await dispatch(getAllChat()).unwrap();
        conversation = findConversationByUserId(allChats, userData.id);
        
        if (!conversation) {
          const directResponse = await api.get('/chat');
          const directChats = directResponse.data?.data || directResponse.data || [];
          conversation = findConversationByUserId(directChats, userData.id);
        }
      } catch (e) {
        console.error('Error fetching chats:', e);
      }

      // If conversation doesn't exist, create it
      if (!conversation) {
        const newChat = {
          is_group: 0,
          name: `${userData.fname} ${userData.last_name}`,
          avatar: userData?.image ? process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + userData.image : "/common-avator.jpg",
          user_ids: userData.id
        };

        try {
          const createResponse = await api.post('/chat', newChat);
          
          // Handle different response structures
          if (createResponse.data?.data?.conversation?.id) {
            conversation = createResponse.data.data.conversation;
          } else if (createResponse.data?.data?.id) {
            conversation = { id: createResponse.data.data.id };
          } else if (createResponse.data?.conversation?.id) {
            conversation = createResponse.data.conversation;
          } else if (createResponse.data?.id) {
            conversation = { id: createResponse.data.id };
          } else if (createResponse.data?.data) {
            const data = createResponse.data.data;
            if (data.id) {
              conversation = { id: data.id };
            } else if (typeof data === 'object' && Object.keys(data).length > 0) {
              conversation = data;
            }
          }
          
          if (conversation?.id) {
            await dispatch(getAllChat());
          } else {
            const refreshedChats = await dispatch(getAllChat()).unwrap();
            conversation = findConversationByUserId(refreshedChats, userData.id);
          }
        } catch (err) {
          // Handle "conversation already exists" error
          const errorStatus = err?.response?.status;
          const errorMessage = err?.response?.data?.message || '';
          const isAlreadyExistsError = 
            errorStatus === 400 && 
            (errorMessage.toLowerCase().includes("already exists") ||
             errorMessage.toLowerCase().includes("conversation"));

          if (isAlreadyExistsError) {
            // Try to extract conversation ID from error or refresh and find it
            const errorData = err?.response?.data;
            let convId = errorData?.data?.conversation_id || 
                         errorData?.data?.id || 
                         errorData?.conversation_id || 
                         errorData?.id ||
                         errorData?.conversation?.id ||
                         errorData?.data?.conversation?.id;
            
            if (!convId && errorMessage) {
              const idMatch = errorMessage.match(/conversation[_\s]*id[:\s]*(\d+)/i) || 
                             errorMessage.match(/id[:\s]*(\d+)/i);
              if (idMatch) {
                convId = idMatch[1];
              }
            }
            
            if (convId) {
              conversation = { id: Number(convId) };
            } else {
              // Refresh and find it
              const updatedChats = await dispatch(getAllChat()).unwrap();
              conversation = findConversationByUserId(updatedChats, userData.id);
              
              if (!conversation) {
                const directResponse = await api.get('/chat');
                const directChats = directResponse.data?.data || directResponse.data || [];
                conversation = findConversationByUserId(directChats, userData.id);
              }
            }
          } else {
            toast.error(err?.response?.data?.message || 'Failed to start conversation. Please try again.');
            return;
          }
        }
      }

      // If we have a conversation, open it
      if (conversation?.id) {
        setCurrentChat(conversation);
        try {
          await dispatch(getMessage({ id: conversation.id }));
          setActiveTab('chats'); // Switch to chats tab to show the conversation
          // On mobile, hide sidebar and show chat
          if (window.innerWidth < 768) {
            setShowSidebar(false);
          }
        } catch (msgError) {
          console.error('Error loading messages:', msgError);
          // Still set current chat even if messages fail
          setCurrentChat(conversation);
          setActiveTab('chats');
          // On mobile, hide sidebar and show chat
          if (window.innerWidth < 768) {
            setShowSidebar(false);
          }
        }
      } else {
        // Create minimal conversation object for pending conversation
        const minimalConversation = {
          id: null,
          user_ids: userData.id,
          name: `${userData.fname} ${userData.last_name}`,
          avatar: userData?.image ? process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + userData.image : "/common-avator.jpg",
          is_group: 0,
          _userData: userData,
          _pendingConversation: true
        };
        
        setCurrentChat(minimalConversation);
        setActiveTab('chats');
        // On mobile, hide sidebar and show chat
        if (window.innerWidth < 768) {
          setShowSidebar(false);
        }
        toast.success('Opening conversation. You can now send a message.');
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast.error('Failed to start conversation. Please try again.');
    }
  };

  // Get file icon based on type
  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    switch(extension) {
      case 'pdf': return <FaFilePdf className="text-red-500" size={24} />;
      case 'doc':
      case 'docx': return <FaFileWord className="text-blue-500" size={24} />;
      case 'xls':
      case 'xlsx': return <FaFileExcel className="text-green-500" size={24} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return <FaFileImage className="text-purple-500" size={24} />;
      default: return <FaFileAlt className="text-gray-500" size={24} />;
    }
  };

  // Check if file is an image
  const isImageFile = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
  };

  // Get image URL with proper path
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/common-avator.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${process.env.NEXT_PUBLIC_CLIENT_FILE_PATH}/${imagePath}`;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!newMessage.trim() && !selectedFile) return;

    if (!convarsationData?.id) {
      alert('Please select a conversation first');
      return;
    }

    try {
      const chatData = {
        chatId: convarsationData.id,
        type: selectedFile ? "file" : "text",
        content: newMessage.trim(),
        file: selectedFile
      };

      // Clear message input immediately for better UX
      setNewMessage("");
      
      const response = await dispatch(sendMessage(chatData)).unwrap();
      
      if (response) {
        // Clear file if exists
        if (selectedFile) {
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
        
        // Refresh messages
        dispatch(getMessage({id: Number(convarsationData.id) }));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Show error message to user
      alert(error.message || 'Failed to send message. Please try again.');
      // Restore message if failed
      if (newMessage.trim()) {
        setNewMessage(newMessage);
      }
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        e.target.value = ''; // Clear the file input
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('File type not supported. Please upload an image, PDF, or Word document.');
        e.target.value = '';
        return;
      }

      setSelectedFile(file);
    }
  };

  // Download file
  const handleFileDownload = async (fileUrl, fileName) => {
    try {
      const response = await fetch(fileUrl, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('old_token')}`
        }
      });
      
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file');
    }
  };

  // Remove selected file
  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle key press to send message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
    if (tab === "chats") {
      dispatch(getAllChat());
    }
    // Contacts are fetched automatically in useEffect when activeTab changes
  };

  // Effect to scroll to bottom when messages change
  useEffect(() => {
    if (prevChat?.length > 0) {
      scrollToBottom();
    }
  }, [prevChat]);

  // Effect to set current chat when conversation data changes
  useEffect(() => {
    if (convarsationData) {
      setCurrentChat(convarsationData);
    }
  }, [convarsationData]);


// Removed unused filteredChatsUsers - was causing error when profile.client is undefined
// const filteredChatsUsers = allChat?.map(mp => mp?.user_id === mp.users?.filter(ddd => ddd?.id === Number(profile?.client?.id)))

  return (
   
      <div className="h-full w-full overflow-hidden" style={{ height: '100%' }}>
        <div className="bg-white h-full w-full shadow-md overflow-hidden" style={{ height: '100%' }}>
          <div className="flex h-full w-full overflow-hidden" style={{ height: '100%' }}>
            {/* Left Sidebar */}
            <div className={`flex border-r border-gray-200 ${showSidebar ? 'block' : 'hidden'} md:block ${showSidebar ? 'w-full md:w-auto' : ''} absolute md:relative z-30 md:z-auto bg-white h-full`}>
              {/* Tabs */}
              <div className="w-12 md:w-16 bg-gray-50 border-r border-gray-200 flex flex-col items-center pt-4">
                <button 
                  className={`w-10 h-10 md:w-12 md:h-12 mb-2 rounded-full flex items-center justify-center ${activeTab === 'chats' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                  onClick={() => handleTabChange('chats')}
                >
                  <FaCommentAlt className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button 
                  className={`w-10 h-10 md:w-12 md:h-12 mb-2 rounded-full flex items-center justify-center ${activeTab === 'contacts' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                  onClick={() => handleTabChange('contacts')}
                >
                  <FaUserFriends className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
              
              {/* Content area */}
              <div className="w-full sm:w-64 flex flex-col">
                {/* Search */}
                <div className="p-3 md:p-4 border-b border-gray-200">
                  <h2 className="text-base md:text-lg font-semibold mb-2">
                    {activeTab === 'chats' ? 'Active Chats' : 'All Contacts'}
                  </h2>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400 text-sm" />
                    </div>
                    <input
                      type="text"
                      placeholder={activeTab === 'chats' ? "Search..." : "Search contacts"}
                      className="bg-gray-100 w-full pl-9 md:pl-10 pr-4 py-2 rounded-md text-xs md:text-sm focus:outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Chats List */}
                {activeTab === 'chats' && (
                  <div className="overflow-y-auto flex-1">
                    {allChat?.length > 0 ? (
                      allChat?.map(chat => {
                        const isOwner = chat?.users?.filter(ff => ff.id !== Number(profile?.client?.id))[0]
                        // console.log('isOwner',isOwner)
                        
                        return (
                        
                            <div 
                              key={chat?.id} 
                              className={`flex items-center p-2 md:p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${chat?.id === currentChat?.id ? 'bg-blue-50' : ''}`}
                              onClick={() => handleChatSelect2(chat)}
                            >
                              <div className="relative mr-2 md:mr-3 flex-shrink-0">
                                {chat?.avatar && chat.avatar !== "/common-avator.jpg" ? (
                                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-500 shadow-sm">
                                    <img 
                                      src={chat.avatar.startsWith('http') ? chat.avatar : getImageUrl(chat.avatar)}
                                      alt={chat?.name || 'Chat'}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.src = '/common-avator.jpg';
                                        e.target.onerror = null;
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-xs md:text-sm font-medium shadow-sm">
                                    {(chat?.name || 'C').charAt(0).toUpperCase()}
                                  </div>
                                )}
                                {chat?.isOnline && (
                                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center">
                                  <h3 className="text-xs md:text-sm font-medium truncate">{chat?.name}</h3>
                                  <span className="text-[10px] md:text-xs text-gray-500 ml-1">{chat?.time}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <p className="text-[10px] md:text-xs text-gray-500 truncate">{chat?.message}</p>
                                  {chat?.unread > 0 && (
                                    <span className="ml-2 bg-blue-500 text-white text-[10px] md:text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                                      {chat?.unread}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                         
                        )
                      })
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <FaEnvelope className="mx-auto text-gray-300 text-4xl mb-2" />
                        <p>No conversations found</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Contacts List */}
                {activeTab === 'contacts' && (
                  <div className="overflow-y-auto flex-1">
                    {contactsLoading ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <p className="mt-2">Loading contacts...</p>
                      </div>
                    ) : filteredContacts.length > 0 ? (
                      filteredContacts.map(contact => (
                        <div 
                          key={contact.id} 
                          className="flex items-center p-2 md:p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleContactSelect(contact.userId)}
                        >
                          <div className="relative mr-2 md:mr-3 flex-shrink-0">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-orange-300 flex items-center justify-center text-white text-xs md:text-sm">
                              {contact.avatar && contact.avatar !== "/common-avator.jpg" ? (
                                <img 
                                  src={contact.avatar}
                                  alt={contact.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = '/common-avator.jpg';
                                    e.target.onerror = null;
                                  }}
                                />
                              ) : (
                                <span>{contact.name.charAt(0) || 'U'}</span>
                              )}
                            </div>
                            {contact.isOnline && (
                              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-xs md:text-sm font-medium truncate">
                              {contact.name || 'Unknown User'}
                            </h3>
                            <p className="text-[10px] md:text-xs text-gray-500 truncate">
                              {contact.isOnline ? 'Online' : 'Offline'}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <FaAddressBook className="mx-auto text-gray-300 text-4xl mb-2" />
                        <p>{searchTerm ? 'No contacts found' : 'No contacts available'}</p>
                        {!searchTerm && (
                          <p className="text-xs mt-1">Start following people to see them here</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Chat Area */}
            <div className={`flex-1 flex flex-col overflow-hidden h-full ${!showSidebar ? 'block' : 'hidden'} md:block w-full`}>
              {/* Chat Header */}
              <div className="pl-3 pt-3 pb-3 md:pl-4 md:pt-4 md:pb-4 pr-0 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm flex-shrink-0">
                <div className="flex items-center flex-1 min-w-0">
                  {/* Back button for mobile */}
                  <button 
                    onClick={() => setShowSidebar(true)}
                    className="md:hidden mr-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Back to chats"
                  >
                    <FaArrowLeft className="text-gray-600 w-5 h-5" />
                  </button>
                  <div className="relative mr-2 md:mr-3 flex-shrink-0">
                    {userProfileData?.client?.image ? (
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-500 shadow-sm ring-2 ring-white">
                        <img 
                          src={getImageUrl(userProfileData.client.image)}
                          alt={userProfileData?.client?.fname || 'User'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/common-avator.jpg';
                            e.target.onerror = null;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-xs md:text-sm font-medium shadow-sm ring-2 ring-white">
                        {(userProfileData?.client?.fname || currentChat?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                    )}
                    {currentChat?.isOnline && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">
                      {userProfileData?.client ? (userProfileData?.client?.fname + " " + userProfileData?.client?.last_name) : currentChat?.name || "Oldclubman User"}
                    </h3>
                    <p className="text-[10px] md:text-xs text-gray-500 flex items-center gap-1">
                      {isTyping ? (
                        <>
                          <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                          <span>Typing...</span>
                        </>
                      ) : (
                        <>
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${currentChat?.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                          <span>{currentChat?.isOnline ? 'Online' : 'Offline'}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto min-h-0 pl-3 pt-3 pb-3 md:pl-4 md:pt-4 md:pb-4 pr-0 bg-gray-50" style={{ height: 0, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
                {prevChat?.length > 0 ? (
                  <div className="space-y-3 md:space-y-4">
                    {prevChat?.map((message, index) => {
                      // Group messages from the same user
                      const isSameUser = index > 0 && 
                        Number(prevChat[index - 1]?.user_id) === Number(message.user_id);
                      const isCurrentUser = Number(message.user_id) === Number(profile?.client?.id);
                      
                      return (
                      <div 
                        key={message.id} 
                        className={`flex items-end ${isCurrentUser ? 'justify-end' : 'justify-start'} ${isSameUser ? 'mt-1' : 'mt-3'}`}
                      >
                        {!isCurrentUser && !isSameUser && (
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white mr-2 flex-shrink-0 shadow-sm">
                            {message?.user?.image ? (
                              <img 
                                src={getImageUrl(message.user.image)}
                                alt={message?.user?.display_name || message?.user?.fname || 'User'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = '/common-avator.jpg';
                                  e.target.onerror = null;
                                }}
                              />
                            ) : (
                              <span className="text-xs font-medium">
                                {(message?.user?.display_name || message?.user?.fname || message?.user?.name || 'U').charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                        )}
                        {/* Only render message bubble if there's content or file */}
                        {(message.content || (message.type === 'file' && message.file)) && (
                        <div className={`max-w-[75%] md:max-w-xs lg:max-w-md ${isCurrentUser ? 'bg-blue-500 text-white rounded-tl-lg rounded-tr-lg rounded-bl-lg' : 'bg-white border border-gray-200 rounded-tl-lg rounded-tr-lg rounded-br-lg'} rounded-lg p-3 md:p-3 shadow-sm hover:shadow-md transition-shadow`}>
                          {message.type === 'file' && message.file && (
                            <div className={`mb-2 ${isCurrentUser ? 'border-blue-400 bg-blue-400' : 'border-gray-200 bg-gray-50'}`}>
                              {isImageFile(message.file.name) ? (
                                // Image preview
                                <div className="rounded-lg overflow-hidden mb-2">
                                  <img 
                                    src={getImageUrl(message.file.path)}
                                    alt={message.file.name}
                                    className="w-full h-auto max-h-48 object-cover"
                                    onError={(e) => {
                                      e.target.src = '/common-avator.jpg';
                                      e.target.onerror = null;
                                    }}
                                  />
                                </div>
                              ) : (
                                // File attachment
                                <div className={`p-3 border rounded-md ${isCurrentUser ? 'border-blue-400 bg-blue-400' : 'border-gray-200 bg-gray-50'}`}>
                                  <div className="flex items-center">
                                    {getFileIcon(message.file.name)}
                                    <div className="ml-3 flex-1 min-w-0">
                                      <p className={`text-sm font-medium truncate ${isCurrentUser ? 'text-white' : 'text-gray-800'}`}>
                                        {message.file.name}
                                      </p>
                                      <p className={`text-xs ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                                        {formatFileSize(message.file.size)}
                                      </p>
                                    </div>
                                    <button 
                                      onClick={() => handleFileDownload(getImageUrl(message.file.path), message.file.name)}
                                      className={`ml-2 text-xs px-2 py-1 rounded ${isCurrentUser ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors`}
                                    >
                                      Download
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          {message.content && (
                            <p className={`text-xs md:text-sm break-words whitespace-pre-wrap leading-relaxed ${isCurrentUser ? 'text-white' : 'text-gray-800'}`}>
                              {message.content}
                            </p>
                          )}
                          
                          <div className={`text-[10px] md:text-xs mt-2 flex justify-end items-center gap-1 ${isCurrentUser ? 'text-blue-100' : 'text-gray-500'}`}>
                            <span className="opacity-75">
                              {moment(message.created_at).format('hh:mm a')}
                            </span>
                            {message.is_read && isCurrentUser && (
                              <FaCheckCircle className="text-[10px] md:text-xs opacity-75" />
                            )}
                          </div>
                        </div>
                        )}
                        {isCurrentUser && !isSameUser && (
                          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white ml-2 flex-shrink-0 shadow-sm">
                            {profile?.client?.image ? (
                              <img 
                                src={getImageUrl(profile.client.image)}
                                alt={profile?.client?.fname || 'You'}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = '/common-avator.jpg';
                                  e.target.onerror = null;
                                }}
                              />
                            ) : (
                              <span className="text-xs font-medium">
                                {(profile?.client?.fname || 'Y').charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <FaCommentAlt className="text-gray-300 text-5xl mb-4" />
                    <p>No messages yet</p>
                    <p className="text-sm mt-2">Send a message to start the conversation</p>
                  </div>
                )}
              </div>
              
              {/* File Preview */}
              {selectedFile && (
                <div className="pl-3 pr-0 bg-gray-100 border-t border-gray-200 flex-shrink-0">
                  <div className="flex items-center p-2 bg-white border border-gray-200 rounded-md my-2">
                    {getFileIcon(selectedFile.name)}
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <button 
                      onClick={removeSelectedFile}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimesCircle />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Message Input */}
              <div className="pl-2 pt-2 pb-2 md:pl-3 md:pt-3 md:pb-3 pr-0 border-t border-gray-200 bg-white flex-shrink-0">
                <div className="flex items-center rounded-lg bg-gray-100 p-1.5 md:p-2">
                  <button className="text-gray-500 p-1.5 md:p-2 hover:text-gray-700">
                    <FaSmile className="text-sm md:text-base" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button 
                    className="text-gray-500 p-1.5 md:p-2 hover:text-gray-700"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FaPaperclip className="text-sm md:text-base" />
                  </button>
                  <input
                    type="text"
                    placeholder="Enter Message..."
                    className="flex-1 bg-transparent border-none outline-none px-2 md:px-3 py-1 text-xs md:text-sm"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button 
                    className={`${(newMessage.trim() || selectedFile) ? 'bg-blue-500' : 'bg-gray-300'} text-white p-1.5 md:p-2 rounded-md`}
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() && !selectedFile}
                  >
                    <FaPaperPlane className="text-sm md:text-base" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default MessagingContent;