"use client"
import SocialNavbar from "@/components/common/SocialNavbar";
export default function CommonLayout({ children }) {
  return (
      <div>
        <SocialNavbar />
        <div className=" bg-[#EFF2F6]">
        {children}
        </div>
      </div>
      
  );
}
