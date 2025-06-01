"use client";

import { pusherService } from '@/utility/pusher';
import { getAllChat, getMessage, sendMessage } from '@/views/message/store';
import { getMyProfile } from '@/views/settings/store';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FaTimes, FaPaperPlane, FaImage } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useChatPusher } from '../custom/useChatPusher';

const ChatBox = ({ user, currentChat, onClose }) => {
  const { allChat, prevChat, convarsationData } = useSelector(({chat}) => chat);
  const { userFollowers, profile, userProfileData } = useSelector(({settings}) => settings);
const dispatch = useDispatch()
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
  // const handleTyping = useCallback((data) => {
  //   if (data.user_id !== profile?.client?.id) {
  //     setIsTyping(true);
  //     setTimeout(() => setIsTyping(false), 3000);
  //   }
  // }, [profile?.client?.id]);

  // Use the custom Pusher hook
  useChatPusher(
    Number(convarsationData?.id),
    handleMessageReceived,
    // handleTyping
  );

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [prevChat]);

    // Handle sending a message
    const handleSendMessage = async (e) => {
      e.preventDefault(); // Prevent form submission
      if (!message.trim() && !selectedFile) return;
  
      if (!currentChat?.id) {
        console.error('No conversation selected');
        return;
      }
  
      setIsLoading(true);
      try {
        const chatData = {
          chatId: currentChat.id,
          type: selectedFile ? "file" : "text",
          content: message.trim(),
          file: selectedFile
        };
  
        // Clear message input immediately for better UX
        setMessage("");
        
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
          dispatch(getMessage({ id: Number(currentChat.id) }));
        }
      } catch (error) {
        console.error('Error sending message:', error);
        // Show error message to user
        alert(error.message || 'Failed to send message. Please try again.');
        // Restore message if failed
        if (message.trim()) {
          setMessage(message);
        }
      } finally {
        setIsLoading(false);
      }
    };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="fixed bottom-0 right-4 w-80 bg-white rounded-t-lg shadow-lg z-50">
      {/* Chat Header */}
      <div className="flex items-center justify-between bg-blue-600 px-3 py-2  rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src={user?.image ? process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + user?.image : "/common-avator.jpg"}
              alt={user?.fname}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/common-avator.jpg";
              }}
            />
          </div>
          <div className="flex flex-col gap-0">
            <p className="text-white font-medium text-sm leading-tight">{currentChat ? currentChat?.name : "Oldclubman User"}</p>
            <span className="text-xs text-green-400 leading-tight flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              Online
            </span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-white cursor-pointer hover:text-gray-200 transition-colors"
        >
          <FaTimes />
        </button>
      </div>

      {/* Messages Area */}
      <div className="h-96 overflow-y-auto p-4 bg-gray-50">
        {prevChat?.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-3 ${Number(msg?.user_id) === Number(profile?.client?.id) ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-2 py-1 ${
                Number(msg?.user_id) === Number(profile?.client?.id)
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{msg.content}</p>
              {/* <span className="text-[10px] block mt-1 opacity-75">
                {moment(msg.created_at).format('hh:mm a')}
              </span> */}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="py-1 px-3 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaImage />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-1 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={(!message.trim() && !selectedFile) || isLoading}
            className="text-blue-600 hover:text-blue-700 disabled:text-gray-400"
          >
            <FaPaperPlane />
          </button>
        </div>
        {selectedFile && (
          <div className="mt-2 text-sm text-gray-600">
            Selected file: {selectedFile.name}
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChatBox; 