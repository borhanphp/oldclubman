"use client";

import React from 'react';
import SocialNavbar from '@/components/common/SocialNavbar';
import { ChatBoxProvider } from '@/contexts/ChatBoxContext';
import { PostCommentsProvider } from '@/contexts/PostCommentsContext';
import GlobalChatBox from '@/components/common/GlobalChatBox';

const NFCLayout = ({ children }) => {
  return (
    <ChatBoxProvider>
      <PostCommentsProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
          <SocialNavbar />
          <main className="w-full">
            {children}
          </main>
          <GlobalChatBox />
        </div>
      </PostCommentsProvider>
    </ChatBoxProvider>
  );
};

export default NFCLayout;

