"use client"
import SocialNavbar from "@/components/common/SocialNavbar";
export default function CommonLayout({ children }) {
  return (
      <div>
        <SocialNavbar />
        <div className="md:p-5 md:px-10 bg-[#EFF2F6]">
        {children}
        </div>
      </div>
      
  );
}
