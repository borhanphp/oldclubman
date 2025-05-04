"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  FaSearch, FaUserFriends, FaSmile, FaPaperclip, FaPaperPlane, 
  FaCheckCircle, FaImage, FaFile, FaFileAlt, FaFilePdf, 
  FaFileWord, FaFileExcel, FaFileImage, FaTimesCircle, 
  FaCommentAlt, FaAddressBook, FaEnvelope
} from 'react-icons/fa';

const MessagingContent = () => {
  // State for active chats
  const [activeChats, setActiveChats] = useState([
    { id: 1, name: 'Sharif', message: 'hi', time: '27/04', isOnline: true, unread: 0 },
    { id: 2, name: 'Md Saiful', message: 'hi', time: '27/04', isOnline: false, unread: 2 },
    { id: 3, name: 'John Doe', message: 'Hello there!', time: '26/04', isOnline: true, unread: 1 },
    { id: 4, name: 'Jane Smith', message: 'Are you available?', time: '25/04', isOnline: false, unread: 0 }
  ]);

  // State for contacts
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Sharif', status: 'Works at Google', isOnline: true },
    { id: 2, name: 'Md Saiful', status: 'Works at Facebook', isOnline: false },
    { id: 3, name: 'John Doe', status: 'Business Owner', isOnline: true },
    { id: 4, name: 'Jane Smith', status: 'Freelancer', isOnline: false },
    { id: 5, name: 'Robert Johnson', status: 'Web Developer', isOnline: true },
    { id: 6, name: 'Emily Davis', status: 'UI/UX Designer', isOnline: false }
  ]);

  // State for current chat
  const [currentChat, setCurrentChat] = useState({
    id: 1,
    name: 'Sharif',
    isOnline: true,
    messages: [
      { id: 1, text: 'hi', sent: false, time: '27 Apr 25, 04:08 pm', read: true },
      { id: 2, text: 'hi', sent: true, time: '27 Apr 25, 04:08 pm', read: true }
    ]
  });

  // Tab state
  const [activeTab, setActiveTab] = useState('chats');

  // Other states
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // State for file uploads
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  
  const messagesEndRef = useRef(null);

  // Filter chats based on search term
  const filteredChats = activeChats.filter(chat => 
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter contacts based on search term
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat.messages]);

  // Handle chat selection
  const handleChatSelect = (chatId) => {
    const selectedChat = activeChats.find(chat => chat.id === chatId);
    
    // Mark messages as read when selecting a chat
    const updatedChats = activeChats.map(chat => 
      chat.id === chatId ? { ...chat, unread: 0 } : chat
    );
    setActiveChats(updatedChats);
    
    // Set the current chat
    if (selectedChat) {
      setCurrentChat({
        id: selectedChat.id,
        name: selectedChat.name,
        isOnline: selectedChat.isOnline,
        messages: currentChat.id === chatId ? currentChat.messages : [
          { id: 1, text: 'hi', sent: false, time: '27 Apr 25, 04:08 pm', read: true },
          { id: 2, text: 'hi', sent: true, time: '27 Apr 25, 04:08 pm', read: true }
        ]
      });
    }
  };

  // Handle contact selection
  const handleContactSelect = (contactId) => {
    const selectedContact = contacts.find(contact => contact.id === contactId);
    
    if (selectedContact) {
      // Check if there's already a chat with this contact
      const existingChat = activeChats.find(chat => chat.id === selectedContact.id);
      
      if (!existingChat) {
        // Create a new chat if none exists
        const newChat = {
          id: selectedContact.id,
          name: selectedContact.name,
          message: 'Start a conversation',
          time: 'New',
          isOnline: selectedContact.isOnline,
          unread: 0
        };
        
        setActiveChats(prev => [newChat, ...prev]);
      }
      
      // Set current chat and switch to chats tab
      setCurrentChat({
        id: selectedContact.id,
        name: selectedContact.name,
        isOnline: selectedContact.isOnline,
        messages: existingChat ? currentChat.messages : []
      });
      
      setActiveTab('chats');
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Get file icon based on type
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    switch(extension) {
      case 'pdf':
        return <FaFilePdf className="text-red-500" size={24} />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="text-blue-500" size={24} />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel className="text-green-500" size={24} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FaFileImage className="text-purple-500" size={24} />;
      default:
        return <FaFileAlt className="text-gray-500" size={24} />;
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (newMessage.trim() === '' && !selectedFile) return;
    
    // Get current timestamp
    const now = new Date();
    const options = { 
      day: '2-digit', 
      month: 'short', 
      year: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    };
    const timeString = now.toLocaleString('en-US', options).replace(',', '');
    
    // Create new message
    const newMessageObj = {
      id: currentChat.messages.length + 1,
      text: newMessage,
      sent: true,
      time: timeString,
      read: false,
      file: selectedFile ? {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type
      } : null
    };
    
    // Update messages in current chat
    setCurrentChat(prev => ({
      ...prev,
      messages: [...prev.messages, newMessageObj]
    }));
    
    // Update chat list preview
    const previewText = selectedFile 
      ? `${newMessage || 'Sent a file'}: ${selectedFile.name}`
      : newMessage;
      
    setActiveChats(prev => prev.map(chat => 
      chat.id === currentChat.id 
        ? { ...chat, message: previewText, time: timeString.split(',')[0] } 
        : chat
    ));
    
    // Clear input and file
    setNewMessage('');
    setSelectedFile(null);
    
    // Simulate response after delay (for demo purposes)
    setIsTyping(true);
    setTimeout(() => {
      const responseMsg = {
        id: currentChat.messages.length + 2,
        text: getRandomResponse(),
        sent: false,
        time: new Date().toLocaleString('en-US', options).replace(',', ''),
        read: true
      };
      
      setCurrentChat(prev => ({
        ...prev,
        messages: [...prev.messages, responseMsg]
      }));
      
      setIsTyping(false);
    }, 2000);
  };

  // Remove selected file
  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  // Get random response for demo
  const getRandomResponse = () => {
    const responses = [
      "Hi there! How can I help you?",
      "Thanks for your message!",
      "I'll get back to you soon.",
      "That sounds great!",
      "Can you provide more details?",
      "Let me check and get back to you.",
      "Thanks for sharing the file!"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Handle key press to send message
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Tab switching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };
  
  return (
    <div className="messaging-content bg-gray-100 min-h-screen">
      <div className="container mx-auto py-4">
        <div className="messaging-container bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex h-[calc(100vh-140px)]">
            {/* Left Sidebar */}
            <div className="flex border-r border-gray-200">
              {/* Tabs on left side */}
              <div className="w-16 bg-gray-50 border-r border-gray-200 flex flex-col items-center pt-4">
                <button 
                  className={`w-12 h-12 mb-2 rounded-full flex items-center justify-center ${activeTab === 'chats' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                  onClick={() => handleTabChange('chats')}
                >
                  <FaCommentAlt size={20} />
                </button>
                <button 
                  className={`w-12 h-12 mb-2 rounded-full flex items-center justify-center ${activeTab === 'contacts' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'}`}
                  onClick={() => handleTabChange('contacts')}
                >
                  <FaUserFriends size={20} />
                </button>
              </div>
              
              {/* Content area */}
              <div className="w-64 flex flex-col">
                {/* Tab title and search */}
                <div className="p-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold mb-2">
                    {activeTab === 'chats' ? 'Active Chats' : 'All Contacts'}
                  </h2>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaSearch className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder={activeTab === 'chats' ? "Search messages or users" : "Search contacts"}
                      className="bg-gray-100 w-full pl-10 pr-4 py-2 rounded-md text-sm focus:outline-none"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Chats List */}
                {activeTab === 'chats' && (
                  <div className="overflow-y-auto flex-1">
                    {filteredChats.length > 0 ? (
                      filteredChats.map(chat => (
                        <div 
                          key={chat.id} 
                          className={`flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${chat.id === currentChat.id ? 'bg-blue-50' : ''}`}
                          onClick={() => handleChatSelect(chat.id)}
                        >
                          <div className="relative mr-3">
                            <div className="w-10 h-10 rounded-full bg-orange-300 flex items-center justify-center text-white">
                              {chat.name.charAt(0)}
                            </div>
                            {chat.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <h3 className="text-sm font-medium truncate">{chat.name}</h3>
                              <span className="text-xs text-gray-500">{chat.time}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="text-xs text-gray-500 truncate">{chat.message}</p>
                              {chat.unread > 0 && (
                                <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                  {chat.unread}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <FaEnvelope className="mx-auto text-gray-300 text-4xl mb-2" />
                        <p>No conversations found</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Contacts List */}
                {activeTab === 'contacts' && (
                  <div className="overflow-y-auto flex-1">
                    {filteredContacts.length > 0 ? (
                      filteredContacts.map(contact => (
                        <div 
                          key={contact.id} 
                          className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleContactSelect(contact.id)}
                        >
                          <div className="relative mr-3">
                            <div className="w-10 h-10 rounded-full bg-orange-300 flex items-center justify-center text-white">
                              {contact.name.charAt(0)}
                            </div>
                            {contact.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium truncate">{contact.name}</h3>
                            <p className="text-xs text-gray-500 truncate">{contact.status}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <FaAddressBook className="mx-auto text-gray-300 text-4xl mb-2" />
                        <p>No contacts found</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Bottom Action Button */}
                <div className="p-3 border-t border-gray-200">
                  <button className="flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 rounded-md p-2">
                    {activeTab === 'chats' ? (
                      <>
                        <FaUserFriends className="text-gray-600 mr-2" />
                        <span className="text-sm text-gray-600">All Contacts</span>
                      </>
                    ) : (
                      <>
                        <FaUserFriends className="text-gray-600 mr-2" />
                        <span className="text-sm text-gray-600">Add New Contact</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative mr-3">
                    <div className="w-10 h-10 rounded-full bg-orange-300 flex items-center justify-center text-white">
                      {currentChat.name.charAt(0)}
                    </div>
                    {currentChat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{currentChat.name}</h3>
                    <p className="text-xs text-gray-500">
                      {isTyping ? 'Typing...' : currentChat.isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                {/* <div className="flex">
                  <button className="text-gray-400 hover:text-gray-600 mr-3">
                    <FaImage />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <FaSearch />
                  </button>
                </div> */}
              </div>
              
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {currentChat.messages.length > 0 ? (
                  <div className="space-y-4">
                    {currentChat.messages.map(message => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.sent ? 'justify-end' : 'justify-start'}`}
                      >
                        {!message.sent && (
                          <div className="w-8 h-8 rounded-full bg-orange-300 flex items-center justify-center text-white mr-2">
                            {currentChat.name.charAt(0)}
                          </div>
                        )}
                        <div className={`max-w-xs ${message.sent ? 'bg-blue-500 text-white' : 'bg-white border border-gray-200'} rounded-lg p-3 shadow-sm`}>
                          {message.file && (
                            <div className={`p-3 mb-2 border rounded-md ${message.sent ? 'border-blue-400 bg-blue-400' : 'border-gray-200 bg-gray-50'}`}>
                              <div className="flex items-center">
                                {getFileIcon(message.file.name)}
                                <div className="ml-3 flex-1 min-w-0">
                                  <p className={`text-sm font-medium truncate ${message.sent ? 'text-white' : 'text-gray-800'}`}>
                                    {message.file.name}
                                  </p>
                                  <p className={`text-xs ${message.sent ? 'text-blue-100' : 'text-gray-500'}`}>
                                    {formatFileSize(message.file.size)}
                                  </p>
                                </div>
                                <a href="#" className={`ml-2 text-xs px-2 py-1 rounded ${message.sent ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                  Download
                                </a>
                              </div>
                            </div>
                          )}
                          {message.text && <p>{message.text}</p>}
                          <div className={`text-xs mt-1 flex justify-end items-center ${message.sent ? 'text-blue-100' : 'text-gray-500'}`}>
                            <span>{message.time}</span>
                            {message.sent && message.read && (
                              <FaCheckCircle className="ml-1 text-xs" />
                            )}
                          </div>
                        </div>
                        {message.sent && (
                          <div className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center text-white ml-2">
                            BU
                          </div>
                        )}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <FaCommentAlt className="text-gray-300 text-5xl mb-4" />
                    <p>No messages yet</p>
                    <p className="text-sm mt-2">Send a message to start the conversation</p>
                  </div>
                )}
              </div>
              
              {/* File Preview (if selected) */}
              {selectedFile && (
                <div className="px-3 bg-gray-100 border-t border-gray-200">
                  <div className="flex items-center p-2 bg-white border border-gray-200 rounded-md my-2">
                    {getFileIcon(selectedFile.name)}
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                    </div>
                    <button 
                      onClick={removeSelectedFile}
                      className="ml-2 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimesCircle />
                    </button>
                  </div>
                </div>
              )}
              
              {/* Message Input */}
              <div className="p-3 border-t border-gray-200 bg-white">
                <div className="flex items-center rounded-lg bg-gray-100 p-2">
                  <button className="text-gray-500 p-2 hover:text-gray-700">
                    <FaSmile />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button 
                    className="text-gray-500 p-2 hover:text-gray-700"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <FaPaperclip />
                  </button>
                  <input
                    type="text"
                    placeholder="Enter Message..."
                    className="flex-1 bg-transparent border-none outline-none px-3 py-1"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button 
                    className={`${(newMessage.trim() || selectedFile) ? 'bg-blue-500' : 'bg-gray-300'} text-white p-2 rounded-md`}
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() && !selectedFile}
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingContent; 