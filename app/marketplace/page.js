"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBell, FaBoxes, FaHome, FaInbox, FaMapMarkerAlt, FaSearch, FaShoppingBag, FaTags } from "react-icons/fa";
import { IoAddCircle } from "react-icons/io5";
import api from "@/helpers/axios";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from 'react-redux';
import { getMyProfile } from '@/views/settings/store';
import { getWalletBalance } from '@/views/wallet/store';
import BodyLayout from "@/components/common/BodyLayout";



import Intro from "@/components/common/Intro";




const Sidebar = ({
  profile,
  giftCardTotalValue,
  search,
  setSearch,
  onCreateListing,
  filters,
  setFilters,
  selectedCategory,
  setSelectedCategory,
  categories,
  onBrowseAll,
}) => {
  return (
    <>

      <aside className="w-full shrink-0 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto shadow-sm">
        {/* Profile Intro with Gradient Banner */}


        <div className="p-5">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Marketplace</h1>
            <p className="text-sm text-gray-500">Find great deals near you</p>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm placeholder-gray-400"
            />
          </div>

          {/* Primary nav */}
          <nav className="space-y-1 mb-6">
            <button
              onClick={onBrowseAll}
              className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <FaShoppingBag className="text-blue-600 group-hover:text-blue-700" />
              <span className="text-gray-700 group-hover:text-gray-900 font-medium">Browse all</span>
            </button>
            {/* <button className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
            <FaBell className="text-gray-500 group-hover:text-gray-700" />
            <span className="text-gray-600 group-hover:text-gray-900">Notifications</span>
          </button>
          <button className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
            <FaInbox className="text-gray-500 group-hover:text-gray-700" />
            <span className="text-gray-600 group-hover:text-gray-900">Inbox</span>
          </button>
          <button className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
            <FaTags className="text-gray-500 group-hover:text-gray-700" />
            <span className="text-gray-600 group-hover:text-gray-900">Buying</span>
          </button> */}
            <Link href="/marketplace/selling/listings" className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group">
              <FaBoxes className="text-gray-500 group-hover:text-gray-700" />
              <span className="text-gray-600 group-hover:text-gray-900">Selling</span>
            </Link>
          </nav>

          {/* Create listing */}
          <button
            onClick={onCreateListing}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-semibold mb-6"
          >
            <IoAddCircle className="text-xl" />
            <span>Create new listing</span>
          </button>

          {/* Filters Section */}
          <div className="space-y-6 border-t border-gray-200 pt-6">
            {/* Categories */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
              <select
                value={filters.category_id || ""}
                onChange={(e) => setFilters({ ...filters, category_id: e.target.value || undefined })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23374151%22%20d%3D%22M6%209L1%204h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name || cat.title || cat.category_name || `Category ${cat.id}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filters */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-2">
                <FaMapMarkerAlt className="text-gray-500" />
                <span>Location</span>
              </label>
              <div className="space-y-2">
                <select
                  value={filters.country_id || ""}
                  onChange={(e) => setFilters({ ...filters, country_id: e.target.value || undefined, state_id: undefined, city_id: undefined })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Country</option>
                  <option value="18">Bangladesh</option>
                </select>
                <select
                  value={filters.state_id || ""}
                  onChange={(e) => setFilters({ ...filters, state_id: e.target.value || undefined, city_id: undefined })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                  disabled={!filters.country_id}
                >
                  <option value="">Select State</option>
                </select>
                <select
                  value={filters.city_id || ""}
                  onChange={(e) => setFilters({ ...filters, city_id: e.target.value || undefined })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                  disabled={!filters.state_id}
                >
                  <option value="">Select City</option>
                </select>
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Price Range</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    type="number"
                    value={filters.min_price || ""}
                    onChange={(e) => setFilters({ ...filters, min_price: e.target.value || undefined })}
                    placeholder="Min"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={filters.max_price || ""}
                    onChange={(e) => setFilters({ ...filters, max_price: e.target.value || undefined })}
                    placeholder="Max"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Condition</label>
              <select
                value={filters.condition || ""}
                onChange={(e) => setFilters({ ...filters, condition: e.target.value || undefined })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Conditions</option>
                <option value="1">New</option>
                <option value="2">Like New</option>
                <option value="3">Good</option>
                <option value="4">Fair</option>
                <option value="5">For Parts</option>
              </select>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Availability</label>
              <select
                value={filters.availability || ""}
                onChange={(e) => setFilters({ ...filters, availability: e.target.value || undefined })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All</option>
                <option value="1">In Stock</option>
                <option value="2">Out of Stock</option>
                <option value="3">Available Soon</option>
              </select>
            </div>

            {/* Meetup Preferences */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Meetup Options</label>
              <div className="space-y-2.5">
                <label className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group">
                  <input
                    type="checkbox"
                    checked={filters.public_meetup === "1"}
                    onChange={(e) => setFilters({ ...filters, public_meetup: e.target.checked ? "1" : undefined })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">Public Meetup</span>
                </label>
                <label className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group">
                  <input
                    type="checkbox"
                    checked={filters.door_pickup === "1"}
                    onChange={(e) => setFilters({ ...filters, door_pickup: e.target.checked ? "1" : undefined })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">Door Pickup</span>
                </label>
                <label className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group">
                  <input
                    type="checkbox"
                    checked={filters.door_dropoff === "1"}
                    onChange={(e) => setFilters({ ...filters, door_dropoff: e.target.checked ? "1" : undefined })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">Door Dropoff</span>
                </label>
              </div>
            </div>

            {/* SKU Search */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">SKU</label>
              <input
                type="text"
                value={filters.sku || ""}
                onChange={(e) => setFilters({ ...filters, sku: e.target.value || undefined })}
                placeholder="Enter SKU code"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
              />
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearch("");
                setFilters({});
                setSelectedCategory("");
              }}
              className="w-full py-2.5 px-4 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border border-gray-200"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </aside>
    </>

  );
};

const ListingCard = ({ item }) => {
  // Get latest image from files array or use default
  let imageUrl = "/common-avator.jpg";
  if (item?.files && item?.files?.length > 0) {
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
      imageUrl = cleanBase ? `${cleanBase}/sale_post/${cleanPath}` : `/public/uploads/sale_post/${cleanPath}`;
    }
  }

  // Format price
  const price = item.price ? `৳${parseFloat(item.price).toLocaleString()}` : "FREE";

  // Get location from nested objects
  const location = item.city?.name
    ? `${item.city.name}${item.state?.name ? `, ${item.state.name}` : ''}`
    : item.state?.name || item.country?.name || "Location not specified";

  return (
    <Link
      href={`/marketplace/listing/${item.id ?? ""}`}
      className="block rounded-lg overflow-hidden shadow hover:shadow-sm transition bg-white"
    >
      <div className="relative w-full h-48 bg-gray-100">
        <Image
          src={imageUrl}
          alt={item.title || "Listing"}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-3">
        <div className="font-semibold">{price}</div>
        <div className="text-sm text-gray-700 line-clamp-1">{item.title}</div>
        <div className="text-xs text-gray-500">{location}</div>
        {item.category?.name && (
          <div className="text-xs text-blue-600 mt-1">{item.category.name}</div>
        )}
      </div>
    </Link>
  );
};

const ListingGrid = ({ items, loading }) => {
  return (
    <div className="flex-1">
      <h2 className="text-xl font-semibold mb-2">Today&apos;s picks</h2>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-72 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {items.map((it) => (
            <ListingCard key={it.id} item={it} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function MarketplacePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { profile } = useSelector(({ settings }) => settings);
  const { giftCardTotalValue } = useSelector(({ wallet }) => wallet);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(getMyProfile());
    dispatch(getWalletBalance());
  }, [dispatch]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/sale_post_category");
        if (response.data && response.data.data) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Build query parameters
  const query = useMemo(() => {
    const params = {
      page: 1,
    };

    // Add search term
    if (search && search.trim()) {
      params.search = search.trim();
    }

    // Add all filter parameters
    if (filters.category_id) params.category_id = filters.category_id;
    if (filters.country_id) params.country_id = filters.country_id;
    if (filters.state_id) params.state_id = filters.state_id;
    if (filters.city_id) params.city_id = filters.city_id;
    if (filters.min_price) params.min_price = filters.min_price;
    if (filters.max_price) params.max_price = filters.max_price;
    if (filters.condition) params.condition = filters.condition;
    if (filters.availability) params.availability = filters.availability;
    if (filters.sku) params.sku = filters.sku;
    if (filters.public_meetup) params.public_meetup = filters.public_meetup;
    if (filters.door_pickup) params.door_pickup = filters.door_pickup;
    if (filters.door_dropoff) params.door_dropoff = filters.door_dropoff;

    return params;
  }, [search, filters]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await api
        .get("/sale_post/20", { params: query })
        .catch(() => ({ data: { success: false, data: { data: [] } } }));

      // Handle paginated response structure: res.data.data.data
      const data = res?.data?.success && res?.data?.data?.data?.length
        ? res.data.data.data
        : res?.data?.data?.length
          ? res.data.data
          : [];

      console.log("Fetched listings with filters:", query, data);
      setItems(data);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchListings, 300);
    return () => clearTimeout(t);
  }, [query]);

  const onCreateListing = () => router.push("/marketplace/create");

  const handleBrowseAll = () => {
    // Clear all filters and search to show all products
    setSearch("");
    setFilters({});
    setSelectedCategory("");
  };

  return (
    <BodyLayout>
      <div className="min-h-screen bg-gray-50 rounded-lg overflow-hidden">

        <div className="flex">

          <div className="w-full lg:w-1/4 mb-1 lg:mb-0 lg:pr-2">
            <Intro />

          </div>

          <main className="flex w-full lg:w-3/4">
            <div>
              <Sidebar
                profile={profile}
                giftCardTotalValue={giftCardTotalValue}
                search={search}
                setSearch={setSearch}
                onCreateListing={onCreateListing}
                filters={filters}
                setFilters={setFilters}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                categories={categories}
                onBrowseAll={handleBrowseAll}
              />
            </div>
            <div className="px-6 py-4">
              <ListingGrid items={items} loading={loading} />
            </div>
          </main>
        </div>
      </div>
    </BodyLayout>
  );
}


