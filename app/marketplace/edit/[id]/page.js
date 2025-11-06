"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();

  // Redirect to create page with ID as query parameter
  useEffect(() => {
    if (params.id) {
      router.replace(`/marketplace/create?id=${params.id}`);
    } else {
      router.replace("/marketplace/selling/listings");
    }
  }, [params.id, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}
