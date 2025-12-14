"use client";

import React from 'react';

/**
 * Typing indicator component
 * Shows animated dots when someone is typing
 */
export const TypingIndicator = ({ userName, showAvatar = false, avatarUrl = null }) => {
  return (
    <div className="flex items-end justify-start mb-3">
      {showAvatar && (
        <div className="flex-shrink-0 mr-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={userName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/common-avator.jpg';
                  e.target.onerror = null;
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-white text-xs font-bold">
                {userName?.charAt(0)?.toUpperCase() || '?'}
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '1s' }}></div>
        </div>
      </div>
    </div>
  );
};

/**
 * Simple typing text indicator (for chat header)
 */
export const TypingText = ({ userName = 'Someone' }) => {
  return (
    <div className="flex items-center gap-1.5 text-sm text-blue-600">
      <span className="flex space-x-1">
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
      </span>
      <span className="font-medium">Typing...</span>
    </div>
  );
};

