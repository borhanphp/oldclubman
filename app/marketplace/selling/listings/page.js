"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  FaArrowLeft,
  FaChartBar,
  FaTags,
  FaBullhorn,
  FaChartLine,
  FaUser,
  FaSearch,
  FaShare,
  FaEllipsisH,
  FaCheck,
  FaList,
  FaTh,
  FaInfoCircle,
  FaEdit,
} from "react-icons/fa";
import api from "@/helpers/axios";
import moment from "moment";

export default function YourListingsPage() {
  const router = useRouter();
  const { profile } = useSelector(({ settings }) => settings);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showBanner, setShowBanner] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleDelete = async (itemId) => {
    // Confirm deletion
    const confirmed = window.confirm("Are you sure you want to delete this listing? This action cannot be undone.");
    if (!confirmed) return;

    try {
      setDeletingId(itemId);
      const response = await api.post(`/sale_post/delete/${itemId}`);

      if (response.data?.success || response.status === 200) {
        // Remove the deleted item from the list
        setListings((prev) => prev.filter((item) => item.id !== itemId));
        alert("Listing deleted successfully!");
      } else {
        alert("Failed to delete listing. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert(error?.response?.data?.message || "Failed to delete listing. Please try again.");
    } finally {
      setDeletingId(null);
      setOpenMenuId(null);
    }
  };

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      // Fetch user's own listings from /my_sale_post API
      const response = await api.get("/my_sale_post").catch(() => ({ data: { success: false, data: { post: { data: [] } } } }));

      // Parse response: response.data.data.post.data
      const data = response.data?.success && response.data?.data?.post?.data?.length
        ? response.data.data.post.data
        : [];

      console.log("Fetched seller listings:", data);
      setListings(data);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (item) => {
    if (item.files && item.files.length > 0) {
      // Sort files by id descending to get the latest one (highest id = latest)
      const sortedFiles = [...item.files].sort((a, b) => {
        const idA = a.id || 0;
        const idB = b.id || 0;
        return idB - idA; // Descending order (highest id first)
      });
      const file = sortedFiles[0];
      const filePath = file.file_path || file.path || file.url || file.file_url || '';
      if (filePath) {
        // Build image URL using NEXT_PUBLIC_FILE_PATH/sale_post + file_path
        const base = process.env.NEXT_PUBLIC_FILE_PATH || '';
        const cleanBase = base ? base.replace(/\/+$/, '') : '';
        const cleanPath = String(filePath || '').replace(/^\/+/, '');
        return cleanBase ? `${cleanBase}/sale_post/${cleanPath}` : `/public/uploads/sale_post/${cleanPath}`;
      }
    }
    return "/common-avator.jpg";
  };

  const formatPrice = (price) => {
    if (!price) return "FREE";
    return `BDT${parseFloat(price).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return moment(dateString).format("M/D");
  };

  const activeListings = listings.filter(item => item.status === 1 || item.status === 2).length;

  const profileImage = profile?.client?.image
    ? `${process.env.NEXT_PUBLIC_FILE_PATH}${profile.client.image.startsWith('/') ? '' : '/'}${profile.client.image}`
    : "/common-avator.jpg";

  const profileName = profile?.client?.fname && profile?.client?.last_name
    ? `${profile.client.fname} ${profile.client.last_name}`
    : profile?.client?.display_name || "Seller";

  const filteredListings = listings.filter((item) => {
    const matchesSearch = !searchQuery || item.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "active" && (item.status === 1 || item.status === 2)) ||
      (statusFilter === "draft" && item.status === 1) ||
      (statusFilter === "sold" && item.status === 3);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto sticky top-0">
          <div className="p-4">
            <div className="mb-6">
              <Link href="/marketplace" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-2">
                <FaArrowLeft className="w-3 h-3" />
                <span>Marketplace</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Selling</h1>
            </div>

            <button
              onClick={() => router.push("/marketplace/create")}
              className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-6"
            >
              + Create new listing
            </button>

            <nav className="space-y-1 mb-6">
              <Link
                href="/marketplace/selling"
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
              >
                <FaChartBar className="w-4 h-4" />
                <span className="text-sm">Seller dashboard</span>
              </Link>
              <Link
                href="/marketplace/selling/listings"
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 font-medium"
              >
                <FaTags className="w-4 h-4" />
                <span className="text-sm">Your listings</span>
              </Link>
              {/* <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
                <FaBullhorn className="w-4 h-4" />
                <span className="text-sm">Announcements</span>
              </button>
              <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
                <FaChartLine className="w-4 h-4" />
                <span className="text-sm">Insights</span>
              </button> */}
              {/* <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <span className="text-sm">Marketplace profile</span>
              </button> */}
            </nav>

            <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors mb-6">
              Manage listings
            </button>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-900">Filters</span>
                <button
                  onClick={() => {
                    setSortBy("recent");
                    setStatusFilter("all");
                    setSearchQuery("");
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="recent">Most recent</option>
                    <option value="oldest">Oldest first</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="price_low">Price: Low to High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Meta Verified Banner */}
          {/* {showBanner && (
            <div className="bg-blue-50 border-b border-blue-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                  <FaCheck className="text-white text-sm" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900 mb-0.5">Build trust with your buyers</div>
                  <div className="text-sm text-gray-600">Subscribe to Meta Verified for a verified badge and more benefits.</div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm whitespace-nowrap">
                  Sign up
                </button>
              </div>
              <button
                onClick={() => setShowBanner(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors ml-4 shrink-0"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )} */}

          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your listings</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search your listings"
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  />
                </div>
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${viewMode === "list" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"} transition-colors`}
                  >
                    <FaList className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${viewMode === "grid" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"} transition-colors`}
                  >
                    <FaTh className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-4 border border-gray-200 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-200 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredListings.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
                <FaTags className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings found</h3>
                <p className="text-gray-600 mb-4">Start selling by creating your first listing</p>
                <button
                  onClick={() => router.push("/marketplace/create")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Create new listing
                </button>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-3 gap-4" : "space-y-4"}>
                {filteredListings.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow ${viewMode === "list" ? "flex gap-4 p-4" : "p-4"
                      }`}
                  >
                    <div className={`relative ${viewMode === "list" ? "w-24 h-24 shrink-0" : "w-full h-48 mb-3"} bg-gray-100 rounded overflow-hidden`}>
                      <Image
                        src={getImageUrl(item)}
                        alt={item.title || "Listing"}
                        fill
                        sizes={viewMode === "list" ? "96px" : "33vw"}
                        className="object-cover"
                      />
                    </div>
                    <div className={viewMode === "list" ? "flex-1" : ""}>
                      <div className="mb-3">
                        <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <div className="text-lg font-bold text-gray-900 mb-1">{formatPrice(item.price)}</div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className={item.availability === 1 ? "text-green-600 font-medium" : "text-gray-600"}>
                            {item.availability === 1 ? "In stock" : item.availability === 2 ? "Out of stock" : "Available soon"}
                          </span>
                          <span>Listed on {formatDate(item.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <span>Listed on Marketplace - {item.view_count || 0} clicks on listing</span>
                          <FaInfoCircle className="w-3 h-3" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          <FaCheck className="w-3 h-3" />
                          Mark out of stock
                        </button>
                        <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                          <FaShare className="w-3 h-3" />
                        </button>
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                          >
                            <FaEllipsisH className="w-3 h-3" />
                          </button>
                          {openMenuId === item.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenuId(null)}
                              />
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                                <button
                                  onClick={() => {
                                    router.push(`/marketplace/create?id=${item.id}`);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <FaEdit className="w-3 h-3" />
                                  Edit listing
                                </button>
                                <button
                                  onClick={() => {
                                    handleDelete(item.id);
                                  }}
                                  disabled={deletingId === item.id}
                                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {deletingId === item.id ? "Deleting..." : "Delete listing"}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 bg-white border-l border-gray-200 h-screen overflow-y-auto sticky top-0">
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketplace profile</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img
                    src={profileImage}
                    alt={profileName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/common-avator.jpg";
                    }}
                  />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{profileName}</div>
                  <div className="text-sm text-gray-600">{activeListings} Active Listing{activeListings !== 1 ? 's' : ''}</div>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => router.push("/marketplace/create")}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  + Create new listing
                </button>
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                  See Marketplace profile
                </button>
              </div>
            </div>
            {/* <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Need help?</h3>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
                <FaList className="w-4 h-4" />
                <span>See all help topics</span>
              </button>
            </div> */}
          </div>
        </aside>
      </div>
    </div>
  );
}

