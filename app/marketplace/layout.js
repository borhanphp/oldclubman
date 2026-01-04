"use client";

import SocialNavbar from "@/components/common/SocialNavbar";
import { ChatBoxProvider } from "@/contexts/ChatBoxContext";
import { PostCommentsProvider } from "@/contexts/PostCommentsContext";
import GlobalChatBox from "@/components/common/GlobalChatBox";

export default function MarketplaceLayout({ children }) {
  return (
    <ChatBoxProvider>
      <PostCommentsProvider>
        <div className="min-h-screen bg-gray-50">
          <SocialNavbar />
          <div className="w-full">{children}</div>
          <GlobalChatBox />
        </div>
      </PostCommentsProvider>
    </ChatBoxProvider>
  );
}


