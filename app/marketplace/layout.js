import SocialNavbar from "@/components/common/SocialNavbar";

export default function MarketplaceLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SocialNavbar />
      <div className="w-full">{children}</div>
    </div>
  );
}


