import { useEffect, useState, useCallback } from 'react';
import api from '@/helpers/axios';
import { pusherService } from '@/utility/pusher';

/**
 * Custom hook to manage online status tracking
 * - Sends heartbeat to server every 60 seconds
 * - Listens for online/offline events from Pusher
 * - Sets user offline on page unload
 */
export const useOnlineStatus = () => {
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [heartbeatInterval, setHeartbeatInterval] = useState(null);
  const [appearOnline, setAppearOnline] = useState(true); // User's online visibility preference

  // Send heartbeat to server (only if user wants to appear online)
  const sendHeartbeat = useCallback(async () => {
    if (!appearOnline) {
      // User chose to appear offline, send offline signal instead
      try {
        await api.post('/online-status/offline');
      } catch (error) {
        console.error('❌ Failed to set offline:', error.response?.data?.message || error.message);
      }
      return;
    }

    try {
      const response = await api.post('/online-status/heartbeat');
      // console.log('💓 Heartbeat sent');
      
      // Add ourselves to the online users list
      // (since we don't receive our own broadcast)
      const userId = response.data?.data?.user_id;
      if (userId) {
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.add(String(userId));
          return newSet;
        });
      }
    } catch (error) {
      console.error('❌ Failed to send heartbeat:', error.response?.data?.message || error.message);
    }
  }, [appearOnline]);

  // Set user offline
  const setOffline = useCallback(async () => {
    try {
      await api.post('/online-status/offline');
      console.log('👋 Set to offline');
    } catch (error) {
      console.error('❌ Failed to set offline:', error);
    }
  }, []);

  // Handle online status updates from Pusher
  const handleOnlineStatusUpdate = useCallback((data) => {
    setOnlineUsers(prev => {
      const newSet = new Set(prev);
      if (data.is_online) {
        newSet.add(String(data.user_id));
        console.log('🟢 User online:', data.user_id.substring(0, 8) + '...', '| Total:', newSet.size + 1);
      } else {
        newSet.delete(String(data.user_id));
        console.log('⚫ User offline:', data.user_id.substring(0, 8) + '...', '| Total:', newSet.size - 1);
      }
      return newSet;
    });
  }, []);

  // Fetch currently online users
  const fetchOnlineUsers = useCallback(async () => {
    try {
      const response = await api.get('/online-status/current');
      const users = response.data?.data || [];
      
      setOnlineUsers(new Set(users.map(userId => String(userId))));
      console.log('✅ Loaded', users.length, 'online users');
    } catch (error) {
      console.error('❌ Failed to fetch online users:', error.response?.data?.message || error.message);
    }
  }, []);

  // Initialize online status tracking
  useEffect(() => {
    console.log('🚀 Initializing online status tracking');

    // Fetch currently online users first
    fetchOnlineUsers();
    
    // Send initial heartbeat
    sendHeartbeat();
    
    // Optional: Debug log (commented out for production)
    // const debugInterval = setInterval(() => {
    //   console.log('📊 Online users:', onlineUsers.size);
    // }, 5000);

    // Set up heartbeat interval (every 60 seconds)
    const interval = setInterval(() => {
      sendHeartbeat();
    }, 60000); // 60 seconds

    setHeartbeatInterval(interval);

    // Subscribe to online status channel
    if (!pusherService.pusher) {
      pusherService.initialize();
    }
    
    // Wait a bit for Pusher to connect
    setTimeout(() => {
      if (pusherService.pusher) {
        const channel = pusherService.pusher.subscribe('online-status');
        
        channel.bind('pusher:subscription_succeeded', () => {
          console.log('✅ Online status tracking active');
        });
        
        channel.bind('pusher:subscription_error', (error) => {
          console.error('❌ Online status subscription failed:', error);
        });
        
        channel.bind('UserOnlineStatus', handleOnlineStatusUpdate);
      }
    }, 1000);

    // Set user offline when page unloads
    const handleBeforeUnload = () => {
      // Set offline synchronously before page closes
      setOffline();
    };

    // Handle visibility change (tab switching)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        sendHeartbeat();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      if (interval) clearInterval(interval);
      // if (debugInterval) clearInterval(debugInterval);
      
      if (pusherService.pusher) {
        pusherService.pusher.unsubscribe('online-status');
      }
      
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      // Set offline on component unmount
      setOffline();
    };
  }, []); // Empty dependency array - only run once

  // Toggle online/offline appearance
  const toggleOnlineStatus = useCallback((shouldBeOnline) => {
    setAppearOnline(shouldBeOnline);
    
    // Save preference to localStorage
    localStorage.setItem('appear_online', shouldBeOnline ? 'true' : 'false');
    
    if (shouldBeOnline) {
      // Send heartbeat immediately to appear online
      sendHeartbeat();
    } else {
      // Set offline immediately
      setOffline();
    }
  }, [sendHeartbeat, setOffline]);

  // Load saved preference on mount
  useEffect(() => {
    const savedPref = localStorage.getItem('appear_online');
    if (savedPref !== null) {
      setAppearOnline(savedPref === 'true');
    }
  }, []);

  // Helper function to check if a user is online
  const isUserOnline = useCallback((userId) => {
    if (!userId) return false;
    const userIdStr = String(userId);
    const online = onlineUsers.has(userIdStr);
    // console.log(`🔍 Checking user ${userIdStr.substring(0, 8)}... | Online:`, online, '| In set:', Array.from(onlineUsers).map(id => id.substring(0, 8)));
    return online;
  }, [onlineUsers]);

  return {
    onlineUsers,
    isUserOnline,
    sendHeartbeat,
    setOffline,
    appearOnline,
    toggleOnlineStatus
  };
};

