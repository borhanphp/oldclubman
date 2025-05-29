"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  FaSearch, FaUserFriends, FaSmile, FaPaperclip, FaPaperPlane, 
  FaCheckCircle, FaImage, FaFile, FaFileAlt, FaFilePdf, 
  FaFileWord, FaFileExcel, FaFileImage, FaTimesCircle, 
  FaCommentAlt, FaAddressBook, FaEnvelope
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getAllChat, getMessage, sendMessage, startConversation } from './store';
import { getMyProfile, getUserFollowers, getUserProfile } from '../settings/store';
import { useChatPusher } from '@/components/custom/useChatPusher';
import { pusherService } from '@/utility/pusher';
import { ClientSegmentRoot } from 'next/dist/client/components/client-segment';
import moment from 'moment';

const MessagingContent = () => {
  const { allChat, prevChat, convarsationData } = useSelector(({chat}) => chat);
  const { userFollowers, profile, userProfileData } = useSelector(({settings}) => settings);
  const dispatch = useDispatch();
 
  // State for active chats
  const [currentChat, setCurrentChat] = useState(null);
  const [activeTab, setActiveTab] = useState('chats');
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
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
  const filteredContacts = userFollowers?.filter(contact => 
    (contact.follower_client?.fname + " " + contact.follower_client?.last_name)
    .toLowerCase()
    .includes(searchTerm.toLowerCase())
  );

  // Handle chat selection
  const handleChatSelect2 = async (conversation) => {
    try {
      setCurrentChat(conversation);
      const response = await dispatch(getMessage({ id: conversation.id })).unwrap();
      
      if (response) {
        console.log('Chat selected:', conversation);
        console.log('Messages loaded:', response);
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  };

  // Handle contact selection
  const handleContactSelect = async (contactId) => {
    try {
      const profileResponse = await dispatch(getUserProfile(contactId)).unwrap();
      const userData = profileResponse?.client;
      
      if (!userData) {
        console.error('No user data received');
        return;
      }

      const newChat = {
        is_group: 0,
        name: userData?.fname + " " + userData?.last_name,
        avatar: process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + userData?.image,
        user_ids: userData?.id
      };

      const conversationResponse = await dispatch(startConversation(newChat)).unwrap();
      
      if (conversationResponse?.conversation) {
        setCurrentChat(conversationResponse.conversation);
        await dispatch(getMessage({ id: conversationResponse.conversation.id }));
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
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
    if (tab === "contacts") {
      dispatch(getUserFollowers(profile?.client?.id));
    } else {
      dispatch(getAllChat());
    }
    setActiveTab(tab);
    setSearchTerm('');
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

  return (
   
      <div className="h-screen">
        <div className="bg-white h-full shadow-md overflow-hidden">
          <div className="flex h-full">
            {/* Left Sidebar */}
            <div className="flex border-r border-gray-200">
              {/* Tabs */}
              <div className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col items-center pt-4">
                <button 
                  className={`w-12 h-12 mb-2 rounded-full flex items-center justify-center ${activeTab === 'chats' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                  onClick={() => handleTabChange('chats')}
                >
                  <FaCommentAlt size={20} />
                </button>
                <button 
                  className={`w-12 h-12 mb-2 rounded-full flex items-center justify-center ${activeTab === 'contacts' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                  onClick={() => handleTabChange('contacts')}
                >
                  <FaUserFriends size={20} />
                </button>
              </div>
              
              {/* Content area */}
              <div className="w-64 flex flex-col">
                {/* Search */}
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold mb-2">
                    {activeTab === 'chats' ? 'Active Chats' : 'All Contacts'}
                  </h2>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder={activeTab === 'chats' ? "Search messages or users" : "Search contacts"}
                      className="bg-gray-100 w-full pl-10 pr-4 py-2 rounded-md text-sm focus:outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Chats List */}
                {activeTab === 'chats' && (
                  <div className="overflow-y-auto flex-1">
                    {allChat?.length > 0 ? (
                      allChat?.map(chat => (
                        <div 
                          key={chat?.id} 
                          className={`flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${chat?.id === currentChat?.id ? 'bg-blue-50' : ''}`}
                          onClick={() => handleChatSelect2(chat)}
                        >
                          <div className="relative mr-3">
                            <div className="w-10 h-10 rounded-full bg-orange-300 flex items-center justify-center text-white">
                              {chat?.name?.charAt(0)}
                            </div>
                            {chat?.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <h3 className="text-sm font-medium truncate">{chat?.name}</h3>
                              <span className="text-xs text-gray-500">{chat?.time}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-xs text-gray-500 truncate">{chat?.message}</p>
                              {chat?.unread > 0 && (
                                <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  {chat?.unread}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
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
                    {userFollowers?.length > 0 ? (
                      userFollowers?.filter(ff => Number(ff.follower_client.id) !== Number(profile?.client?.id))?.map(contact => (
                        <div 
                          key={contact?.id} 
                          className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleContactSelect(contact?.follower_client?.id)}
                        >
                          <div className="relative mr-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-orange-300 flex items-center justify-center text-white">
                              {contact?.follower_client?.image ? (
                                <img 
                                  src={getImageUrl(contact.follower_client.image)}
                                  alt={contact.follower_client.fname}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.src = '/common-avator.jpg';
                                    e.target.onerror = null;
                                  }}
                                />
                              ) : (
                                <span>{contact.follower_client.fname.charAt(0)}</span>
                              )}
                            </div>
                            {contact.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium truncate">
                              {contact.follower_client?.fname + " " + contact.follower_client.last_name}
                            </h3>
                            <p className="text-xs text-gray-500 truncate">{contact?.status}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <FaAddressBook className="mx-auto text-gray-300 text-4xl mb-2" />
                        <p>No contacts found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative mr-3">
                    <div className="w-10 h-10 rounded-full bg-orange-300 flex items-center justify-center text-white">
                      {userProfileData?.client?.fname?.charAt(0)}
                    </div>
                    {currentChat?.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {userProfileData?.client ? (userProfileData?.client?.fname + " " + userProfileData?.client?.last_name) : "Oldclubman User"}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {isTyping ? 'Typing...' : currentChat?.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {prevChat?.length > 0 ? (
                  <div className="space-y-4">
                    {prevChat?.map(message => (
                      <div 
                        key={message.id} 
                        className={`flex ${Number(message.user_id) === Number(profile?.client?.id) ? 'justify-end' : 'justify-start'}`}
                      >
                        {Number(message.user_id) !== Number(profile?.client?.id) && (
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-orange-300 flex items-center justify-center text-white mr-2">
                            {message?.user?.image ? (
                              <img 
                                src={getImageUrl(message.user.image)}
                                alt={message.user.display_name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = '/common-avator.jpg';
                                  e.target.onerror = null;
                                }}
                              />
                            ) : (
                              <span>{message?.user?.display_name?.charAt(0)}</span>
                            )}
                          </div>
                        )}
                        <div className={`max-w-xs ${Number(message.user_id) === Number(profile?.client?.id) ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200'} rounded-lg p-3 shadow-sm`}>
                          {message.type === 'file' && message.file && (
                            <div className={`mb-2 ${Number(message.user_id) === Number(profile?.client?.id) ? 'border-blue-400 bg-blue-400' : 'border-gray-200 bg-gray-50'}`}>
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
                                <div className={`p-3 border rounded-md ${Number(message.user_id) === Number(profile?.client?.id) ? 'border-blue-400 bg-blue-400' : 'border-gray-200 bg-gray-50'}`}>
                                  <div className="flex items-center">
                                    {getFileIcon(message.file.name)}
                                    <div className="ml-3 flex-1 min-w-0">
                                      <p className={`text-sm font-medium truncate ${Number(message.user_id) === Number(profile?.client?.id) ? 'text-white' : 'text-gray-800'}`}>
                                        {message.file.name}
                                      </p>
                                      <p className={`text-xs ${Number(message.user_id) === Number(profile?.client?.id) ? 'text-blue-100' : 'text-gray-500'}`}>
                                        {formatFileSize(message.file.size)}
                                      </p>
                                    </div>
                                    <button 
                                      onClick={() => handleFileDownload(getImageUrl(message.file.path), message.file.name)}
                                      className={`ml-2 text-xs px-2 py-1 rounded ${Number(message.user_id) === Number(profile?.client?.id) ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                    >
                                      Download
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          {message.content && <p>{message.content}</p>}
                          
                          <div className={`text-xs mt-1 flex justify-end items-center ${Number(message.user_id) === Number(profile?.client?.id) ? 'text-blue-100' : 'text-gray-500'}`}>
                          <span className="text-[10px] block mt-1 opacity-75">
                              {moment(message.created_at).format('hh:mm a')}
                            </span>
                            {message.is_read && (
                              <FaCheckCircle className="ml-1 text-xs" />
                            )}
                          </div>
                        </div>
                        {Number(message.user_id) === Number(profile?.client?.id) && (
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-red-400 flex items-center justify-center text-white ml-2">
                            {message?.user?.image ? (
                              <img 
                                src={getImageUrl(message.user.image)}
                                alt={message.user.display_name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = '/common-avator.jpg';
                                  e.target.onerror = null;
                                }}
                              />
                            ) : (
                              <span>{message?.user?.display_name?.charAt(0) || "N/A"}</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
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
                <div className="px-3 bg-gray-100 border-t border-gray-200">
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
              <div className="p-3 border-t border-gray-200 bg-white">
                <div className="flex items-center rounded-lg bg-gray-100 p-2">
                  <button className="text-gray-500 p-2 hover:text-gray-700">
                    <FaSmile />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button 
                    className="text-gray-500 p-2 hover:text-gray-700"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FaPaperclip />
                  </button>
                  <input
                    type="text"
                    placeholder="Enter Message..."
                    className="flex-1 bg-transparent border-none outline-none px-3 py-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button 
                    className={`${(newMessage.trim() || selectedFile) ? 'bg-blue-500' : 'bg-gray-300'} text-white p-2 rounded-md`}
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() && !selectedFile}
                  >
                    <FaPaperPlane />
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