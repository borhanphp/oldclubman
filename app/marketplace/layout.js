"use client";

import SocialNavbar from "@/components/common/SocialNavbar";
import { ChatBoxProvider } from "@/contexts/ChatBoxContext";
import GlobalChatBox from "@/components/common/GlobalChatBox";

export default function MarketplaceLayout({ children }) {
  return (
    <ChatBoxProvider>
      <div className="min-h-screen bg-gray-50">
        <SocialNavbar />
        <div className="w-full">{children}</div>
        <GlobalChatBox />
      </div>
    </ChatBoxProvider>
  );
}


