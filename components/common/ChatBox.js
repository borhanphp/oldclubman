"use client";

import React, { useState } from 'react';
import { FaTimes, FaPaperPlane, FaImage } from 'react-icons/fa';

const ChatBox = ({ user, onClose }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, { text: message, sent: true, timestamp: new Date() }]);
      setMessage('');
      // Here you would typically send the message to your backend
    }
  };

  return (
    <div className="fixed bottom-0 right-4 w-80 bg-white rounded-t-lg shadow-lg z-50">
      {/* Chat Header */}
      <div className="flex items-center justify-between bg-blue-600 p-3 rounded-t-lg cursor-pointer">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src={user?.image ? process.env.NEXT_PUBLIC_CLIENT_FILE_PATH + user.image : "/common-avator.jpg"}
              alt={user?.fname}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/common-avator.jpg";
              }}
            />
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">{user?.fname} {user?.last_name}</h3>
            <span className="text-xs text-green-400">●  Online</span>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <FaTimes />
        </button>
      </div>

      {/* Messages Area */}
      <div className="h-96 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex mb-3 ${msg.sent ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-2 ${
                msg.sent
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <span className="text-xs opacity-70">
                {new Date(msg.timestamp).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-3 bg-white border-t">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700"
          >
            <FaImage />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="text-blue-600 hover:text-blue-700 disabled:text-gray-400"
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox; 