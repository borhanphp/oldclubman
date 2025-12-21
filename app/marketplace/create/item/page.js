"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { FaCamera, FaGlobe, FaTrash, FaMobileAlt, FaMapMarkerAlt, FaChevronUp, FaChevronDown, FaLock } from "react-icons/fa";
import api from "@/helpers/axios";

function CreateListingContent() {
  const { profile, profileData } = useSelector(({ settings }) => settings);
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  // Check if we're in edit mode (ID from URL params or query string)
  const editId = params?.id || searchParams?.get('id') || null;
  const isEditMode = !!editId;

  const [loadingListing, setLoadingListing] = useState(isEditMode);
  const [images, setImages] = useState([]); // {file, url, existingId}
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("1");
  const [condition, setCondition] = useState("");
  const [description, setDescription] = useState("");
  const [availability, setAvailability] = useState("in_stock");
  const [productTags, setProductTags] = useState("");
  const [sku, setSku] = useState("");
  const [location, setLocation] = useState("Singapore");
  
  // Get location IDs from logged-in user's profile
  const countryId = useMemo(() => {
    return profileData?.current_country_id || profileData?.from_country_id || profile?.client?.current_country_id || profile?.client?.from_country_id || 1;
  }, [profileData, profile]);

  const stateId = useMemo(() => {
    return profileData?.current_state_id || profileData?.from_state_id || profile?.client?.current_state_id || profile?.client?.from_state_id || 1;
  }, [profileData, profile]);

  const cityId = useMemo(() => {
    return profileData?.from_city_id || profile?.client?.from_city_id || 1;
  }, [profileData, profile]);
  const [showMoreDetails, setShowMoreDetails] = useState(true);
  const [meetupPreferences, setMeetupPreferences] = useState({
    publicMeetup: true, // Default to 1 (Yes) as per API structure
    doorPickup: true,   // Default to 1 (Yes) as per API structure
    doorDropoff: true,  // Default to 1 (Yes) as per API structure
  });
  const [hideFromFriends, setHideFromFriends] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const fileInputRef = useRef(null);

  console.log('category',category)
  console.log('categories',categories)

  const onFilesSelected = useCallback((files) => {
    const lim = 10 - images.length;
    const slice = Array.from(files || []).slice(0, lim);
    const mapped = slice.map((file) => ({ file, url: URL.createObjectURL(file), existingId: null }));
    setImages((prev) => {
      const newImages = [...prev, ...mapped];
      // Set selected image to first image if no images existed before
      if (prev.length === 0 && mapped.length > 0) {
        setSelectedImageIndex(0);
      }
      return newImages;
    });
  }, [images.length]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    if (e.dataTransfer?.files?.length) onFilesSelected(e.dataTransfer.files);
  }, [onFilesSelected]);

  const removeImage = (idx) => {
    setImages((prev) => {
      const next = [...prev];
      const item = next[idx];
      // Only revoke URL if it's a new file (not existing image)
      if (item?.url && !item.existingId) URL.revokeObjectURL(item.url);
      next.splice(idx, 1);
      return next;
    });
    
    // Adjust selected index if needed
    setSelectedImageIndex((currentIdx) => {
      if (images.length <= 1) {
        return 0;
      } else if (currentIdx >= images.length - 1) {
        return images.length - 2;
      } else if (idx < currentIdx) {
        return currentIdx - 1;
      }
      return currentIdx;
    });
  };

  // Load listing data if in edit mode
  useEffect(() => {
    const fetchListing = async () => {
      if (!editId) return;
      
      try {
        setLoadingListing(true);
        const response = await api.get(`/single_sale_post/${editId}`);
        const listingData = response.data?.success 
          ? response.data.data 
          : response.data?.data 
          ? response.data.data 
          : response.data;

        if (listingData) {
          // Pre-fill form fields
          setTitle(listingData.title || "");
          setPrice(listingData.price || "");
          setCategory(listingData.category_id?.toString() || "1");
          // Convert condition number to string format
          const conditionMap = { "1": "new", "2": "like_new", "3": "good", "4": "fair", "5": "for_parts" };
          setCondition(conditionMap[listingData.condition?.toString()] || "");
          setDescription(listingData.description || "");
          setAvailability(listingData.availability === 1 ? "in_stock" : listingData.availability === 2 ? "out_of_stock" : "available_soon");
          setSku(listingData.sku || "");
          setProductTags(listingData.tags?.map(t => t.name).filter(Boolean).join(", ") || "");
          setHideFromFriends(listingData.hide_from_friends === 1);
          setMeetupPreferences({
            publicMeetup: listingData.public_meetup === 1,
            doorPickup: listingData.door_pickup === 1,
            doorDropoff: listingData.door_dropoff === 1,
          });

          // Load existing images
          if (listingData.files && listingData.files.length > 0) {
            const existingImages = listingData.files.map((file) => {
              const base = process.env.NEXT_PUBLIC_FILE_PATH || '';
              const cleanBase = base ? base.replace(/\/+$/, '') : '';
              const cleanPath = String(file.file_path || '').replace(/^\/+/, '');
              const imageUrl = cleanBase ? `${cleanBase}/sale_post/${cleanPath}` : `/public/uploads/sale_post/${cleanPath}`;
              return {
                existingId: file.id,
                url: imageUrl,
                file: null, // Existing image, no file object
              };
            });
            setImages(existingImages);
            setSelectedImageIndex(0);
          }
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
        alert("Failed to load listing. Please try again.");
        router.push("/marketplace/selling/listings");
      } finally {
        setLoadingListing(false);
      }
    };

    if (editId) {
      fetchListing();
    }
  }, [editId, router]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await api.get("/sale_post_category");
        if (response.data && response.data.data) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const canProceed = useMemo(() => {
    return title.trim().length > 0 && price !== "" && images.length > 0 && category && condition;
  }, [title, price, images.length, category, condition]);

  // Get category ID from selected category value (which is now the ID)
  const getCategoryId = (categoryValue) => {
    return categoryValue ? parseInt(categoryValue) : null;
  };

  const getConditionId = (conditionValue) => {
    const conditionMap = {
      new: 1,
      like_new: 2,
      good: 3,
      fair: 4,
      for_parts: 5,
    };
    return conditionMap[conditionValue] || 1;
  };

  const getAvailabilityId = (availabilityValue) => {
    const availabilityMap = {
      in_stock: 1,
      out_of_stock: 2,
      available_soon: 3,
    };
    return availabilityMap[availabilityValue] || 1;
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    // Format: YYYY-MM-DD
    return dateString;
  };

  const handleSubmit = async () => {
    if (!canProceed) return;

    try {
      setIsSubmitting(true);

      // Create FormData
      const formData = new FormData();

      // Dynamic fields only: title, price, photo (photos[]), category, condition
      formData.append("title", title.trim());
      formData.append("price", price);
      
      const categoryId = getCategoryId(category);
      if (category) {
        formData.append("category_id", category);
      }
      
      formData.append("condition", getConditionId(condition));

      // Add photos using files[index] format (same as create page)
      // In edit mode, only send new files (existing images are kept on server)
      const newImages = images.filter(img => img.file && img.file instanceof File);
      
      if (!isEditMode && newImages.length === 0) {
        alert("Please add at least one photo");
        setIsSubmitting(false);
        return;
      }
      
      // In edit mode, we can have existing images without files
      // Only append new files to FormData
      newImages.forEach((img) => {
        formData.append("files[]", img.file);
      });

      // Static/default fields - use default values from API structure if empty
      formData.append("type", "1");
      formData.append("description", description.trim() || "");
      formData.append("availability", getAvailabilityId(availability) || 1);
      formData.append("sku", sku.trim() || "");
      // Use location from logged-in user's profile
      formData.append("country_id", category);
      formData.append("state_id", category);
      formData.append("city_id", category);
      // Meetup preferences - default to 1 (Yes) as per API structure
      formData.append("public_meetup", meetupPreferences.publicMeetup ? 1 : 0);
      formData.append("door_pickup", meetupPreferences.doorPickup ? 1 : 0);
      formData.append("door_dropoff", meetupPreferences.doorDropoff ? 1 : 0);
      formData.append("hide_from_friends", hideFromFriends ? 1 : 0);
      formData.append("status", 1);

      // Add dates with defaults from API structure
      const today = new Date();
      const publishedDate = formatDate(today.toISOString().split('T')[0]) || "2025-11-01";
      const unpublishedDate = formatDate("2025-11-05");
      
      formData.append("published_at", publishedDate);
      formData.append("unpublished_at", unpublishedDate);

      // Add tags - empty string if not provided
      formData.append("tags", productTags.trim() || "");

      // Debug: Log FormData contents
      console.log("=== User Profile Location ===");
      console.log("countryId from profile:", countryId);
      console.log("stateId from profile:", stateId);
      console.log("cityId from profile:", cityId);
      console.log("profileData:", profileData);
      console.log("profile?.client:", profile?.client);
      
      console.log("=== FormData being sent ===");
      const formDataObj = {};
      for (let pair of formData.entries()) {
        const key = pair[0];
        const value = pair[1];
        if (value instanceof File) {
          formDataObj[key] = `File: ${value.name} (${value.size} bytes)`;
        } else {
          formDataObj[key] = value;
        }
        console.log(`${key}:`, value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value);
      }
      console.log("=== FormData Object ===", formDataObj);
      console.log("=== Full FormData ===", formData);

      // Make API call - create or update based on mode
      let response;
      if (isEditMode) {
        // Update existing listing
        response = await api.post(`/sale_post/update/${editId}`, formData).catch(async (error) => {
          // Try PUT method if POST fails
          if (error.response?.status === 404 || error.response?.status === 405) {
            return await api.put(`/sale_post/${editId}`, formData);
          }
          throw error;
        });
        console.log('Update response', response);
      } else {
        // Create new listing
        response = await api.post("/sale_post/store", formData);
        console.log('Create response', response);
      }

      if (response.data) {
        // Success - redirect to seller listings
        alert(isEditMode ? "Listing updated successfully!" : "Listing created successfully!");
        router.push("/marketplace/selling/listings");
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} listing:`, error);
      alert(error?.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} listing. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const seller = useMemo(() => ({
    name: `${profile?.client?.fname || ""} ${profile?.client?.last_name || ""}`.trim() || "Seller",
    image: (process.env.NEXT_PUBLIC_CLIENT_FILE_PATH && profile?.client?.image)
      ? `${process.env.NEXT_PUBLIC_CLIENT_FILE_PATH}${profile?.client?.image?.startsWith('/') ? '' : '/'}${profile?.client?.image}`
      : "/common-avator.jpg",
  }), [profile]);

  // Show loading state while fetching listing data in edit mode
  if (loadingListing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading listing...</p>
        </div>
      </div>
    );
  }

  const ProfileSidebar = () => {
    return (
      <div className="w-full lg:w-1/4 mb-1 lg:mb-0 lg:pr-2">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex flex-col items-center pt-6">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-blue-100 mb-5">
              <img 
                src={profile?.client?.image ? process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + profile?.client?.image : "/common-avator.jpg"}
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
            </div>
            
            <h2 className="text-xl font-bold mb-5">
              {profile?.client ? profile?.client?.fname + " " + profile?.client?.last_name : "Loading..."}
            </h2>
            
            <div className="flex justify-between items-center w-full px-8 border-b border-b-gray-100 pb-5">
              <div className="text-center">
                <div className="font-bold text-lg">{profile?.post?.total || 0}</div>
                <div className="text-gray-500 text-sm">Post</div>
              </div>
              
              <div className="h-10 w-px bg-gray-200"></div>
              
              <div className="text-center relative">
                <div className="font-bold text-lg">{profile?.followers || 0}</div>
                <div className="text-gray-500 text-sm">Followers</div>
              </div>
              
              <div className="h-10 w-px bg-gray-200"></div>
              
              <div className="text-center">
                <div className="font-bold text-lg">{profile?.following || 0}</div>
                <div className="text-gray-500 text-sm">Following</div>
              </div>
            </div>
            
            <Link href={`/${profile?.client?.id}`} className="w-full py-2 text-blue-500 text-center font-medium hover:bg-blue-50">
              View Profile
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="mx-auto md:p-2 md:px-5">
        <div className="flex flex-wrap">
          {/* Profile Sidebar */}
          {/* <ProfileSidebar /> */}
          
          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            <div className="flex h-screen rounded-lg overflow-hidden bg-white">
              <div className="flex gap-0 h-full w-full">
                {/* Left controls */}
                <aside className="w-[400px] shrink-0 bg-white h-full overflow-y-auto">
          <div className="p-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Marketplace</div>
                <div className="text-xl font-bold text-gray-900">{isEditMode ? "Edit listing" : "Item for sale"}</div>
              </div>
              <button className="text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-1.5 rounded-lg font-medium">
                Save draft
              </button>
            </div>

            {/* Seller Info */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                <img src={seller.image} alt={seller.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900">{seller.name || "You"}</div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  Listing to Marketplace <FaGlobe className="text-xs" /> Public
                </div>
              </div>
            </div>

            {/* Photos Section */}
            <div className="mb-4" onDrop={onDrop} onDragOver={(e) => e.preventDefault()}>
              <div className="text-xs text-gray-500 mb-3">
                Photos • {images.length} / 10 - You can add up to 10 photos. <span className="text-red-500">*Required</span>
              </div>

              {images.length === 0 ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-64 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 flex flex-col items-center justify-center transition-colors"
                  title="Add photos"
                >
                  <div className="w-16 h-16 mb-3 flex items-center justify-center">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="8" y="8" width="20" height="20" rx="2" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1.5"/>
                      <rect x="28" y="8" width="20" height="20" rx="2" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1.5"/>
                      <rect x="8" y="28" width="20" height="20" rx="2" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1.5"/>
                      <rect x="28" y="28" width="20" height="20" rx="2" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1.5"/>
                      <path d="M48 20H56V28" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M52 16V32" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="text-base font-semibold text-gray-700 mb-1">Add photos</div>
                  <div className="text-xs text-gray-500">or drag and drop</div>
                </button>
              ) : (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-full h-24 bg-gray-100 rounded overflow-hidden">
                      <Image src={img.url} alt="photo" fill sizes="120px" className="object-cover" />
                      <button
                        className="absolute top-1 right-1 bg-white/90 hover:bg-white rounded p-1 shadow-sm"
                        type="button"
                        onClick={() => removeImage(idx)}
                        title="Remove"
                      >
                        <FaTrash className="text-red-600 text-xs" />
                      </button>
                    </div>
                  ))}
                  {images.length < 10 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-24 hover:bg-gray-50"
                      title="Add photos"
                    >
                      <FaCamera className="text-gray-400" />
                    </button>
                  )}
                </div>
              )}

              {/* Phone Upload Section */}
              <div className="mt-3 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-gray-600">
                    <FaMobileAlt />
                  </div>
                  <div className="text-sm text-gray-700">
                    Upload photos directly from your phone.{" "}
                    <button className="text-blue-600 hover:underline font-medium" type="button">
                      Learn more
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-1.5 rounded-lg font-medium text-gray-700 whitespace-nowrap"
                >
                  Try it
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onFilesSelected(e.target.files)}
              />
            </div>

            {/* Required Fields Section */}
            <div className="mb-3">
              <div className="text-sm font-bold text-gray-900 mb-1">Required</div>
              <div className="text-xs text-gray-500 mb-4">Be as descriptive as possible.</div>

              <div className="space-y-3">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Title"
                />

                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value.replace(/[^0-9.]/g, ""))}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Price"
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={loadingCategories}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23374151%22%20d%3D%22M6%209L1%204h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="" className="text-gray-400">
                    {loadingCategories ? "Loading categories..." : "Category"}
                  </option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat?.id}>
                      {cat.name || cat.title || cat.category_name || `Category ${cat.id}`}
                    </option>
                  ))}
                </select>

                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23374151%22%20d%3D%22M6%209L1%204h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat"
                >
                  <option value="" className="text-gray-400">Condition</option>
                  <option value="new">New</option>
                  <option value="like_new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="for_parts">For parts</option>
                </select>
              </div>
            </div>

            {/* More Details Section */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setShowMoreDetails(!showMoreDetails)}
                className="w-full flex items-center justify-between mb-2"
              >
                <div className="text-left">
                  <div className="text-sm font-bold text-gray-900">More details</div>
                  <div className="text-xs text-gray-500">Attract more interest by including more details.</div>
                </div>
                {showMoreDetails ? (
                  <FaChevronUp className="text-gray-500" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}
              </button>

              {showMoreDetails && (
                <div className="space-y-3">
                  {/* Description */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Describe your item..."
                    />
                  </div>

                  {/* Availability */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Availability</label>
                    <select
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23374151%22%20d%3D%22M6%209L1%204h10z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[right_12px_center] bg-no-repeat"
                    >
                      <option value="in_stock">List as In Stock</option>
                      <option value="out_of_stock">Out of Stock</option>
                      <option value="available_soon">Available Soon</option>
                    </select>
                  </div>

                  {/* Product Tags */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Product tags</label>
                    <input
                      value={productTags}
                      onChange={(e) => {
                        const tags = e.target.value.split(',').slice(0, 20).join(',');
                        setProductTags(tags);
                      }}
                      className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="tag1, tag2, tag3..."
                    />
                    <div className="text-xs text-gray-500 mt-1">Optional. Limit:20</div>
                  </div>

                  {/* SKU */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">SKU</label>
                    <input
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full h-12 border border-gray-300 rounded-lg px-4 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="SKU"
                    />
                    <div className="text-xs text-gray-500 mt-1">Optional. Only visible to you</div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Location</label>
                    <div className="flex items-center gap-2 h-12 border border-gray-300 rounded-lg px-4 bg-gray-50">
                      <FaMapMarkerAlt className="text-gray-500" />
                      <span className="text-sm text-gray-700 flex-1">{location}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newLocation = prompt("Enter location:", location);
                          if (newLocation) setLocation(newLocation);
                        }}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Meetup Preferences Section */}
            <div className="mt-6">
              <div className="text-sm font-bold text-gray-900 mb-1">Meetup preferences</div>
              <div className="text-xs text-gray-500 mb-3">
                Buyers will be able to see your preferences on your listing.{" "}
                <button className="text-blue-600 hover:underline" type="button">Learn more</button>
              </div>

              <div className="space-y-3">
                {/* Public Meetup */}
                <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-blue-600 font-bold text-sm">P</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 mb-1">Public meetup</div>
                    <div className="text-xs text-gray-600 mb-1">Meet at a public location.</div>
                    <button className="text-xs text-blue-600 hover:underline" type="button">See Safety Tips</button>
                  </div>
                  <input
                    type="checkbox"
                    checked={meetupPreferences.publicMeetup}
                    onChange={(e) =>
                      setMeetupPreferences((prev) => ({ ...prev, publicMeetup: e.target.checked }))
                    }
                    className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>

                {/* Door Pickup */}
                <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3 4C3 2.89543 3.89543 2 5 2H15C16.1046 2 17 2.89543 17 4V16C17 17.1046 16.1046 18 15 18H5C3.89543 18 3 17.1046 3 16V4Z"
                        stroke="#6B7280"
                        strokeWidth="1.5"
                      />
                      <path d="M7 8V12" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="7" cy="6" r="1" fill="#6B7280" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 mb-1">Door pickup</div>
                    <div className="text-xs text-gray-600">Buyer picks up at your door.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={meetupPreferences.doorPickup}
                    onChange={(e) =>
                      setMeetupPreferences((prev) => ({ ...prev, doorPickup: e.target.checked }))
                    }
                    className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>

                {/* Door Dropoff */}
                <div className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3 4C3 2.89543 3.89543 2 5 2H15C16.1046 2 17 2.89543 17 4V16C17 17.1046 16.1046 18 15 18H5C3.89543 18 3 17.1046 3 16V4Z"
                        stroke="#6B7280"
                        strokeWidth="1.5"
                      />
                      <path d="M7 8V12" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="7" cy="6" r="1" fill="#6B7280" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 mb-1">Door dropoff</div>
                    <div className="text-xs text-gray-600">You drop off at buyer&apos;s door.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={meetupPreferences.doorDropoff}
                    onChange={(e) =>
                      setMeetupPreferences((prev) => ({ ...prev, doorDropoff: e.target.checked }))
                    }
                    className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Hide from Friends Section */}
            <div className="mt-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <FaLock className="text-gray-700 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-900 mb-1">Hide from friends</div>
                    <div className="text-xs text-gray-600 mb-3">
                      This listing is still public. If you hide this listing from friends, they won&apos;t see it in most cases.{" "}
                      <button className="text-blue-600 hover:underline" type="button">Learn more</button>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={hideFromFriends}
                      onChange={(e) => setHideFromFriends(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Marketplace Policy Disclaimer */}
            <div className="mt-4 mb-6">
              <div className="text-xs text-gray-600 leading-relaxed">
                Marketplace items are public and can be seen by anyone on or off Facebook. Items like animals, drugs, weapons, counterfeits, and other items that infringe intellectual property aren&apos;t allowed on Marketplace.{" "}
                <button className="text-blue-600 hover:underline" type="button">See our Commerce Policies</button>.
              </div>
            </div>

            {/* Progress Bar + Next Button */}
            <div className="mt-6">
              <div className="flex gap-1 mb-3">
                <div className="h-1 flex-1 bg-blue-600 rounded-full"></div>
                <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed || isSubmitting}
                className={`w-full h-12 rounded-lg text-sm font-semibold transition-colors ${
                  canProceed && !isSubmitting
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update" : "Next")}
              </button>
            </div>
          </div>
        </aside>

        {/* Preview Section - New Layout */}
        <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Preview</h2>

            <div className="flex gap-6">
              {/* Left side - Image Preview or Placeholder */}
              <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex items-center justify-center">
                {images.length > 0 ? (
                  <div className="relative w-full h-full min-h-[500px] group">
                    <Image
                      src={images[selectedImageIndex]?.url || images[0]?.url}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                    
                    {/* Navigation arrows */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          type="button"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          type="button"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                        
                        {/* Image counter */}
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
                          {selectedImageIndex + 1} / {images.length}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center max-w-md p-12">
                    <h3 className="text-2xl font-bold text-gray-700 mb-3">Your listing preview</h3>
                    <p className="text-gray-600 leading-relaxed">
                      As you create your listing, you can preview how it will appear to others on Marketplace.
                    </p>
                  </div>
                )}
              </div>

              {/* Right side - Preview Card */}
              <div className="w-96 bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {title || "Title"}
                  </h3>
                  <div className="text-base font-semibold text-gray-900 mb-6 pb-6 border-b border-gray-200">
                    {price ? `৳${parseFloat(price).toLocaleString()}` : "Price"}
                  </div>

                  {/* Item Location */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Item Location</h4>
                    <div className="bg-gray-200 h-40 rounded-lg flex items-center justify-center mb-2">
                      <div className="text-center text-gray-500">
                        <FaMapMarkerAlt className="w-6 h-6 mx-auto mb-1" />
                        <div className="font-medium text-sm">{location || "চট্টগ্রাম"}</div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">Location is approximate</p>
                  </div>

                  {/* About this item */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      About this item for sale
                    </h4>
                    
                    <div className="space-y-2">
                      {/* Category */}
                      {category && categories.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <span>📦</span>
                          <span>{categories.find(c => c.id == category)?.name || 'Category'}</span>
                        </div>
                      )}
                      
                      {/* Condition */}
                      {condition && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <span>⭐</span>
                          <span>
                            {condition === "1" && "New"}
                            {condition === "2" && "Like New"}
                            {condition === "3" && "Good"}
                            {condition === "4" && "Fair"}
                            {condition === "5" && "For Parts"}
                          </span>
                        </div>
                      )}
                      
                      {/* Availability */}
                      {availability && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <span>✅</span>
                          <span>
                            {availability === "in_stock" && "In Stock"}
                            {availability === "out_of_stock" && "Out of Stock"}
                            {availability === "available_soon" && "Available Soon"}
                          </span>
                        </div>
                      )}
                      
                      {/* SKU */}
                      {sku && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <span>🔖</span>
                          <span>SKU: {sku}</span>
                        </div>
                      )}
                      
                      {/* Meetup Preferences */}
                      {meetupPreferences.publicMeetup && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <span>🤝</span>
                          <span>Public meetup available</span>
                        </div>
                      )}
                      {meetupPreferences.doorPickup && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <span>🏠</span>
                          <span>Door pickup available</span>
                        </div>
                      )}
                      {meetupPreferences.doorDropoff && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <span>🚚</span>
                          <span>Door dropoff available</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Description */}
                    {description && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                          {description}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Seller information */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">Seller information</h4>
                      <button className="text-sm text-blue-600 hover:underline" type="button">
                        Seller details
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                        <img 
                          src={seller.image} 
                          alt={seller.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/common-avator.jpg";
                          }}
                        />
                      </div>
                      <div className="font-medium text-gray-900 text-sm">
                        {seller.name}
                      </div>
                    </div>
                  </div>

                  {/* Report listing */}
                  <div className="mb-6">
                    <p className="text-xs text-gray-500">
                      Report this listing if you think it discriminates against people.
                    </p>
                  </div>

                  {/* Message button */}
                  <button 
                    disabled
                    className="w-full py-3 bg-gray-200 text-gray-400 rounded-lg font-semibold cursor-not-allowed text-sm"
                    type="button"
                  >
                    Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateListingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CreateListingContent />
    </Suspense>
  );
}

