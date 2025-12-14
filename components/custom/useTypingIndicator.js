import { useState, useCallback, useRef, useEffect } from 'react';
import api from '@/helpers/axios';
import { pusherService } from '@/utility/pusher';

/**
 * Custom hook to manage typing indicators
 * - Detects when user is typing
 * - Sends typing events to server (throttled)
 * - Listens for other users' typing events via Pusher
 * - Auto-stops typing indicator after inactivity
 */
export const useTypingIndicator = (conversationId, currentUserId) => {
  const [typingUsers, setTypingUsers] = useState(new Set());
  const typingTimeoutRef = useRef(null);
  const lastTypingTimeRef = useRef(0);
  const isTypingRef = useRef(false);
  const handleTypingEventRef = useRef(null);

  // Throttle typing events (max once per 2 seconds)
  const TYPING_THROTTLE = 2000;
  // Auto-stop typing after 3 seconds of no input
  const TYPING_TIMEOUT = 3000;

  // Send typing event to server
  const sendTypingEvent = useCallback(async (isTyping) => {
    if (!conversationId || !currentUserId) return;

    try {
      const typingValue = Boolean(isTyping);
      await api.post('/chat/typing', {
        conversation_id: conversationId,
        is_typing: typingValue
      });
    } catch (error) {
      console.error('Failed to send typing event:', error);
    }
  }, [conversationId, currentUserId]);

  // Handle user typing
  const handleTyping = useCallback(() => {
    const now = Date.now();
    
    // Throttle: Only send if enough time has passed
    if (now - lastTypingTimeRef.current < TYPING_THROTTLE) {
      // Reset timeout even if we don't send event
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        isTypingRef.current = false;
        sendTypingEvent(false);
      }, TYPING_TIMEOUT);
      return;
    }

    lastTypingTimeRef.current = now;

    // Send "is typing" event
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      sendTypingEvent(true);
    }

    // Clear previous timeout
    clearTimeout(typingTimeoutRef.current);

    // Set timeout to stop typing
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      sendTypingEvent(false);
    }, TYPING_TIMEOUT);
  }, [sendTypingEvent, TYPING_THROTTLE, TYPING_TIMEOUT]);

  // Handle user stopped typing
  const handleStopTyping = useCallback(() => {
    clearTimeout(typingTimeoutRef.current);
    if (isTypingRef.current) {
      isTypingRef.current = false;
      sendTypingEvent(false);
    }
  }, [sendTypingEvent]);

  // Handle typing event from Pusher
  const handleTypingEvent = useCallback((data) => {
    const { user_id, is_typing } = data;
    
    // Don't show typing indicator for current user
    if (String(user_id) === String(currentUserId)) {
      return;
    }

    setTypingUsers(prev => {
      const newSet = new Set(prev);
      if (is_typing) {
        newSet.add(String(user_id));
      } else {
        newSet.delete(String(user_id));
      }
      return newSet;
    });

    // Auto-remove typing indicator after timeout
    if (is_typing) {
      setTimeout(() => {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(String(user_id));
          return newSet;
        });
      }, TYPING_TIMEOUT + 1000);
    }
  }, [currentUserId, TYPING_TIMEOUT]);

  // Store the latest handler in a ref
  useEffect(() => {
    handleTypingEventRef.current = handleTypingEvent;
  }, [handleTypingEvent]);

  // Subscribe to typing events for this conversation
  useEffect(() => {
    if (!conversationId || !pusherService.pusher) {
      return;
    }

    const channelName = `private-conversation.${conversationId}`;
    const channel = pusherService.pusher.subscribe(channelName);

    // Use a wrapper function that calls the ref
    const typingEventHandler = (data) => {
      if (handleTypingEventRef.current) {
        handleTypingEventRef.current(data);
      }
    };

    channel.bind('UserTyping', typingEventHandler);

    return () => {
      channel.unbind('UserTyping', typingEventHandler);
    };
  }, [conversationId, currentUserId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(typingTimeoutRef.current);
      handleStopTyping();
    };
  }, [handleStopTyping]);

  // Check if anyone is typing
  const isAnyoneTyping = typingUsers.size > 0;

  // Get list of typing user IDs
  const getTypingUserIds = useCallback(() => {
    return Array.from(typingUsers);
  }, [typingUsers]);

  return {
    handleTyping,
    handleStopTyping,
    isAnyoneTyping,
    typingUsers,
    getTypingUserIds
  };
};

