"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { FaCamera, FaMapMarkerAlt, FaTimes, FaCalendarAlt } from "react-icons/fa";
import BodyLayout from "@/components/common/BodyLayout";
import Intro from "@/components/common/Intro";
import api from "@/helpers/axios";
import { getMyProfile } from '@/views/settings/store';

export default function CreatePropertyListingPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { profile, profileData } = useSelector(({ settings }) => settings);

  // Form states
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [rentalType, setRentalType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [pricePerMonth, setPricePerMonth] = useState("");
  const [rentalDescription, setRentalDescription] = useState("");
  const [title, setTitle] = useState("");
  
  // Advanced Details
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [squareFeet, setSquareFeet] = useState("");
  const [dateAvailable, setDateAvailable] = useState("");
  const [laundryType, setLaundryType] = useState("");
  const [parkingType, setParkingType] = useState("");
  const [airConditioningType, setAirConditioningType] = useState("");
  const [heatingType, setHeatingType] = useState("");
  const [catFriendly, setCatFriendly] = useState(false);
  const [dogFriendly, setDogFriendly] = useState(false);
  
  const [loading, setLoading] = useState(false);

  // Get location from profile
  const locationName = useMemo(() => {
    return profileData?.city?.name || 
           profile?.client?.city?.name || 
           profileData?.state?.name || 
           profile?.client?.state?.name || 
           "Location";
  }, [profileData, profile]);

  const countryId = useMemo(() => {
    return profileData?.current_country_id || 
           profileData?.from_country_id || 
           profile?.client?.current_country_id || 
           profile?.client?.from_country_id || 1;
  }, [profileData, profile]);

  const stateId = useMemo(() => {
    return profileData?.current_state_id || 
           profileData?.from_state_id || 
           profile?.client?.current_state_id || 
           profile?.client?.from_state_id || 1;
  }, [profileData, profile]);

  const cityId = useMemo(() => {
    return profileData?.from_city_id || 
           profile?.client?.from_city_id || 1;
  }, [profileData, profile]);

  useEffect(() => {
    dispatch(getMyProfile());
  }, [dispatch]);

  // Rental types
  const rentalTypes = [
    { value: "", label: "Rental type" },
    { value: "1", label: "Apartment" },
    { value: "2", label: "House" },
    { value: "3", label: "Condo" },
    { value: "4", label: "Townhouse" },
    { value: "5", label: "Studio" },
    { value: "6", label: "Room" },
    { value: "7", label: "Other" }
  ];

  // Laundry types
  const laundryTypes = [
    { value: "", label: "Laundry type" },
    { value: "1", label: "In unit" },
    { value: "2", label: "Shared" },
    { value: "3", label: "None" },
    { value: "4", label: "Hookups available" }
  ];

  // Parking types
  const parkingTypes = [
    { value: "", label: "Parking type" },
    { value: "1", label: "Garage" },
    { value: "2", label: "Driveway" },
    { value: "3", label: "Street parking" },
    { value: "4", label: "Covered" },
    { value: "5", label: "No parking" }
  ];

  // Air conditioning types
  const airConditioningTypes = [
    { value: "", label: "Air conditioning type" },
    { value: "1", label: "Central" },
    { value: "2", label: "Window unit" },
    { value: "3", label: "None" }
  ];

  // Heating types
  const heatingTypes = [
    { value: "", label: "Heating type" },
    { value: "1", label: "Central" },
    { value: "2", label: "Electric" },
    { value: "3", label: "Gas" },
    { value: "4", label: "Oil" },
    { value: "5", label: "None" }
  ];

  // Condition types
  const conditionTypes = [
    { value: "1", label: "New" },
    { value: "2", label: "Used - Like New" },
    { value: "3", label: "Used - Good" },
    { value: "4", label: "Used - Fair" }
  ];

  // Availability types
  const availabilityTypes = [
    { value: "1", label: "In Stock" },
    { value: "2", label: "Available to Order" },
    { value: "3", label: "Out of Stock" }
  ];

  // Handle image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 50) {
      alert("You can only upload up to 50 photos");
      return;
    }
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  // Remove image
  const handleRemoveImage = (index) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (selectedImageIndex >= updated.length) {
        setSelectedImageIndex(Math.max(0, updated.length - 1));
      }
      return updated;
    });
  };

  // Auto-generate title
  useEffect(() => {
    const parts = [];
    if (bedrooms) parts.push(`${bedrooms} Bed`);
    if (bathrooms) parts.push(`${bathrooms} Bath`);
    if (rentalType) parts.push(rentalTypes.find(t => t.value === rentalType)?.label);
    if (parts.length > 0) {
      setTitle(parts.join(" "));
    } else {
      setTitle("");
    }
  }, [bedrooms, bathrooms, rentalType]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!rentalType) {
      alert("Please select a rental type");
      return;
    }
    if (!bedrooms) {
      alert("Please enter number of bedrooms");
      return;
    }
    if (!bathrooms) {
      alert("Please enter number of bathrooms");
      return;
    }
    if (!pricePerMonth) {
      alert("Please enter price per month");
      return;
    }

    try {
      setLoading(true);

      // Create FormData
      const formData = new FormData();
      formData.append("title", title || `${bedrooms}BR ${bathrooms}BA ${rentalType}`);
      formData.append("price", pricePerMonth);
      formData.append("description", rentalDescription);
    
      formData.append("type", "3");
      
      
      // Property-specific fields
      if (rentalType) formData.append("rental_type", rentalType);
      if (bedrooms) formData.append("number_of_bedrooms", bedrooms);
      if (bathrooms) formData.append("number_of_bathrooms", bathrooms);
      if (pricePerMonth) formData.append("price_per_month", pricePerMonth);
      if (squareFeet) formData.append("property_square_feet", squareFeet);
      if (dateAvailable) formData.append("date_available", dateAvailable);
      if (laundryType) formData.append("laundry_type", laundryType);
      if (parkingType) formData.append("parking_type", parkingType);
      if (airConditioningType) formData.append("air_conditioning_type", airConditioningType);
      if (heatingType) formData.append("heating_type", heatingType);
      formData.append("cat_friendly", catFriendly ? "1" : "0");
      formData.append("dog_friendly", dogFriendly ? "1" : "0");
      
     
      // Add images
      images.forEach((img) => {
        if (img.file) {
          formData.append("files[]", img.file);
        }
      });

      const response = await api.post("/sale_post/store", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        alert("Property listing created successfully!");
        router.push("/marketplace/selling/listings");
      } else {
        alert("Failed to create listing. Please try again.");
      }
    } catch (error) {
      console.error("Error creating property listing:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Save draft
  const handleSaveDraft = () => {
    alert("Draft save functionality will be implemented soon!");
  };

  return (
    <BodyLayout>
      <div className="flex flex-wrap">
        {/* Profile Sidebar - Left Side */}
        <div className="w-full lg:w-1/4 mb-1 lg:mb-0 lg:pr-2">
          <Intro />
        </div>

        {/* Main Content - Right Side */}
        <div className="w-full lg:w-3/4">
          <div className="bg-white rounded-lg shadow-sm min-h-screen">
            <div className="flex">
              {/* Left Sidebar - Form */}
              <div className="w-80 border-r border-gray-200 overflow-y-auto" style={{ maxHeight: "calc(100vh - 100px)" }}>
                <div className="p-6">
                  {/* Header */}
                  <div className="mb-6">
                    <button
                      onClick={() => router.push("/marketplace")}
                      className="text-gray-600 hover:text-gray-900 mb-2"
                    >
                      <FaTimes className="w-6 h-6" />
                    </button>
                    <p className="text-sm text-gray-500">Marketplace</p>
                    <h1 className="text-2xl font-bold text-gray-900">New home listing</h1>
                  </div>

                  {/* Save draft button */}
                  <button
                    onClick={handleSaveDraft}
                    className="text-blue-600 hover:underline text-sm font-medium mb-4"
                  >
                    Save draft
                  </button>

                  {/* User Info */}
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                      <Image
                        src={profile?.client?.profile_pic || "/common-avator.jpg"}
                        alt={profile?.client?.first_name || "User"}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {profile?.client?.first_name} {profile?.client?.last_name}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <span>Listing to Marketplace</span>
                        <span>•</span>
                        <span>🌍 Public</span>
                      </div>
                    </div>
                  </div>

                  {/* Photo count */}
                  <p className="text-sm text-gray-600 mb-3">
                    Photos - {images.length} / 50 - You can add up to 50 photos.
                  </p>

                  {/* Photo Upload */}
                  <div className="mb-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <FaCamera className="w-6 h-6 text-gray-600" />
                          </div>
                          <div className="font-semibold text-gray-900">Add photos</div>
                          <div className="text-sm text-gray-500">or drag and drop</div>
                        </div>
                      </label>
                    </div>

                    {/* Image Preview Grid */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        {images.map((img, index) => (
                          <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={img.url}
                              alt={`Upload ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                            <button
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-100"
                            >
                              <FaTimes className="w-3 h-3 text-gray-600" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                      <div className="w-5 h-5 bg-black text-white rounded flex items-center justify-center flex-shrink-0 text-xs">
                        📱
                      </div>
                      <div className="text-xs text-gray-700">
                        <span className="font-medium">Upload photos directly from your phone.</span>
                        <button className="text-blue-600 hover:underline ml-1">
                          Learn more
                        </button>
                        <button className="ml-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs font-medium">
                          Try it
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Rental Type */}
                  <div className="mb-4">
                    <select
                      value={rentalType}
                      onChange={(e) => setRentalType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                    >
                      {rentalTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Number of Bedrooms */}
                  <div className="mb-4">
                    <input
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      placeholder="Number of bedrooms"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Number of Bathrooms */}
                  <div className="mb-4">
                    <input
                      type="number"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(e.target.value)}
                      placeholder="Number of bathrooms"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Price per Month */}
                  <div className="mb-4">
                    <input
                      type="number"
                      value={pricePerMonth}
                      onChange={(e) => setPricePerMonth(e.target.value)}
                      placeholder="Price per month"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Location */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                      <FaMapMarkerAlt className="text-gray-500" />
                      <span className="text-gray-700">{locationName}</span>
                    </div>
                  </div>

                  {/* Rental Description */}
                  <div className="mb-6">
                    <textarea
                      value={rentalDescription}
                      onChange={(e) => setRentalDescription(e.target.value)}
                      placeholder="Rental description"
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Include details like utilities, amenities, any deposits needed and when it's available.
                    </p>
                  </div>

                  {/* Advanced Details Section */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Advanced Details</h3>
                      <span className="text-sm text-gray-500">Optional</span>
                    </div>

                    {/* Property Square Feet */}
                    <div className="mb-4">
                      <input
                        type="number"
                        value={squareFeet}
                        onChange={(e) => setSquareFeet(e.target.value)}
                        placeholder="Property square feet"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Date Available */}
                    <div className="mb-4">
                      <div className="relative">
                        <FaCalendarAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                          value={dateAvailable}
                          onChange={(e) => setDateAvailable(e.target.value)}
                          placeholder="Date available"
                          className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {/* Laundry Type */}
                    <div className="mb-4">
                      <select
                        value={laundryType}
                        onChange={(e) => setLaundryType(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                      >
                        {laundryTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Parking Type */}
                    <div className="mb-4">
                      <select
                        value={parkingType}
                        onChange={(e) => setParkingType(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                      >
                        {parkingTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Air Conditioning Type */}
                    <div className="mb-4">
                      <select
                        value={airConditioningType}
                        onChange={(e) => setAirConditioningType(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                      >
                        {airConditioningTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Heating Type */}
                    <div className="mb-4">
                      <select
                        value={heatingType}
                        onChange={(e) => setHeatingType(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                      >
                        {heatingTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Cat Friendly Toggle */}
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-gray-900 font-medium">Cat friendly</label>
                      <button
                        onClick={() => setCatFriendly(!catFriendly)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          catFriendly ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            catFriendly ? "translate-x-6" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Dog Friendly Toggle */}
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-gray-900 font-medium">Dog friendly</label>
                      <button
                        onClick={() => setDogFriendly(!dogFriendly)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          dogFriendly ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            dogFriendly ? "translate-x-6" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-6">
                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{
                          width: `${
                            ((rentalType ? 1 : 0) +
                              (images.length > 0 ? 1 : 0) +
                              (bedrooms ? 1 : 0) +
                              (bathrooms ? 1 : 0) +
                              (pricePerMonth ? 1 : 0) +
                              (rentalDescription ? 1 : 0)) *
                            16.67
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !rentalType || !bedrooms || !bathrooms || !pricePerMonth}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {loading ? "Creating..." : "Next"}
                  </button>
                </div>
              </div>

              {/* Right Side - Preview */}
              <div className="flex-1 bg-gray-50 p-8 overflow-y-auto" style={{ maxHeight: "calc(100vh - 100px)" }}>
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
                              >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
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
                          {pricePerMonth ? `৳${parseFloat(pricePerMonth).toLocaleString()} / Month` : "Price / Month"}
                        </div>

                        {/* Rental Location */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Rental Location</h4>
                          <div className="bg-gray-200 h-40 rounded-lg flex items-center justify-center mb-2">
                            <div className="text-center text-gray-500">
                              <FaMapMarkerAlt className="w-6 h-6 mx-auto mb-1" />
                              <div className="font-medium text-sm">{locationName}</div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">Location is approximate</p>
                        </div>

                        {/* About this property */}
                        {(bedrooms || bathrooms || squareFeet || catFriendly || dogFriendly || heatingType || airConditioningType || laundryType || parkingType || dateAvailable || rentalDescription) && (
                          <div className="mb-6 pb-6 border-b border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              About this property for rent
                            </h4>
                            
                            <div className="space-y-2">
                            {/* Bedrooms & Bathrooms */}
                            {bedrooms && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span>🛏️</span>
                                <span>{bedrooms} Bedroom{bedrooms > 1 ? 's' : ''}</span>
                              </div>
                            )}
                            {bathrooms && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span>🚿</span>
                                <span>{bathrooms} Bathroom{bathrooms > 1 ? 's' : ''}</span>
                              </div>
                            )}
                            
                            {/* Square Feet */}
                            {squareFeet && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span>📐</span>
                                <span>{squareFeet} sq ft</span>
                              </div>
                            )}
                            
                            {/* Pet Friendly */}
                            {catFriendly && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span>🐾</span>
                                <span>Cat Friendly</span>
                              </div>
                            )}
                            {dogFriendly && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span>🐾</span>
                                <span>Dog Friendly</span>
                              </div>
                            )}
                            
                            {/* Heating */}
                            {heatingType && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span>🔥</span>
                                <span>{heatingTypes.find(t => t.value === heatingType)?.label} heating</span>
                              </div>
                            )}
                            
                            {/* Air Conditioning */}
                            {airConditioningType && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span>❄️</span>
                                <span>{airConditioningTypes.find(t => t.value === airConditioningType)?.label} air conditioning</span>
                              </div>
                            )}
                            
                            {/* Laundry */}
                            {laundryType && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span>🧺</span>
                                <span>{laundryTypes.find(t => t.value === laundryType)?.label} laundry</span>
                              </div>
                            )}
                            
                            {/* Parking */}
                            {parkingType && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span>🚗</span>
                                <span>{parkingTypes.find(t => t.value === parkingType)?.label} parking</span>
                              </div>
                            )}
                            
                            {/* Date Available */}
                            {dateAvailable && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span>📅</span>
                                <span>Available from {new Date(dateAvailable).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                          
                          {/* Description */}
                          {rentalDescription && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <h5 className="font-semibold text-gray-900 mb-2 text-sm">Description</h5>
                              <p className="text-sm text-gray-600">
                                {rentalDescription}
                              </p>
                            </div>
                          )}
                        </div>
                        )}

                        {/* Seller information */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">Seller information</h4>
                            <button className="text-sm text-blue-600 hover:underline">
                              Seller details
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                              <Image
                                src={profile?.client?.profile_pic || "/common-avator.jpg"}
                                alt={profile?.client?.first_name || "User"}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            </div>
                            <div className="font-medium text-gray-900 text-sm">
                              {profile?.client?.first_name} {profile?.client?.last_name}
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
                        <button className="w-full py-3 bg-gray-200 text-gray-400 rounded-lg font-semibold cursor-not-allowed text-sm">
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
    </BodyLayout>
  );
}
