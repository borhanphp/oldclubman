"use client"
import SocialNavbar from "@/components/common/SocialNavbar";
import { ChatBoxProvider } from "@/contexts/ChatBoxContext";
import GlobalChatBox from "@/components/common/GlobalChatBox";

export default function CommonLayout({ children }) {
  return (
    <ChatBoxProvider>
      <div>
        <SocialNavbar />
        <div className=" bg-[#EFF2F6]">
        {children}
        </div>
        <GlobalChatBox />
      </div>
    </ChatBoxProvider>
  );
}
