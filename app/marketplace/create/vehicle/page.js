"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { FaCamera, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import BodyLayout from "@/components/common/BodyLayout";
import Intro from "@/components/common/Intro";
import api from "@/helpers/axios";
import { getMyProfile } from '@/views/settings/store';

export default function CreateVehicleListingPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { profile, profileData } = useSelector(({ settings }) => settings);

  // Form states
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [vehicleType, setVehicleType] = useState("");
  const [year, setYear] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
<<<<<<< HEAD
 
=======
>>>>>>> bb5b3d6f8180148046f365e311c660550636068a
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

  // Generate year options (current year to 1950)
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear; year >= 1950; year--) {
      years.push(year);
    }
    return years;
  }, []);

  // Vehicle types
  const vehicleTypes = [
    { value: "", label: "Vehicle type" },
<<<<<<< HEAD
    { value: "1", label: "Car" },
    { value: "2", label: "Truck" },
    { value: "3", label: "Motorcycle" },
    { value: "4", label: "SUV" },
    { value: "5", label: "Van" },
    { value: "6", label: "Bus" },
    { value: "7", label: "Other" }
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
=======
    { value: "car", label: "Car" },
    { value: "truck", label: "Truck" },
    { value: "motorcycle", label: "Motorcycle" },
    { value: "suv", label: "SUV" },
    { value: "van", label: "Van" },
    { value: "bus", label: "Bus" },
    { value: "other", label: "Other" }
>>>>>>> bb5b3d6f8180148046f365e311c660550636068a
  ];

  // Handle image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
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

  // Handle form submission
  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("Please enter a title for your vehicle");
      return;
    }
    if (!vehicleType) {
      alert("Please select a vehicle type");
      return;
    }
    if (!price) {
      alert("Please enter a price");
      return;
    }

    try {
      setLoading(true);

      // Create FormData
      const formData = new FormData();
      formData.append("title", title);
      formData.append("price", price);
      formData.append("description", description);
<<<<<<< HEAD
     
      formData.append("type", "2");
      
      
      // Vehicle-specific fields
      if (vehicleType) formData.append("vehicle_type", vehicleType);
      if (year) formData.append("year", year);
      if (make) formData.append("make", make);
      if (model) formData.append("model", model);
      
   
      // Add images
      images.forEach((img) => {
        if (img.file) {
          formData.append("files[]", img.file);
        }
      });

      const response = await api.post("/sale_post/store", formData, {
=======
      formData.append("category_id", "1"); // Default category
      formData.append("condition", "1"); // Default to "New"
      formData.append("availability", "1"); // In stock
      formData.append("country_id", countryId);
      formData.append("state_id", stateId);
      formData.append("city_id", cityId);
      
      // Vehicle-specific fields as tags
      const vehicleDetails = {
        vehicle_type: vehicleType,
        year: year,
        make: make,
        model: model
      };
      formData.append("product_tags", JSON.stringify(vehicleDetails));

      // Add images
      images.forEach((img, index) => {
        if (img.file) {
          formData.append(`images[${index}]`, img.file);
        }
      });

      const response = await api.post("/sale_post", formData, {
>>>>>>> bb5b3d6f8180148046f365e311c660550636068a
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        alert("Vehicle listing created successfully!");
        router.push("/marketplace/selling/listings");
      } else {
        alert("Failed to create listing. Please try again.");
      }
    } catch (error) {
      console.error("Error creating vehicle listing:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Save draft
  const handleSaveDraft = () => {
    alert("Draft save functionality will be implemented soon!");
  };

  // Auto-generate title from vehicle details
  useEffect(() => {
    const parts = [year, make, model].filter(Boolean);
    if (parts.length > 0) {
      setTitle(parts.join(" "));
    }
  }, [year, make, model]);

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
                    <h1 className="text-2xl font-bold text-gray-900">Vehicle for sale</h1>
                  </div>

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

                  {/* Vehicle Type */}
                  <div className="mb-6">
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                    >
                      {vehicleTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Photo Upload */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Photo upload</h3>
                    <p className="text-xs text-gray-500 mb-3">
                      Photos - {images.length} / 20 - You can add up to 20 photos.
                    </p>
                    
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

                  {/* About this vehicle */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">About this vehicle</h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Help buyers know more about the vehicle you're listing.
                    </p>

                    {/* Location */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                      <FaMapMarkerAlt className="text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-500">Location</div>
                        <div className="font-medium text-gray-900">{locationName}</div>
                      </div>
                    </div>

                    {/* Year */}
                    <div className="mb-4">
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
                      >
                        <option value="">Year</option>
                        {yearOptions.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Make */}
                    <div className="mb-4">
                      <input
                        type="text"
                        value={make}
                        onChange={(e) => setMake(e.target.value)}
                        placeholder="Make"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Model */}
                    <div className="mb-4">
                      <input
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="Model"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Price</h3>
                    <p className="text-xs text-gray-500 mb-3">
                      Enter your price for this vehicle.
                    </p>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Price"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-xs text-gray-500 mb-3">
                      Tell buyers anything that you haven't had the chance to include yet about your vehicle.
                    </p>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Description"
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

<<<<<<< HEAD
               

=======
>>>>>>> bb5b3d6f8180148046f365e311c660550636068a
                  {/* Disclaimer */}
                  <div className="text-xs text-gray-500 mb-6">
                    Marketplace items are public and can be seen by anyone on or off Facebook. Items like animals, drugs, weapons, counterfeits, and other items that violate our{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Commerce Policies
                    </a>{" "}
                    aren't allowed on Marketplace. See our{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Commerce Policies
                    </a>
                    .
                  </div>

                  {/* Progress bar */}
                  <div className="mb-6">
                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{
                          width: `${
                            ((vehicleType ? 1 : 0) +
                              (images.length > 0 ? 1 : 0) +
                              (year ? 1 : 0) +
                              (make ? 1 : 0) +
                              (model ? 1 : 0) +
                              (price ? 1 : 0)) *
                            16.67
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !title || !vehicleType || !price}
                      className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {loading ? "Creating..." : "Next"}
                    </button>
                    <button
                      onClick={handleSaveDraft}
                      disabled={loading}
                      className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      Save draft
                    </button>
                  </div>
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
                          {price ? `৳${parseFloat(price).toLocaleString()}` : "Price"}
                        </div>

                        {/* Vehicle Location */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-900 mb-3">Vehicle Location</h4>
                          <div className="bg-gray-200 h-40 rounded-lg flex items-center justify-center mb-2">
                            <div className="text-center text-gray-500">
                              <FaMapMarkerAlt className="w-6 h-6 mx-auto mb-1" />
                              <div className="font-medium text-sm">{locationName}</div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">Location is approximate</p>
                        </div>

                        {/* About this vehicle */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                          <h4 className="font-semibold text-gray-900 mb-3">
                            About this vehicle for sale
                          </h4>
                          
                          <div className="space-y-2">
                            {/* Vehicle Type */}
                            {vehicleType && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span>🚗</span>
                                <span className="capitalize">{vehicleType}</span>
                              </div>
                            )}
                            
                            {/* Year */}
                            {year && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span>📅</span>
                                <span>{year}</span>
                              </div>
                            )}
                            
                            {/* Make */}
                            {make && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span>🏭</span>
                                <span>{make}</span>
                              </div>
                            )}
                            
                            {/* Model */}
                            {model && (
                              <div className="flex items-center gap-2 text-sm text-gray-700">
                                <span>🚙</span>
                                <span>{model}</span>
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
