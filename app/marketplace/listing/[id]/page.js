"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FaChevronLeft, FaChevronRight, FaBookmark, FaEllipsisH } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import api from "@/helpers/axios";
import moment from "moment";

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [message, setMessage] = useState("Good afternoon, is this still available?");
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/single_sale_post/${params.id}`);
        
        // Handle response structure
        const listingData = response.data?.success 
          ? response.data.data 
          : response.data?.data 
          ? response.data.data 
          : response.data;
        
        console.log("Fetched listing data:", listingData);
        
        if (listingData) {
          setListing(listingData);
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchListing();
    }
  }, [params.id]);

  const getImageUrl = (file) => {
    if (!file) return "/common-avator.jpg";
    const filePath = file.file_path || file.path || file.url || file.file_url || '';
    if (!filePath) return "/common-avator.jpg";
    
    // Build image URL using NEXT_PUBLIC_FILE_PATH/sale_post + file_path
    const base = process.env.NEXT_PUBLIC_FILE_PATH || '';
    const cleanBase = base ? base.replace(/\/+$/, '') : '';
    const cleanPath = String(filePath || '').replace(/^\/+/, '');
    return cleanBase ? `${cleanBase}/sale_post/${cleanPath}` : `/public/uploads/sale_post/${cleanPath}`;
  };

  const images = listing?.files && listing.files.length > 0 
    ? listing.files.map(getImageUrl)
    : ["/common-avator.jpg"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
  };

  const formatPrice = (price) => {
    if (!price) return "FREE";
    return `BDT${parseFloat(price).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const daysAgo = moment().diff(moment(dateString), 'days');
    if (daysAgo === 0) return "today";
    if (daysAgo === 1) return "1 day ago";
    return `${daysAgo} days ago`;
  };

  const getLocation = () => {
    if (listing?.city?.name) {
      return listing.city.name;
    }
    return listing?.state?.name || listing?.country?.name || "Location not specified";
  };

  const handleSendMessage = () => {
    // TODO: Implement message sending functionality
    console.log("Sending message:", message);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <Link href="/marketplace" className="text-blue-600 hover:underline">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Panel - Product Images (Larger) */}
        <div className="flex-1 bg-white flex flex-col">
          {/* Back Arrow */}
          <div className="p-4">
            <button
              onClick={() => router.back()}
              className="text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
            >
              <FaChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Main Image Container with Slider */}
          <div className="flex-1 flex items-center justify-center relative bg-gray-50 overflow-hidden">
            <div 
              className="relative w-full h-full max-h-[calc(100vh-200px)] flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {images.map((img, index) => (
                <div
                  key={index}
                  className="min-w-full h-full relative flex-shrink-0"
                >
                  <Image
                    src={img}
                    alt={`${listing.title || "Product"} - Image ${index + 1}`}
                    fill
                    sizes="50vw"
                    className="object-contain"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            {/* Brand Logo Overlay */}
            {listing.brand && (
              <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded shadow-sm z-10">
                <span className="text-sm font-semibold text-gray-800">{listing.brand}</span>
              </div>
            )}

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white rounded-full p-3 shadow-lg transition-all z-10"
                  aria-label="Previous image"
                >
                  <FaChevronLeft className="text-gray-800 w-4 h-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 hover:bg-white rounded-full p-3 shadow-lg transition-all z-10"
                  aria-label="Next image"
                >
                  <FaChevronRight className="text-gray-800 w-4 h-4" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Image Thumbnails - Bottom Center */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 p-4 bg-white border-t">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-12 h-12 rounded overflow-hidden border-2 transition-all ${
                    index === currentImageIndex 
                      ? "border-blue-600 shadow-md" 
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar - Product Details (Narrower) */}
        <div className="w-[400px] bg-white border-l border-gray-200 flex flex-col">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Product Header */}
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{listing.title}</h1>
              <div className="text-xl font-bold text-gray-900 mb-2">
                {formatPrice(listing.price)}
              </div>
              <div className="text-sm text-gray-500">
                Listed {formatDate(listing.created_at)} in {getLocation()}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  Message
                </button>
                <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaBookmark className="text-gray-600 w-5 h-5" />
                </button>
                <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <IoMdShareAlt className="text-gray-600 w-5 h-5" />
                </button>
                <button className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <FaEllipsisH className="text-gray-600 w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Details Section */}
            {listing.description && (
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Details</h2>
                <div className="text-gray-700 leading-relaxed space-y-2">
                  {listing.description.split('\n').map((line, index) => {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
                      return (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-gray-400 mt-1">•</span>
                          <span>{trimmedLine.substring(1).trim()}</span>
                        </div>
                      );
                    }
                    if (trimmedLine) {
                      return <div key={index}>{line}</div>;
                    }
                    return null;
                  })}
                </div>
              </div>
            )}

            {/* Location Map */}
            {(listing.city || listing.state || listing.country) && (
              <div className="p-6 border-b border-gray-200">
                <div className="bg-gray-50 rounded-lg h-48 flex items-center justify-center relative overflow-hidden mb-2">
                  {/* Map placeholder */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-blue-100"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-4 border-blue-500/30 bg-blue-500/10"></div>
                  </div>
                </div>
                <div className="text-sm font-semibold text-gray-900">{getLocation()}</div>
                <div className="text-xs text-gray-500 mt-1">Location is approximate</div>
              </div>
            )}

            {/* Contact Seller */}
            <div className="p-6">
              <div className="text-sm text-blue-600 mb-2">Send seller a message</div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Type your message..."
              />
              <button
                onClick={handleSendMessage}
                className="w-full mt-3 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
