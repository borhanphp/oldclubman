"use client"
import SocialNavbar from "@/components/common/SocialNavbar";
export default function CommonLayout({ children }) {
  return (
      <div>
        <SocialNavbar />
        <div className="p-5 px-10 bg-[#EFF2F6]">
        {children}
        </div>
      </div>
      
  );
}
