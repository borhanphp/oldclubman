"use client";

import React, { useState } from "react";
import api from "@/helpers/axios";
import { useSelector } from "react-redux";

export default function SeedProductsPage() {
  const { profile, profileData } = useSelector(({ settings }) => settings);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 20, success: 0, failed: 0 });

  // Get location IDs from logged-in user's profile
  const countryId = profileData?.current_country_id || profileData?.from_country_id || profile?.client?.current_country_id || profile?.client?.from_country_id || 1;
  const stateId = profileData?.current_state_id || profileData?.from_state_id || profile?.client?.current_state_id || profile?.client?.from_state_id || 1;
  const cityId = profileData?.from_city_id || profile?.client?.from_city_id || 1;

  // Sample product data - Using category 1 as default (can be changed based on available categories)
  const sampleProducts = [
    { title: "iPhone 13 Pro Max 256GB", price: "85000", category: 1, condition: 1, description: "Brand new iPhone 13 Pro Max. Unopened box. All accessories included." },
    { title: "Samsung Galaxy S21 Ultra", price: "75000", category: 1, condition: 2, description: "Like new condition. Used for 2 months only. No scratches." },
    { title: "MacBook Pro M1 13 inch", price: "120000", category: 1, condition: 2, description: "Excellent condition MacBook Pro. Perfect for work and study." },
    { title: "Sony WH-1000XM4 Headphones", price: "25000", category: 1, condition: 1, description: "Brand new noise cancelling headphones. Best in class." },
    { title: "Nike Air Max 270", price: "8000", category: 1, condition: 1, description: "Brand new Nike shoes. Size 9. Original box included." },
    { title: "Levi's Jeans - Blue", price: "3500", category: 1, condition: 2, description: "Good condition jeans. Size 32x32. Minimal wear." },
    { title: "Zara Winter Jacket", price: "5500", category: 1, condition: 1, description: "New winter jacket. Perfect for cold weather. Size M." },
    { title: "Honda Civic 2018", price: "1850000", category: 1, condition: 3, description: "Well maintained car. Regular service done. Low mileage." },
    { title: "Toyota Corolla 2020", price: "2200000", category: 1, condition: 2, description: "Excellent condition. Single owner. All papers clear." },
    { title: "Yamaha R15 V3", price: "350000", category: 1, condition: 2, description: "Like new bike. Low mileage. All accessories included." },
    { title: "2 Bedroom Apartment for Rent", price: "15000", category: 1, condition: 1, description: "Furnished apartment in prime location. Available immediately." },
    { title: "Studio Apartment - Dhanmondi", price: "12000", category: 1, condition: 1, description: "Cozy studio apartment. Perfect for single person or couple." },
    { title: "Gaming PC Setup", price: "95000", category: 1, condition: 2, description: "High-end gaming PC with RTX 3060. Perfect for gaming and streaming." },
    { title: "Canon EOS 200D Camera", price: "45000", category: 1, condition: 2, description: "DSLR camera in excellent condition. With lens and accessories." },
    { title: "Dell Monitor 27 inch", price: "18000", category: 1, condition: 1, description: "Brand new 4K monitor. Perfect for work and gaming." },
    { title: "IKEA Study Table", price: "4500", category: 1, condition: 1, description: "Modern study table. Easy to assemble. Brand new." },
    { title: "Sofa Set - 3+2", price: "35000", category: 1, condition: 2, description: "Comfortable sofa set. Good condition. Perfect for living room." },
    { title: "Refrigerator - Samsung", price: "42000", category: 1, condition: 1, description: "Brand new double door refrigerator. Energy efficient." },
    { title: "Washing Machine - LG", price: "28000", category: 1, condition: 1, description: "Fully automatic washing machine. 8kg capacity." },
    { title: "Guitar - Acoustic", price: "8500", category: 1, condition: 2, description: "Yamaha acoustic guitar. Good condition. Perfect for beginners." },
  ];

  // Create a placeholder image file
  const createPlaceholderImage = () => {
    // Create a simple 1x1 pixel transparent PNG
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, 400, 400);
    ctx.fillStyle = '#9ca3af';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Product Image', 200, 200);
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob], 'product-image.png', { type: 'image/png' });
        resolve(file);
      }, 'image/png');
    });
  };

  const createProduct = async (product, index) => {
    try {
      const formData = new FormData();

      // Required fields
      formData.append("title", product.title);
      formData.append("price", product.price);
      formData.append("category_id", product.category);
      formData.append("condition", product.condition);

      // Create and add placeholder image
      const imageFile = await createPlaceholderImage();
      formData.append("photos[]", imageFile);

      // Optional fields
      formData.append("description", product.description || "");
      formData.append("availability", 1);
      formData.append("sku", `SKU-${Date.now()}-${index}`);
      formData.append("country_id", countryId);
      formData.append("state_id", stateId);
      formData.append("city_id", cityId);
      formData.append("public_meetup", 1);
      formData.append("door_pickup", 1);
      formData.append("door_dropoff", 1);
      formData.append("hide_from_friends", 0);
      formData.append("status", 1);

      // Dates
      const today = new Date();
      const publishedDate = today.toISOString().split('T')[0];
      const unpublishedDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      formData.append("published_at", publishedDate);
      formData.append("unpublished_at", unpublishedDate);
      formData.append("tags", "");

      const response = await api.post("/sale_post/store", formData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error(`Error creating product ${index + 1}:`, error);
      return { success: false, error: error.message };
    }
  };

  const seedProducts = async () => {
    setLoading(true);
    let successCount = 0;
    let failedCount = 0;
    setProgress({ current: 0, total: 20, success: 0, failed: 0 });

    for (let i = 0; i < sampleProducts.length; i++) {
      setProgress({ current: i + 1, total: 20, success: successCount, failed: failedCount });
      
      const result = await createProduct(sampleProducts[i], i);
      
      if (result.success) {
        successCount++;
        setProgress({ current: i + 1, total: 20, success: successCount, failed: failedCount });
      } else {
        failedCount++;
        setProgress({ current: i + 1, total: 20, success: successCount, failed: failedCount });
      }

      // Small delay between requests to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setLoading(false);
    alert(`Seeding completed! Success: ${successCount}, Failed: ${failedCount}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Seed Products Database</h1>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            This will create 20 sample products in the database with placeholder images.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Make sure you are logged in. Products will be created with your profile location.
            </p>
          </div>
        </div>

        {loading && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Creating products... {progress.current} / {progress.total}
              </span>
              <span className="text-sm text-gray-500">
                Success: {progress.success} | Failed: {progress.failed}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={seedProducts}
            disabled={loading}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors ${
              loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating Products..." : "Create 20 Products"}
          </button>
          
          <a
            href="/marketplace"
            className="px-6 py-3 rounded-lg font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back to Marketplace
          </a>
        </div>

        {!loading && progress.current > 0 && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              <strong>Completed!</strong> Created {progress.success} products successfully.
              {progress.failed > 0 && (
                <span className="text-red-600"> {progress.failed} failed.</span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

