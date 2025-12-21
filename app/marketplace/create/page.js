"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaThumbsUp, FaCar, FaHome, FaTimes } from "react-icons/fa";
import BodyLayout from "@/components/common/BodyLayout";
import Intro from "@/components/common/Intro";

export default function CreateListingTypePage() {
  const router = useRouter();

  const listingTypes = [
    {
      id: "item",
      icon: FaThumbsUp,
      title: "Item for sale",
      description: "Create a single listing for one or more items to sell.",
      bgColor: "bg-gradient-to-br from-pink-100 to-pink-50",
      iconColor: "text-pink-500",
      route: "/marketplace/create/item"
    },
    {
      id: "vehicle",
      icon: FaCar,
      title: "Vehicle for sale",
      description: "Sell a car, truck or other type of vehicle.",
      bgColor: "bg-gradient-to-br from-cyan-100 to-cyan-50",
      iconColor: "text-cyan-500",
      route: "/marketplace/create/vehicle"
    },
    {
      id: "property",
      icon: FaHome,
      title: "Home for sale or rent",
      description: "List a house or apartment for sale or rent.",
      bgColor: "bg-gradient-to-br from-orange-100 to-orange-50",
      iconColor: "text-orange-500",
      route: "/marketplace/create/property"
    }
  ];

  const handleSelectType = (type) => {
    router.push(type.route);
  };

  return (
    <BodyLayout>
      <div className="flex flex-wrap">
        {/* Profile Sidebar - Left Side */}
        {/* <div className="w-full lg:w-1/4 mb-1 lg:mb-0 lg:pr-2">
          <Intro />
        </div> */}

        {/* Main Content - Right Side */}
        <div className="w-full lg:w-3/4">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create new listing</h1>
              </div>
              <button
                onClick={() => router.push("/marketplace")}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <FaTimes className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Sidebar Navigation */}
            <div className="flex border-b border-gray-200">
              <div className="w-64 border-r border-gray-200 bg-gray-50 min-h-[calc(100vh-200px)]">
                <div className="p-4">
                  <button className="flex items-center gap-3 w-full px-4 py-3 bg-blue-50 text-blue-600 rounded-lg font-medium">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      ✓
                    </div>
                    <span>Choose listing type</span>
                  </button>
                </div>

                {/* Additional sidebar items can be added here */}
                <div className="px-4 py-2">
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2 px-4">
                    Your listings
                  </div>
                  <button
                    onClick={() => router.push("/marketplace/selling/listings")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    1 active
                  </button>
                </div>

                <div className="px-4 py-2">
                  <button
                    onClick={() => router.push("/marketplace")}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <span>❓</span>
                    <span>Seller Help</span>
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-8">
                <div className="max-w-4xl">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose listing type</h2>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {listingTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => handleSelectType(type)}
                          className="group relative bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <div className="flex flex-col items-center text-center space-y-4">
                            {/* Icon */}
                            <div className={`w-20 h-20 ${type.bgColor} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                              <IconComponent className={`w-10 h-10 ${type.iconColor}`} />
                            </div>

                            {/* Title */}
                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                              {type.title}
                            </h3>

                            {/* Description */}
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {type.description}
                            </p>
                          </div>

                          {/* Hover indicator */}
                          <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 rounded-2xl pointer-events-none transition-colors" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Helper text */}
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <p className="text-sm text-gray-700">
                      <strong>💡 Tip:</strong> Select the type that best matches what you want to sell. This helps buyers find your listing more easily.
                    </p>
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

