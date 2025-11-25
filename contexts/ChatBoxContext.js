"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

const ChatBoxContext = createContext();

export const useChatBox = () => {
  const context = useContext(ChatBoxContext);
  if (!context) {
    throw new Error('useChatBox must be used within a ChatBoxProvider');
  }
  return context;
};

export const ChatBoxProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [activeUser, setActiveUser] = useState(null);

  const openChat = useCallback((chat, user = null) => {
    setActiveChat(chat);
    setActiveUser(user);
    setIsOpen(true);
  }, []);

  const openChatByConversationId = useCallback((conversationId, allChats = []) => {
    // Find the conversation from allChats
    const conversation = allChats.find(chat => String(chat.id) === String(conversationId));
    if (conversation) {
      setActiveChat(conversation);
      // Extract user info from conversation
      const otherUser = conversation.users?.[0] || conversation.user || null;
      setActiveUser(otherUser);
      setIsOpen(true);
    } else {
      console.warn('Conversation not found:', conversationId);
    }
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    // Don't clear activeChat/activeUser immediately to allow smooth closing animation
    setTimeout(() => {
      setActiveChat(null);
      setActiveUser(null);
    }, 300);
  }, []);

  const value = {
    isOpen,
    activeChat,
    activeUser,
    openChat,
    openChatByConversationId,
    closeChat,
  };

  return (
    <ChatBoxContext.Provider value={value}>
      {children}
    </ChatBoxContext.Provider>
  );
};

