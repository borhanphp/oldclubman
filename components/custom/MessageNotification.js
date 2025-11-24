import React, { useEffect } from 'react';
import { FaEnvelope, FaTimes } from 'react-icons/fa';

/**
 * Toast notification component for new messages
 */
export const MessageNotification = ({ notification, onClose, onClick }) => {
  useEffect(() => {
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      onClose(notification.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification.id, onClose]);

  return (
    <div
      className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 mb-3 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-slideIn max-w-sm"
      onClick={() => onClick(notification)}
    >
      <div className="flex items-start">
        {/* Avatar */}
        <div className="flex-shrink-0 mr-3">
          {notification.avatar && notification.avatar !== '/common-avator.jpg' ? (
            <img
              src={notification.avatar}
              alt={notification.senderName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500"
              onError={(e) => {
                e.target.src = '/common-avator.jpg';
                e.target.onerror = null;
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg ring-2 ring-blue-500">
              {(notification.senderName || 'U').charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-bold text-gray-900 truncate">
              {notification.senderName || 'Unknown User'}
            </h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose(notification.id);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="text-xs" />
            </button>
          </div>
          <p className="text-xs text-gray-600 line-clamp-2">
            {notification.messagePreview || 'New message'}
          </p>
          <div className="flex items-center mt-2">
            <FaEnvelope className="text-blue-500 text-xs mr-1" />
            <span className="text-xs text-blue-600 font-medium">New message</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Container for all message notifications
 */
export const MessageNotificationContainer = ({ notifications, onClose, onClick }) => {
  console.log('🔔 MessageNotificationContainer rendered with:', notifications);
  
  if (!notifications || notifications.length === 0) {
    console.log('🔔 No notifications to display');
    return null;
  }

  console.log(`🔔 Rendering ${notifications.length} notification(s)`);
  
  return (
    <div className="fixed top-20 right-4 z-[99999] space-y-3">
      {notifications.map((notification) => (
        <MessageNotification
          key={notification.id}
          notification={notification}
          onClose={onClose}
          onClick={onClick}
        />
      ))}
    </div>
  );
};

