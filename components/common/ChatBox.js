"use client";

import { pusherService } from '@/utility/pusher';
import { getAllChat, getMessage, sendMessage } from '@/views/message/store';
import { getMyProfile } from '@/views/settings/store';
import api from '@/helpers/axios';
import toast from 'react-hot-toast';
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

  // Don't prevent body scroll - allow it to be a floating chat box

  // Initial data fetching
  useEffect(() => {
    dispatch(getAllChat());
    dispatch(getMyProfile());
  }, [dispatch]);

  // Handle new message received via Pusher
  const handleMessageReceived = useCallback((data) => {
    const activeConversationId = currentChat?.id || convarsationData?.id;
    if (activeConversationId && Number(data.conversation_id) === Number(activeConversationId)) {
      dispatch(getMessage({id: Number(activeConversationId)}));
    }
  }, [currentChat?.id, convarsationData?.id, dispatch]);

  // Handle typing event
  // const handleTyping = useCallback((data) => {
  //   if (data.user_id !== profile?.client?.id) {
  //     setIsTyping(true);
  //     setTimeout(() => setIsTyping(false), 3000);
  //   }
  // }, [profile?.client?.id]);

  // Use the custom Pusher hook
  // Use currentChat.id if available (from prop), otherwise use convarsationData.id (from Redux)
  const conversationId = currentChat?.id || convarsationData?.id;
  useChatPusher(
    conversationId ? Number(conversationId) : null,
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
  
      // If we have a pending conversation (exists but no ID), try to find it first
      let chatId = currentChat?.id;
      let messageSent = false; // Track if message was sent via alternative method
      
      if (!chatId && currentChat?._pendingConversation && currentChat?._userData) {
        console.log("Pending conversation detected, trying to find conversation ID...");
        setIsLoading(true);
        
        try {
          // Try to find the conversation by refreshing chat list
          const refreshedChats = await dispatch(getAllChat()).unwrap();
          
          // Helper to find conversation by user ID
          const findConversation = (chats, userId) => {
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
          
          let foundConversation = findConversation(refreshedChats, currentChat._userData.id);
          
          // If not found, try direct API call
          if (!foundConversation) {
            const directResponse = await api.get('/chat');
            const directChats = directResponse.data?.data || directResponse.data || [];
            foundConversation = findConversation(directChats, currentChat._userData.id);
          }
          
          // If still not found, try querying by user_id directly
          if (!foundConversation) {
            try {
              const queryParams = [
                `/chat?user_id=${currentChat._userData.id}`,
                `/chat?participant_id=${currentChat._userData.id}`,
                `/chat/${currentChat._userData.id}`, // Direct conversation by user ID
                `/chat/by-user/${currentChat._userData.id}`, // Alternative format
              ];
              
              for (const query of queryParams) {
                try {
                  const queryResponse = await api.get(query);
                  const queryData = queryResponse.data?.data || queryResponse.data;
                  
                  // Handle single conversation or array
                  if (Array.isArray(queryData) && queryData.length > 0) {
                    foundConversation = queryData[0];
                  } else if (queryData?.id) {
                    foundConversation = queryData;
                  }
                  
                  if (foundConversation) {
                    console.log(`Found conversation via query: ${query}`);
                    break;
                  }
                } catch (queryErr) {
                  continue;
                }
              }
            } catch (queryError) {
              console.log("Query by user_id failed:", queryError);
            }
          }
          
          if (foundConversation?.id) {
            console.log("Found conversation ID:", foundConversation.id);
            chatId = foundConversation.id;
            // Update currentChat with the real conversation
            currentChat = { ...currentChat, id: foundConversation.id };
          } else {
            // Still no ID - try one more time after a short delay
            // Sometimes the conversation appears after the backend processes it
            console.log("Conversation ID not found, waiting and retrying...");
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const retryChats = await dispatch(getAllChat()).unwrap();
            const retryFound = findConversation(retryChats, currentChat._userData.id);
            
            if (retryFound?.id) {
              console.log("Found conversation ID on retry:", retryFound.id);
              chatId = retryFound.id;
              currentChat = { ...currentChat, id: retryFound.id };
            } else {
              // Last resort: Try to send message anyway using alternative methods
              // Since conversation exists, try different approaches:
              // 1. Try to query conversation by user_id directly
              // 2. Try to send message with user_id instead of chatId
              console.log("Conversation ID still not found. Trying alternative send methods...");
              
              // Try alternative endpoint: send message directly to user
              // Some backends support sending messages by user_id
              try {
                // Try to send message using user_id in the endpoint or body
                const alternativeFormData = new FormData();
                alternativeFormData.append('content', message.trim());
                alternativeFormData.append('type', selectedFile ? "file" : "text");
                alternativeFormData.append('user_id', currentChat._userData.id);
                if (selectedFile) {
                  alternativeFormData.append('files[]', selectedFile);
                }
                
                // Try alternative endpoint formats
                const alternativeEndpoints = [
                  `/chat/message/${currentChat._userData.id}`, // Send to user directly
                  `/chat/send-to-user/${currentChat._userData.id}`, // Alternative format
                  `/messages/send`, // Generic send endpoint
                ];
                
                let messageSent = false;
                for (const endpoint of alternativeEndpoints) {
                  try {
                    const altResponse = await api.post(endpoint, alternativeFormData, {
                      headers: {
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json'
                      }
                    });
                    
                    if (altResponse.data?.success !== false) {
                      console.log(`Successfully sent message via alternative endpoint: ${endpoint}`);
                      messageSent = true;
                      
                      // Try to get conversation ID from response
                      const responseData = altResponse.data?.data || altResponse.data;
                      if (responseData?.conversation_id || responseData?.conversation?.id || responseData?.chat_id) {
                        chatId = responseData.conversation_id || responseData.conversation?.id || responseData.chat_id;
                        console.log("Got conversation ID from alternative endpoint:", chatId);
                      }
                      
                      break;
                    }
                  } catch (altErr) {
                    // Try next endpoint
                    continue;
                  }
                }
                
                if (!messageSent) {
                  // If alternative endpoints don't work, try sending to regular endpoint with user_id
                  // Some backends might accept user_id in the body and resolve the conversation
                  console.log("Trying to send message with user_id to regular endpoint...");
                  try {
                    const regularFormData = new FormData();
                    regularFormData.append('content', message.trim());
                    regularFormData.append('type', selectedFile ? "file" : "text");
                    regularFormData.append('user_id', currentChat._userData.id);
                    if (selectedFile) {
                      regularFormData.append('files[]', selectedFile);
                    }
                    
                    // Try sending to a placeholder conversation ID (0 or -1) with user_id in body
                    // Backend might resolve it to the actual conversation
                    const placeholderIds = [0, -1, null];
                    for (const placeholderId of placeholderIds) {
                      try {
                        const endpoint = placeholderId !== null 
                          ? `/chat/${placeholderId}/messages`
                          : `/chat/messages`; // Try without ID
                        
                        const testResponse = await api.post(endpoint, regularFormData, {
                          headers: {
                            'Content-Type': 'multipart/form-data',
                            'Accept': 'application/json'
                          }
                        });
                        
                        if (testResponse.data?.success !== false) {
                          console.log(`Successfully sent message with placeholder ID: ${placeholderId}`);
                          messageSent = true;
                          
                          // Extract conversation ID from response
                          const responseData = testResponse.data?.data || testResponse.data;
                          if (responseData?.conversation_id || responseData?.conversation?.id || responseData?.chat_id) {
                            chatId = responseData.conversation_id || responseData.conversation?.id || responseData.chat_id;
                            console.log("Got conversation ID from placeholder send:", chatId);
                          }
                          break;
                        }
                      } catch (testErr) {
                        // Check if error contains conversation ID
                        const errorData = testErr?.response?.data;
                        if (errorData?.conversation_id || errorData?.conversation?.id || errorData?.chat_id) {
                          chatId = errorData.conversation_id || errorData.conversation?.id || errorData.chat_id;
                          console.log("Got conversation ID from error response:", chatId);
                          // Now try sending with the correct ID
                          break;
                        }
                        continue;
                      }
                    }
                  } catch (testError) {
                    console.log("Placeholder send failed:", testError);
                  }
                  
                  // Final attempt: Query backend one more time after delay
                  if (!messageSent && !chatId) {
                    console.log("All send attempts failed. Trying final delayed query...");
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    const finalChats = await dispatch(getAllChat()).unwrap();
                    const finalFound = findConversation(finalChats, currentChat._userData.id);
                    
                    if (finalFound?.id) {
                      console.log("Found conversation ID on final retry:", finalFound.id);
                      chatId = finalFound.id;
                      currentChat = { ...currentChat, id: finalFound.id };
                    } else {
                      // Still can't find it - this is a backend limitation
                      toast.error('Conversation exists but cannot be accessed. The conversation has no messages yet and the backend filters it from the list. Please try again in a moment, or contact support to fix the backend API.');
                      setIsLoading(false);
                      return;
                    }
                  }
                }
              } catch (altError) {
                console.error("Alternative send methods failed:", altError);
                toast.error('Could not send message. The conversation exists but cannot be accessed. Please try again or contact support.');
                setIsLoading(false);
                return;
              }
            }
          }
        } catch (findError) {
          console.error("Error finding conversation:", findError);
          toast.error('Could not find conversation. Please try again.');
          setIsLoading(false);
          return;
        }
      }
  
      if (!chatId) {
        console.error('No conversation ID available');
        toast.error('No conversation selected');
        return;
      }
  
      // If message was already sent via alternative method, skip regular send
      if (!messageSent) {
        setIsLoading(true);
        try {
          const chatData = {
            chatId: chatId,
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
            
            // Refresh messages and chat list
            await dispatch(getMessage({ id: Number(chatId) }));
            await dispatch(getAllChat());
            
            // Update currentChat if it was pending
            if (currentChat?._pendingConversation) {
              currentChat = { ...currentChat, id: chatId, _pendingConversation: false };
            }
          }
        } catch (error) {
          console.error('Error sending message:', error);
          // Show error message to user
          toast.error(error.message || 'Failed to send message. Please try again.');
          // Restore message if failed
          if (message.trim()) {
            setMessage(message);
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        // Message was sent via alternative method
        // Clear input and refresh
        setMessage("");
        if (selectedFile) {
          setSelectedFile(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        }
        
        // If we got conversation ID, refresh messages and chat list
        if (chatId) {
          try {
            await dispatch(getMessage({ id: Number(chatId) }));
            await dispatch(getAllChat());
            
            // Update currentChat if it was pending
            if (currentChat?._pendingConversation) {
              currentChat = { ...currentChat, id: chatId, _pendingConversation: false };
            }
          } catch (refreshError) {
            console.error("Error refreshing after alternative send:", refreshError);
          }
        }
        
        setIsLoading(false);
        toast.success('Message sent successfully!');
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
    <>
      {/* Backdrop - Click to close - More transparent to see background */}
      <div 
        className="fixed inset-0 bg-opacity-10 z-40"
        onClick={onClose}
      />
      
      {/* Chat Box - Floating Popup, can open from anywhere */}
      <div className="fixed bottom-4 right-4 w-96 h-[400px] bg-white rounded-lg shadow-2xl z-50 flex flex-col md:w-[300px] md:h-[400px]">
        {/* Chat Header */}
        <div className="flex items-center justify-between bg-blue-600 px-4 py-1 rounded-t-lg">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex-shrink-0">
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
            <div className="flex flex-col gap-0 flex-1 min-w-0">
              <p className="text-white font-medium text-sm leading-tight truncate">
                {currentChat ? currentChat?.name : user?.fname ? `${user.fname} ${user.last_name || ''}`.trim() : "Oldclubman User"}
              </p>
              <span className="text-xs text-green-300 leading-tight flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                Online
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white cursor-pointer hover:text-gray-200 transition-colors p-1 hover:bg-blue-700 rounded-full flex-shrink-0"
            aria-label="Close chat"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {currentChat?._pendingConversation ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            <p>Conversation ready. Type a message to start chatting.</p>
          </div>
        ) : (
          prevChat?.map((msg, index) => (
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
              <p className="text-sm break-words">{msg.content}</p>
              {/* <span className="text-[10px] block mt-1 opacity-75">
                {moment(msg.created_at).format('hh:mm a')}
              </span> */}
            </div>
          </div>
        ))
        )}
        <div ref={messagesEndRef} />
      </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="py-1 px-3 bg-white border-t border-gray-200 shadow-lg rounded-b-lg">
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
              className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Attach image"
            >
              <FaImage className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-1 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              type="submit"
              disabled={(!message.trim() && !selectedFile) || isLoading}
              className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 p-2"
              aria-label="Send message"
            >
              <FaPaperPlane className="w-4 h-4" />
            </button>
          </div>
          {selectedFile && (
            <div className="mt-2 text-sm text-gray-600 flex items-center justify-between">
              <span className="truncate flex-1">Selected: {selectedFile.name}</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="ml-2 text-red-500 hover:text-red-700"
                aria-label="Remove file"
              >
                <FaTimes className="w-3 h-3" />
              </button>
            </div>
          )}
        </form>
      </div>
    </>
  );
};

export default ChatBox; 