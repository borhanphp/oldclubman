"use client";
import React, { useState, useEffect } from 'react';
import { FaSearch, FaEllipsisV } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFollowers, getUserProfile } from '@/views/settings/store';
import { startConversation, getMessage } from '@/views/message/store';
import Link from 'next/link';
import ChatBox from './ChatBox';

const ContactsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showChatBox, setShowChatBox] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const dispatch = useDispatch();
  const { myFollowers, loading, profile } = useSelector(({ settings }) => settings);

  useEffect(() => {
    dispatch(getAllFollowers());
  }, [dispatch]);

  // Transform followers data to match the expected format and filter out current user
  const contacts = myFollowers?.map(follower => ({
    id: follower.id,
    name: `${follower.follower_client?.fname || ''} ${follower.follower_client?.last_name || ''}`.trim(),
    avatar: follower.follower_client?.image 
      ? `${process.env.NEXT_PUBLIC_CLIENT_FILE_PATH}/${follower.follower_client.image}`
      : "/common-avator.jpg",
    isOnline: follower.follower_client?.is_online || false,
    lastSeen: follower.follower_client?.last_seen || "Unknown",
    email: follower.follower_client?.email,
    userId: follower.follower_client?.id
  })).filter(contact => contact.userId !== profile?.client?.id) || [];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle contact click to open chat
  const handleContactClick = async (contact) => {
    try {
      const profileResponse = await dispatch(getUserProfile(contact.userId)).unwrap();
      const userData = profileResponse?.client;
      
      if (!userData) {
        console.error('No user data received');
        return;
      }

      const newChat = {
        is_group: 0,
        name: userData?.fname + " " + userData?.last_name,
        avatar: userData?.image ? process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + userData?.image : "/common-avator.jpg",
        user_ids: userData?.id
      };

      const conversationResponse = await dispatch(startConversation(newChat)).unwrap();
      
      if (conversationResponse?.conversation) {
        setCurrentChat(conversationResponse.conversation);
        setSelectedUser(userData);
        await dispatch(getMessage({ id: conversationResponse.conversation.id }));
        setShowChatBox(true);
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      alert('Failed to start conversation. Please try again.');
    }
  };

  return (
    <div className="h-screen hidden md:block border-l border-gray-200 flex-col overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Chattings</h2>
          <div className="flex items-center space-x-2">
           
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto scroll-smooth" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#CBD5E0 #F7FAFC'
      }}>
        <div className="p-2">
          {loading ? (
            // Loading state
            <div className="flex flex-col items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="text-sm text-gray-500 mt-2">Loading followers...</p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div 
                key={contact.id}
                className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                onClick={() => handleContactClick(contact)}
              >
                {/* Avatar with Online Status */}
                <div className="relative flex-shrink-0 mr-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/common-avator.jpg";
                      }}
                    />
                  </div>
                  {/* Online Status Indicator */}
                  {contact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate hover:text-blue-600 transition-colors">
                      {contact.name || 'Unknown User'}
                    </h3>
                    {contact.isOnline && (
                      <span className="text-xs text-green-600 font-medium">
                        Online
                      </span>
                    )}
                  </div>
                  {contact.email && (
                    <p className="text-xs text-gray-500 truncate">
                      @{contact.email.split('@')[0]}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Empty State */}
        {!loading && filteredContacts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              {searchTerm ? (
                <FaSearch className="w-6 h-6 text-gray-400" />
              ) : (
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              {searchTerm ? 'No followers found' : 'No followers yet'}
            </h3>
            <p className="text-xs text-gray-500 text-center">
              {searchTerm 
                ? 'Try searching with a different term'
                : 'When people follow you, they will appear here'
              }
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{filteredContacts.length} followers</span>
          <span>{filteredContacts.filter(c => c.isOnline).length} online</span>
        </div>
      </div>

      {/* Chat Box */}
      {showChatBox && currentChat && selectedUser && (
        <ChatBox 
          user={selectedUser}
          currentChat={currentChat}
          onClose={() => {
            setShowChatBox(false);
            setCurrentChat(null);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default ContactsList; 