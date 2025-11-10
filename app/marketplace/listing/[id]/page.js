"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaChevronLeft, FaChevronRight, FaBookmark, FaEllipsisH } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { startConversation, sendMessage, getAllChat } from "@/views/message/store";
import { getUserProfile } from "@/views/settings/store";
import api from "@/helpers/axios";
import moment from "moment";
import toast from "react-hot-toast";

export default function ListingDetailPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const { allChat } = useSelector(({ chat }) => chat);
  const { profile } = useSelector(({ settings }) => settings);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [message, setMessage] = useState("Good afternoon, is this still available?");
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [sellerInfo, setSellerInfo] = useState(null);

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
          
          // Fetch seller info if client_id exists
          if (listingData.client_id) {
            try {
              const sellerResponse = await dispatch(getUserProfile(listingData.client_id)).unwrap();
              if (sellerResponse?.client) {
                setSellerInfo(sellerResponse.client);
              }
            } catch (error) {
              console.error("Error fetching seller info:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchListing();
      dispatch(getAllChat()); // Load all conversations to check for existing chat
    }
  }, [params.id, dispatch]);

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

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (!listing) {
      toast.error("Product information not available");
      return;
    }

    const sellerId = listing.client_id || listing.user_id || listing.seller_id;
    if (!sellerId) {
      toast.error("Seller information not available");
      return;
    }

    // Don't allow messaging yourself
    if (sellerId === profile?.client?.id) {
      toast.error("You cannot message yourself");
      return;
    }

    setSendingMessage(true);

    try {
      // Helper function to find conversation by seller ID
      const findConversationBySellerId = (chats, sellerId) => {
        if (!chats || !Array.isArray(chats)) {
          console.log("findConversationBySellerId: chats is not an array", chats);
          return null;
        }
        
        console.log(`Searching for conversation with sellerId: ${sellerId} in ${chats.length} chats`);
        
        const found = chats.find(chat => {
          // Log each chat for debugging
          console.log("Checking chat:", {
            id: chat.id,
            user_ids: chat.user_ids,
            participants: chat.participants,
            other_user: chat.other_user,
            is_group: chat.is_group
          });
          
          // Check user_ids field (can be array or single value)
          if (chat.user_ids !== undefined && chat.user_ids !== null) {
            const userIds = Array.isArray(chat.user_ids) ? chat.user_ids : [chat.user_ids];
            if (userIds.some(id => Number(id) === Number(sellerId))) {
              console.log("Found conversation by user_ids");
              return true;
            }
          }
          
          // Check participants array
          if (chat.participants && Array.isArray(chat.participants)) {
            if (chat.participants.some(p => 
              Number(p.id) === Number(sellerId) || 
              Number(p.user_id) === Number(sellerId) ||
              Number(p.client_id) === Number(sellerId)
            )) {
              console.log("Found conversation by participants");
              return true;
            }
          }
          
          // Check if it's a direct message and check the other user
          if (chat.is_group === 0 || chat.is_group === false || !chat.is_group) {
            // For direct messages, check if the other participant is the seller
            if (chat.other_user?.id === Number(sellerId) || 
                chat.other_user?.user_id === Number(sellerId) ||
                chat.other_user?.client_id === Number(sellerId)) {
              console.log("Found conversation by other_user");
              return true;
            }
          }
          
          // Check name field (sometimes conversations are identified by name)
          if (chat.name) {
            const sellerName = sellerInfo 
              ? `${sellerInfo.fname} ${sellerInfo.last_name}`.toLowerCase()
              : listing.client?.fname && listing.client?.last_name
              ? `${listing.client.fname} ${listing.client.last_name}`.toLowerCase()
              : null;
            
            if (sellerName && chat.name.toLowerCase() === sellerName) {
              console.log("Found conversation by name");
              return true;
            }
          }
          
          return false;
        });
        
        if (found) {
          console.log("Found conversation:", found);
        } else {
          console.log("No conversation found with sellerId:", sellerId);
        }
        
        return found || null;
      };

      // ALWAYS refresh chat list first to get the most up-to-date data
      let conversation = null;
      
      // First, try to get fresh data from Redux
      try {
        const refreshedChats = await dispatch(getAllChat()).unwrap();
        conversation = findConversationBySellerId(refreshedChats, sellerId);
      } catch (e) {
        console.error("Error refreshing chats:", e);
      }
      
      // If still not found, try direct API call (bypass Redux)
      if (!conversation) {
        try {
          const directResponse = await api.get('/chat');
          const directChats = directResponse.data?.data || directResponse.data || [];
          conversation = findConversationBySellerId(directChats, sellerId);
          
          // If found via direct API, update Redux store
          if (conversation) {
            await dispatch(getAllChat());
          }
        } catch (apiError) {
          console.error("Error fetching chats directly:", apiError);
        }
      }

      // Only try to create if we're absolutely sure no conversation exists
      if (!conversation) {
          const sellerName = sellerInfo 
            ? `${sellerInfo.fname} ${sellerInfo.last_name}`
            : listing.client?.fname && listing.client?.last_name
            ? `${listing.client.fname} ${listing.client.last_name}`
            : "Seller";

          const sellerAvatar = sellerInfo?.image
            ? `${process.env.NEXT_PUBLIC_CLIENT_FILE_PATH}${sellerInfo.image}`
            : listing.client?.image
            ? `${process.env.NEXT_PUBLIC_CLIENT_FILE_PATH}${listing.client.image}`
            : "/common-avator.jpg";

          const conversationData = {
            is_group: 0,
            name: sellerName,
            avatar: sellerAvatar,
            user_ids: sellerId
          };

          // Use direct API call instead of thunk to avoid error toast
          try {
            const createResponse = await api.post('/chat', conversationData);
            console.log("Create conversation response:", createResponse.data);
            
            // Handle different response structures
            if (createResponse.data?.data?.conversation?.id) {
              conversation = createResponse.data.data.conversation;
              console.log("Got conversation from response.data.data.conversation:", conversation);
            } else if (createResponse.data?.data?.id) {
              conversation = { id: createResponse.data.data.id };
              console.log("Got conversation ID from response.data.data.id:", conversation);
            } else if (createResponse.data?.conversation?.id) {
              conversation = createResponse.data.conversation;
              console.log("Got conversation from response.data.conversation:", conversation);
            } else if (createResponse.data?.id) {
              conversation = { id: createResponse.data.id };
              console.log("Got conversation ID from response.data.id:", conversation);
            } else if (createResponse.data?.data) {
              // If data exists but structure is unclear, try to extract ID
              const data = createResponse.data.data;
              if (data.id) {
                conversation = { id: data.id };
              } else if (typeof data === 'object' && Object.keys(data).length > 0) {
                // Try to find id in the data object
                conversation = data;
              }
            }
            
            // Update Redux store after successful creation
            if (conversation?.id) {
              await dispatch(getAllChat());
            } else {
              // If we didn't get conversation, refresh and try to find it
              console.log("Conversation created but ID not found in response, refreshing...");
              const refreshedChats = await dispatch(getAllChat()).unwrap();
              conversation = findConversationBySellerId(refreshedChats, sellerId);
            }
          } catch (createError) {
            // Check if it's "conversation already exists" error
            const errorStatus = createError?.response?.status;
            const errorMessage = createError?.response?.data?.message || '';
            const isAlreadyExistsError = 
              errorStatus === 400 && 
              (errorMessage.toLowerCase().includes("already exists") ||
               errorMessage.toLowerCase().includes("conversation"));

            if (isAlreadyExistsError) {
              // Suppress the error toast by not calling errorResponse
              console.log("Conversation already exists, finding it...");
              
              // Refresh chat list and find the existing conversation
              try {
                const updatedChats = await dispatch(getAllChat()).unwrap();
                conversation = findConversationBySellerId(updatedChats, sellerId);
                
                // If still not found, try direct API call
                if (!conversation) {
                  const directResponse = await api.get('/chat');
                  const directChats = directResponse.data?.data || directResponse.data || [];
                  conversation = findConversationBySellerId(directChats, sellerId);
                }
                
                // Check error response for conversation ID
                if (!conversation && createError?.response?.data) {
                  const errorData = createError.response.data;
                  let convId = errorData?.data?.conversation_id || 
                               errorData?.data?.id || 
                               errorData?.conversation_id || 
                               errorData?.id ||
                               errorData?.conversation?.id;
                  
                  if (convId) {
                    const allChats = await dispatch(getAllChat()).unwrap();
                    conversation = allChats?.find(chat => chat.id === Number(convId));
                  }
                }
              } catch (refreshError) {
                console.error("Error refreshing chats after create error:", refreshError);
              }
              
              // If still not found after all attempts, try to extract from error response
              if (!conversation && createError?.response?.data) {
                const errorData = createError.response.data;
                console.log("Error response data:", errorData);
                
                // Try to find conversation ID in error response
                let convId = errorData?.data?.conversation_id || 
                             errorData?.data?.id || 
                             errorData?.conversation_id || 
                             errorData?.id ||
                             errorData?.conversation?.id ||
                             errorData?.data?.conversation?.id;
                
                if (convId) {
                  console.log("Found conversation ID in error:", convId);
                  // Try to get the conversation by ID
                  try {
                    const allChats = await dispatch(getAllChat()).unwrap();
                    conversation = allChats?.find(chat => chat.id === Number(convId));
                    
                    if (!conversation) {
                      // Try direct API call to get conversation by ID
                      try {
                        const convResponse = await api.get(`/chat/${convId}/messages`);
                        if (convResponse.data?.conversation) {
                          conversation = { id: Number(convId), ...convResponse.data.conversation };
                        } else {
                          conversation = { id: Number(convId) };
                        }
                      } catch (e) {
                        console.error("Error fetching conversation by ID:", e);
                      }
                    }
                  } catch (e) {
                    console.error("Error getting chats:", e);
                  }
                }
              }
              
              // If still not found, try to extract conversation ID from error response more thoroughly
              if (!conversation && createError?.response?.data) {
                const errorData = createError.response.data;
                console.log("Error response data (full):", JSON.stringify(errorData, null, 2));
                
                // Try to find conversation ID in error response - check all possible locations
                let convId = errorData?.data?.conversation_id || 
                             errorData?.data?.id || 
                             errorData?.conversation_id || 
                             errorData?.id ||
                             errorData?.conversation?.id ||
                             errorData?.data?.conversation?.id;
                
                // Also check if error message contains conversation ID
                if (!convId && errorData?.message) {
                  const idMatch = errorData.message.match(/conversation[_\s]*id[:\s]*(\d+)/i) || 
                                 errorData.message.match(/id[:\s]*(\d+)/i);
                  if (idMatch) {
                    convId = idMatch[1];
                  }
                }
                
                if (convId) {
                  console.log("Found conversation ID from error:", convId);
                  // Use the conversation ID directly - we don't need the full object
                  conversation = { id: Number(convId) };
                } else {
                  // Last resort: try to query all chats one more time with a more aggressive search
                  try {
                    const allChatsResponse = await api.get('/chat');
                    const allChats = allChatsResponse.data?.data || allChatsResponse.data || [];
                    
                    // Search through all chats more thoroughly - check every field
                    conversation = allChats.find(chat => {
                      // Convert entire chat object to string and search for seller ID
                      const chatStr = JSON.stringify(chat);
                      return chatStr.includes(String(sellerId));
                    });
                    
                    if (!conversation) {
                      console.error("Could not find conversation after all attempts");
                      toast.error("Could not find existing conversation. Please try again.");
                      setSendingMessage(false);
                      return;
                    }
                  } catch (finalErr) {
                    console.error("Final search failed:", finalErr);
                    toast.error("Could not find existing conversation. Please try again.");
                    setSendingMessage(false);
                    return;
                  }
                }
              } else if (!conversation) {
                toast.error("Could not find existing conversation. Please try again.");
                setSendingMessage(false);
                return;
              }
            } else {
              // For other errors, show error and throw
              console.error("Error creating conversation:", createError);
              toast.error(createError?.response?.data?.message || "Failed to create conversation");
              throw createError;
            }
          }
        }

      // If we still don't have a conversation ID, try one more time to find it
      if (!conversation?.id) {
        // Try to get conversation by making a request that might return it
        try {
          // Sometimes the backend returns the conversation in the error, let's check one more time
          const finalChats = await api.get('/chat');
          const finalChatsList = finalChats.data?.data || finalChats.data || [];
          
          // Try to find by seller ID one more time
          conversation = findConversationBySellerId(finalChatsList, sellerId);
          
          // If still not found, try to send message anyway - backend might handle it
          if (!conversation?.id) {
            console.log("No conversation ID found, but attempting to send message...");
            // We'll try to send the message and let the backend handle finding the conversation
            // But first, let's try to get conversation ID from a different endpoint
            try {
              // Try to get conversation by querying with seller ID
              const convQuery = await api.get(`/chat?user_id=${sellerId}`);
              if (convQuery.data?.data) {
                const convData = Array.isArray(convQuery.data.data) 
                  ? convQuery.data.data[0] 
                  : convQuery.data.data;
                if (convData?.id) {
                  conversation = { id: convData.id };
                }
              }
            } catch (queryErr) {
              console.log("Could not query conversation by user_id:", queryErr);
            }
          }
        } catch (finalErr) {
          console.error("Final attempt to find conversation failed:", finalErr);
        }
      }

      // If we still don't have conversation ID, try one final attempt to create it
      if (!conversation?.id) {
        console.log("Final attempt: Creating new conversation...");
        try {
          const sellerName = sellerInfo 
            ? `${sellerInfo.fname} ${sellerInfo.last_name}`
            : listing.client?.fname && listing.client?.last_name
            ? `${listing.client.fname} ${listing.client.last_name}`
            : "Seller";

          const sellerAvatar = sellerInfo?.image
            ? `${process.env.NEXT_PUBLIC_CLIENT_FILE_PATH}${sellerInfo.image}`
            : listing.client?.image
            ? `${process.env.NEXT_PUBLIC_CLIENT_FILE_PATH}${listing.client.image}`
            : "/common-avator.jpg";

          const conversationData = {
            is_group: 0,
            name: sellerName,
            avatar: sellerAvatar,
            user_ids: sellerId
          };

          // Try to create conversation one more time
          const createResponse = await api.post('/chat', conversationData);
          console.log("Final create conversation response:", createResponse.data);
          
          // Handle different response structures (same as above)
          if (createResponse.data?.data?.conversation?.id) {
            conversation = createResponse.data.data.conversation;
            console.log("Successfully created conversation:", conversation);
          } else if (createResponse.data?.data?.id) {
            conversation = { id: createResponse.data.data.id };
            console.log("Got conversation ID:", conversation);
          } else if (createResponse.data?.conversation?.id) {
            conversation = createResponse.data.conversation;
          } else if (createResponse.data?.id) {
            conversation = { id: createResponse.data.id };
          } else if (createResponse.data?.data) {
            const data = createResponse.data.data;
            if (data.id) {
              conversation = { id: data.id };
            } else if (typeof data === 'object' && Object.keys(data).length > 0) {
              conversation = data;
            }
          }
          
          // Update Redux store after successful creation
          if (conversation?.id) {
            await dispatch(getAllChat());
          } else {
            // If creation succeeded but structure is unexpected, refresh and find it
            console.log("Conversation created but ID not found, refreshing to find it...");
            const refreshedChats = await dispatch(getAllChat()).unwrap();
            conversation = findConversationBySellerId(refreshedChats, sellerId);
            
            // If still not found, try JSON string search
            if (!conversation) {
              conversation = refreshedChats.find(chat => {
                const chatStr = JSON.stringify(chat);
                return chatStr.includes(String(sellerId));
              });
            }
          }
        } catch (finalCreateError) {
          console.error("Final create attempt failed:", finalCreateError);
          
          // If it's "already exists" error, try to find it one more time
          if (finalCreateError?.response?.status === 400) {
            try {
              const allChatsResponse = await api.get('/chat');
              const allChats = allChatsResponse.data?.data || allChatsResponse.data || [];
              conversation = findConversationBySellerId(allChats, sellerId);
              
              // If still not found, try JSON string search as last resort
              if (!conversation) {
                conversation = allChats.find(chat => {
                  const chatStr = JSON.stringify(chat);
                  return chatStr.includes(String(sellerId));
                });
              }
            } catch (searchErr) {
              console.error("Final search failed:", searchErr);
            }
          }
        }
      }

      // If we STILL don't have conversation ID after all attempts, show error
      if (!conversation?.id) {
        console.error("All attempts failed. Seller ID:", sellerId, "All chats:", allChat);
        toast.error("Could not find or create conversation. Please try again.");
        setSendingMessage(false);
        return;
      }

      // Prepare message content with product context
      const productLink = `${window.location.origin}/marketplace/listing/${listing.id}`;
      const productInfo = `\n\n---\nProduct: ${listing.title}\nPrice: ${formatPrice(listing.price)}\nLink: ${productLink}`;
      const fullMessage = message.trim() + productInfo;

      // Send the message
      const messageData = {
        chatId: conversation.id,
        type: "text",
        content: fullMessage
      };

      try {
        await dispatch(sendMessage(messageData)).unwrap();

        toast.success("Message sent successfully!");
        
        // Clear message input
        setMessage("Good afternoon, is this still available?");
        
        // Stay on product details page - no redirect
      } catch (sendError) {
        console.error("Error sending message:", sendError);
        toast.error(sendError?.response?.data?.message || sendError?.message || "Failed to send message. Please try again.");
      }

    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      toast.error(error.message || "Failed to send message. Please try again.");
    } finally {
      setSendingMessage(false);
    }
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
            <Link
              href="/marketplace"
              className="inline-block text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors"
            >
              <FaChevronLeft className="w-5 h-5" />
            </Link>
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

              {/* Seller Info */}
              {sellerInfo && (
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                    <img
                      src={sellerInfo.image ? `${process.env.NEXT_PUBLIC_CLIENT_FILE_PATH}${sellerInfo.image}` : "/common-avator.jpg"}
                      alt={sellerInfo.fname}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      {sellerInfo.fname} {sellerInfo.last_name}
                    </p>
                    <p className="text-xs text-gray-500">Seller</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleSendMessage}
                  disabled={sendingMessage || !message.trim()}
                  className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {sendingMessage ? "Sending..." : "Message"}
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
                disabled={sendingMessage || !message.trim()}
                className="w-full mt-3 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingMessage ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
