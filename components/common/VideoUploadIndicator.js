"use client";

import React from 'react';
import { useVideoUpload } from '@/contexts/VideoUploadContext';
import { FaTimes, FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';

const VideoUploadIndicator = () => {
    const { isUploading, notification, cancelUpload, clearNotification } = useVideoUpload();

    // Don't render if nothing to show
    if (!isUploading && !notification) {
        return null;
    }

    return (
        <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-2">
            {/* Upload in progress indicator */}
            {isUploading && (
                <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 flex items-center gap-3 min-w-[280px] animate-slide-up">
                    <div className="relative">
                        <FaSpinner className="w-6 h-6 text-blue-500 animate-spin" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Processing post...</p>
                        <p className="text-xs text-gray-500">Your post is being uploaded</p>
                    </div>
                    <button
                        onClick={cancelUpload}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Cancel upload"
                    >
                        <FaTimes size={14} />
                    </button>
                </div>
            )}

            {/* Success/Error notification */}
            {notification && (
                <div
                    className={`rounded-lg shadow-xl border p-4 flex items-center gap-3 min-w-[280px] animate-slide-up ${notification.type === 'success'
                        ? 'bg-green-50 border-green-200'
                        : notification.type === 'error'
                            ? 'bg-red-50 border-red-200'
                            : 'bg-blue-50 border-blue-200'
                        }`}
                >
                    {notification.type === 'success' ? (
                        <FaCheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    ) : notification.type === 'error' ? (
                        <FaExclamationCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                    ) : (
                        <FaSpinner className="w-6 h-6 text-blue-500 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                        <p className={`text-sm font-medium ${notification.type === 'success'
                            ? 'text-green-800'
                            : notification.type === 'error'
                                ? 'text-red-800'
                                : 'text-blue-800'
                            }`}>
                            {notification.message}
                        </p>
                    </div>
                    <button
                        onClick={clearNotification}
                        className={`p-1 transition-colors ${notification.type === 'success'
                            ? 'text-green-400 hover:text-green-600'
                            : notification.type === 'error'
                                ? 'text-red-400 hover:text-red-600'
                                : 'text-blue-400 hover:text-blue-600'
                            }`}
                        title="Dismiss"
                    >
                        <FaTimes size={14} />
                    </button>
                </div>
            )}

            {/* CSS animation */}
            <style jsx global>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

export default VideoUploadIndicator;
