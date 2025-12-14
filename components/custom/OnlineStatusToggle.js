"use client";

import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaCircle } from 'react-icons/fa';

/**
 * Online Status Toggle Component
 * Allows users to control their online visibility
 */
export const OnlineStatusToggle = ({ isOnline, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
          isOnline 
            ? 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300'
        }`}
        title={isOnline ? 'You are visible as online' : 'You appear offline to others'}
      >
        <FaCircle className={`text-xs ${isOnline ? 'text-green-500' : 'text-gray-400'}`} />
        <span className="text-sm font-medium">
          {isOnline ? 'Online' : 'Offline'}
        </span>
        {isOnline ? <FaEye className="text-sm" /> : <FaEyeSlash className="text-sm" />}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-20 w-64 overflow-hidden">
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <h4 className="font-semibold text-sm text-gray-700">Online Status</h4>
              <p className="text-xs text-gray-500 mt-1">Control your visibility</p>
            </div>
            
            <div className="p-2">
              {/* Online Option */}
              <button
                onClick={() => {
                  onToggle(true);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isOnline 
                    ? 'bg-green-50 border-2 border-green-500' 
                    : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FaCircle className="text-green-500" />
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                    Online
                    {isOnline && <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Active</span>}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Show as active to everyone
                  </div>
                </div>
              </button>

              {/* Offline Option */}
              <button
                onClick={() => {
                  onToggle(false);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all mt-2 ${
                  !isOnline 
                    ? 'bg-gray-50 border-2 border-gray-400' 
                    : 'hover:bg-gray-50 border-2 border-transparent'
                }`}
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <FaEyeSlash className="text-gray-500" />
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                    Appear Offline
                    {!isOnline && <span className="text-xs bg-gray-500 text-white px-2 py-0.5 rounded-full">Active</span>}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    Hide your online status
                  </div>
                </div>
              </button>
            </div>

            <div className="p-3 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500">
                💡 You can still send and receive messages when appearing offline
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

