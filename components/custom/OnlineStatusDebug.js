"use client";

import React from 'react';
import { useOnlineStatus } from './useOnlineStatus';
import { useSelector } from 'react-redux';

/**
 * Debug component to test and visualize online status
 * Shows current online users and provides test buttons
 */
export const OnlineStatusDebug = () => {
  const { onlineUsers, sendHeartbeat, setOffline } = useOnlineStatus();
  const { profile } = useSelector(({settings}) => settings);

  return (
    <div className="fixed top-4 right-4 bg-white border-2 border-blue-500 rounded-lg shadow-lg p-4 max-w-sm z-[9999] pointer-events-auto">
      <h3 className="font-bold text-lg mb-2 text-blue-600">🔴 Online Status Debug</h3>
      
      <div className="mb-2 bg-yellow-50 border border-yellow-200 rounded p-2">
        <p className="text-xs font-semibold text-yellow-800 mb-1">Your ID:</p>
        <p className="text-xs font-mono text-yellow-900 break-all">{profile?.client?.id || 'Loading...'}</p>
      </div>
      
      <div className="mb-3">
        <p className="text-sm font-semibold mb-1">Online Users ({onlineUsers.size}):</p>
        <div className="bg-gray-100 rounded p-2 max-h-32 overflow-y-auto">
          {onlineUsers.size === 0 ? (
            <p className="text-xs text-gray-500 italic">No users online</p>
          ) : (
            <ul className="text-xs space-y-1">
              {Array.from(onlineUsers).map(userId => (
                <li key={userId} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="font-mono">{userId.substring(0, 8)}...</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => {
            console.log('🧪 Manual heartbeat test');
            sendHeartbeat();
          }}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-2 px-3 rounded transition-colors"
        >
          💓 Send Heartbeat
        </button>
        <button
          onClick={() => {
            console.log('🧪 Manual offline test');
            setOffline();
          }}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs py-2 px-3 rounded transition-colors"
        >
          🔴 Go Offline
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-2 italic">
        Check browser console for detailed logs
      </p>
    </div>
  );
};

