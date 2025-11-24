import { pusherService } from '@/utility/pusher';
import { useEffect, useCallback } from 'react';

export const useChatPusher = (conversationId, onMessageReceived, onTyping) => {
    const subscribeToChat = useCallback(() => {
        if (!conversationId) {
            console.log('⏭️ No conversation ID, skipping Pusher subscription');
            return;
        }

        const channelName = `private-conversation.${conversationId}`;
        console.log(`🔌 Subscribing to Pusher channel: ${channelName}`);
        
        const events = {
            'MessageSent': (data) => {
                console.log('✉️ MessageSent event received:', data);
                onMessageReceived?.(data);
            },
            'UserTyping': (data) => {
                console.log('⌨️ UserTyping event received:', data);
                onTyping?.(data);
            }
        };

        const channel = pusherService.subscribeToChannel(channelName, events);
        
        if (channel) {
            console.log(`✅ Successfully set up channel: ${channelName}`);
        } else {
            console.error(`❌ Failed to subscribe to channel: ${channelName}`);
        }
        
        return channel;
    }, [conversationId, onMessageReceived, onTyping]);

    useEffect(() => {
        const channel = subscribeToChat();

        return () => {
            if (channel && conversationId) {
                const channelName = `private-conversation.${conversationId}`;
                pusherService.unsubscribeFromChannel(channelName);
            }
        };
    }, [conversationId, subscribeToChat]);
};