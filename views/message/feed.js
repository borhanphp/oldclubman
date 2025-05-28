"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  FaSearch, FaUserFriends, FaSmile, FaPaperclip, FaPaperPlane, 
  FaCheckCircle, FaImage, FaFile, FaFileAlt, FaFilePdf, 
  FaFileWord, FaFileExcel, FaFileImage, FaTimesCircle, 
  FaCommentAlt, FaAddressBook, FaEnvelope
} from 'react-icons/fa';
import api from '@/helpers/axios';
import { useDispatch, useSelector } from 'react-redux';
import { getAllChat, getMessage, sendMessage, startConversation } from './store';
import { getMyProfile, getUserFollowers, getUserProfile } from '../settings/store';
import Pusher from 'pusher-js';

const MessagingContent = () => {
  const {allChat, prevChat, convarsationData} = useSelector(({chat}) => chat);
  const {userFollowers, profile, userProfileData} = useSelector(({settings}) => settings);
  const dispatch = useDispatch();
  console.log('allChat',allChat)

  console.log('userFollowers',userFollowers)
  // State for active chats
  const [activeChats, setActiveChats] = useState([]);

  // State for contacts
  const [contacts, setContacts] = useState([]);

  // State for current chat
  const [currentChat, setCurrentChat] = useState(null);

  // Tab state
  const [activeTab, setActiveTab] = useState('chats');

  // Other states
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // State for file uploads
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  
  const messagesEndRef = useRef(null);

  // Modal state
  const [showNewContactModal, setShowNewContactModal] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);

  // New chat/group form state
  const [newContactUserId, setNewContactUserId] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupUserIds, setNewGroupUserIds] = useState([]);
  const [newGroupAvatar, setNewGroupAvatar] = useState(null);

  useEffect(() => {
    dispatch(getAllChat())
    dispatch(getMyProfile())
  }, [])

  console.log(profile?.client?.id)
  // Filter chats based on search term
  const filteredChats = activeChats.filter(chat => 
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  // Fetch chats from API
  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await api.get('/chat');
      setActiveChats(res.data.data || []);
      // Optionally select the first chat
      if (!currentChat && res.data.data && res.data.data.length > 0) {
        setCurrentChat(res.data.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch chats', err);
    }
  };

  // Handle chat selection
  const handleChatSelect = (chatId) => {
    const selectedChat = activeChats.find(chat => chat.id === chatId);
    
    // Mark messages as read when selecting a chat
    const updatedChats = activeChats.map(chat => 
      chat.id === chatId ? { ...chat, unread: 0 } : chat
    );
    setActiveChats(updatedChats);
    
    // Set the current chat
    if (selectedChat) {
      setCurrentChat(selectedChat);
    }
  };

  // Handle contact selection
  const handleContactSelect = (contactId) => {
    dispatch(getUserProfile(contactId))
    .then((res) => {
      const userData = res?.payload?.client;
      const newChat = {
        is_group: 0,
        name: userData?.fname + " " + userData?.last_name,
        avatar: process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + userData?.image,
        user_ids: userData?.id
      };
      dispatch(startConversation(newChat))
      .then((response) => {
        const conversation = response?.payload?.conversation;
        dispatch(getMessage(conversation))
        .then((ress) => {
          console.log('ress from get message', ress)
        })
      })
    })
  };

  const handleChatSelect2 = (conversation) => {
    dispatch(getMessage(conversation))
    .then((ress) => {
      console.log('ress from get message', ress)
    })
  };
  


  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Get file icon based on type
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    switch(extension) {
      case 'pdf':
        return <FaFilePdf className="text-red-500" size={24} />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="text-blue-500" size={24} />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel className="text-green-500" size={24} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FaFileImage className="text-purple-500" size={24} />;
      default:
        return <FaFileAlt className="text-gray-500" size={24} />;
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Pusher setup for real-time messaging
  useEffect(() => {
    if (!convarsationData?.id) return;

    // Check if Pusher key is available
    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    console.log('Pusher Key:', pusherKey);
    
    if (!pusherKey) {
      console.error('Pusher key is not defined in environment variables');
      return;
    }

    // Initialize Pusher
    const pusher = new Pusher(pusherKey, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2',
      wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST || `ws-${process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2'}.pusher.com`,
      wsPort: process.env.NEXT_PUBLIC_PUSHER_PORT || 80,
      wssPort: process.env.NEXT_PUBLIC_PUSHER_PORT || 443,
      forceTLS: true,
      enabledTransports: ['ws', 'wss'],
      disableStats: true
    });

    // Subscribe to the conversation channel
    const channel = pusher.subscribe(`private-conversation.${convarsationData.id}`);

    // Listen for new messages
    channel.bind('App\\Events\\MessageSent', (data) => {
      // Update messages when a new message is received
      dispatch(getMessage({id: convarsationData.id}));
    });

    return () => {
      channel.unbind('App\\Events\\MessageSent');
      pusher.unsubscribe(`private-conversation.${convarsationData.id}`);
    };
  }, [convarsationData?.id]);

  // Handle sending a message
  const handleSendMessage = () => {
    const chatData = {
      chatId: convarsationData?.id,
      type: "text",
      content: newMessage
    }

    dispatch(sendMessage(chatData))
    .then((res) => {
      setNewMessage("");
      // No need to manually fetch messages as Pusher will trigger the update
    })
  };

  // Remove selected file
  const removeSelectedFile = () => {
    setSelectedFile(null);
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
    if(tab === "contacts"){
        dispatch(getUserFollowers(profile?.client?.id));
    }else{
      dispatch(getAllChat())
    }
    setActiveTab(tab);
    setSearchTerm('');
  };

  // Create one-to-one chat
  const handleCreateContactChat = async () => {
    try {
      const formData = new FormData();
      formData.append('user_ids[]', newContactUserId);
      formData.append('is_group', 0);
      formData.append('name', '');
      const res = await api.post('/chat', formData);
      setShowNewContactModal(false);
      setNewContactUserId('');
      fetchChats();
    } catch (err) {
      alert('Failed to create chat');
    }
  };

  // Create group chat
  const handleCreateGroupChat = async () => {
    try {
      const formData = new FormData();
      newGroupUserIds.forEach(id => formData.append('user_ids[]', id));
      formData.append('is_group', 1);
      formData.append('name', newGroupName);
      if (newGroupAvatar) formData.append('avatar', newGroupAvatar);
      const res = await api.post('/chat', formData);
      setShowNewGroupModal(false);
      setNewGroupName('');
      setNewGroupUserIds([]);
      setNewGroupAvatar(null);
      fetchChats();
    } catch (err) {
      alert('Failed to create group chat');
    }
  };

  return (
    <div className="messaging-content bg-gray-100 min-h-screen">
      <div className="container mx-auto py-4">
        <div className="messaging-container bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex h-[calc(100vh-140px)]">
            {/* Left Sidebar */}
            <div className="flex border-r border-gray-200">
              {/* Tabs on left side */}
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
                {/* Tab title and search */}
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
                      userFollowers?.map(contact => (
                        <div 
                          key={contact?.id} 
                          className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleContactSelect(contact?.follower_client?.id)}
                        >
                          <div className="relative mr-3">
                            <div className="w-10 h-10 rounded-full bg-orange-300 flex items-center justify-center text-white">
                              {contact.follower_client.fname.charAt(0)}
                            </div>
                            {contact.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium truncate">{contact.follower_client?.fname + " " + contact.follower_client.last_name}</h3>
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
                      {userProfileData?.client?.fname.charAt(0)}
                    </div>
                    {currentChat?.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{userProfileData?.client?.fname + " " + userProfileData?.client?.last_name }</h3>
                    <p className="text-xs text-gray-500">
                      {isTyping ? 'Typing...' : currentChat?.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                {/* <div className="flex">
                  <button className="text-gray-400 hover:text-gray-600 mr-3">
                    <FaImage />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <FaSearch />
                  </button>
                </div> */}
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {prevChat?.length > 0 ? (
                  <div className="space-y-4">
                    {prevChat?.map(message => (
                      <div 
                        key={message.id} 
                        className={`flex ${+message.user_id === profile?.client?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        {+message.user_id !== profile?.client?.id && (
                          <div className="w-8 h-8 rounded-full bg-orange-300 flex items-center justify-center text-white mr-2">
                            {message?.user?.display_name?.charAt(0)}
                          </div>
                        )}
                        <div className={`max-w-xs ${+message.user_id === profile?.client?.id ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200'} rounded-lg p-3 shadow-sm`}>
                          {message.file && (
                            <div className={`p-3 mb-2 border rounded-md ${+message.user_id === profile?.client?.id ? 'border-blue-400 bg-blue-400' : 'border-gray-200 bg-gray-50'}`}>
                              <div className="flex items-center">
                                {getFileIcon(message.file.name)}
                                <div className="ml-3 flex-1 min-w-0">
                                  <p className={`text-sm font-medium truncate ${+message.user_id === profile?.client?.id ? 'text-white' : 'text-gray-800'}`}>
                                    {message.file.name}
                                  </p>
                                  <p className={`text-xs ${message.sent ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {formatFileSize(message.file.size)}
                                  </p>
                                </div>
                                <a href="#" className={`ml-2 text-xs px-2 py-1 rounded ${+message.user_id === message.user.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                  Download
                                </a>
                              </div>
                            </div>
                          )}
                          {message.content && <p>{message.content}</p>}
                          
                          <div className={`text-xs mt-1 flex justify-end items-center ${+message.user_id === message.user.id ? 'text-blue-100' : 'text-gray-500'}`}>
                            <span>{message.time}</span>
                            {message.sent && message.read && (
                              <FaCheckCircle className="ml-1 text-xs" />
                            )}
                          </div>
                        </div>
                        {+message.user_id === profile?.client?.id && (
                          <div className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center text-white ml-2">
                            {message?.user?.display_name?.charAt(0) || "N/A"}
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
              
              {/* File Preview (if selected) */}
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
    </div>
  );
};

export default MessagingContent; 