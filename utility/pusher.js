import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Required by Laravel Echo
if (typeof window !== 'undefined') {
    window.Pusher = Pusher;
}

class PusherService {
    constructor() {
        this.echo = null;
        this.pusher = null; // Keep for backward compatibility with direct access
        this.channels = new Map();
        this.options = null;
    }

    initialize() {
        if (this.echo) return;

        const token = localStorage.getItem('old_token');
        if (!token) {
            console.error('No authentication token found');
            return;
        }

        // Set default API URL to match Laravel's URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        
        this.options = {
            broadcaster: 'pusher',
            key: process.env.NEXT_PUBLIC_PUSHER_KEY || '6536db454316e302c142',
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'us2',
            forceTLS: true,
            authEndpoint: `${apiUrl}/broadcasting/auth`,
            auth: {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        };

        try {
            this.echo = new Echo(this.options);
            
            // Store the underlying Pusher instance for backward compatibility
            this.pusher = this.echo.connector.pusher;

            this.pusher.connection.bind('connecting', () => {
                console.log('🔌 Connecting to Pusher...');
            });

            this.pusher.connection.bind('connected', () => {
                console.log('✅ Connected to Pusher');
                console.log('Connection state:', this.pusher.connection.state);
            });

            this.pusher.connection.bind('error', (err) => {
                console.error('⚠️ Pusher connection error:', err);
                
                // Only handle critical errors, ignore temporary network issues
                if (err.error?.data?.code === 4004) {
                    console.error('❌ Pusher: Over connection limit');
                } else if (err.error?.data?.code === 4100) {
                    console.error('❌ Pusher: Invalid API key');
                } else if (err.type === 'AuthError' || err.error?.type === 'AuthError') {
                    console.error('❌ Pusher: Authentication error. Token might be expired.');
                    this.handleAuthError();
                } else {
                    // Log but don't act on temporary errors
                    console.warn('⚠️ Pusher temporary error (will retry):', err.type || err);
                }
            });

            this.pusher.connection.bind('disconnected', () => {
                console.log('❌ Disconnected from Pusher');
            });

        } catch (error) {
            console.error('Error initializing Pusher/Echo:', error);
        }
    }

    handleAuthError(){
        console.log("from handle error")
    }

    subscribeToChannel(channelName, events = {}) {
        if (!this.pusher) {
            console.error('Pusher/Echo not initialized');
            return null;
        }

        if (this.channels.has(channelName)) {
            return this.channels.get(channelName);
        }

        // Get the current token
        const token = localStorage.getItem('old_token');
        if (!token) {
            console.error('No authentication token found');
            return null;
        }

        // Update auth headers with current token
        if (this.echo?.connector?.options?.auth?.headers) {
            this.echo.connector.options.auth.headers.Authorization = `Bearer ${token}`;
        }

        // Use underlying Pusher to subscribe (same as old behavior)
        const channel = this.pusher.subscribe(channelName);

        // Bind subscription events
        channel.bind('pusher:subscription_succeeded', () => {
            console.log(`✅ Successfully subscribed to ${channelName}`);
        });

        channel.bind('pusher:subscription_error', (error) => {
            console.error(`❌ Subscription error for ${channelName}:`, error);
            if (error.type === 'AuthError' || error.error?.type === 'AuthError') {
                console.error('❌ Authentication failed for channel subscription');
                this.handleAuthError();
            }
        });

        // Bind custom events using Pusher's bind method (exact same as old code)
        Object.entries(events).forEach(([event, callback]) => {
            console.log(`Binding event ${event} to channel ${channelName}`);
            channel.bind(event, callback);
        });

        this.channels.set(channelName, channel);
        return channel;
    }

    unsubscribeFromChannel(channelName) {
        if (!this.pusher || !this.channels.has(channelName)) return;

        console.log(`Unsubscribing from channel: ${channelName}`);
        
        // Use underlying Pusher to unsubscribe (same as old behavior)
        this.pusher.unsubscribe(channelName);
        this.channels.delete(channelName);
    }

    disconnect() {
        if (!this.echo) return;

        console.log('Disconnecting Pusher/Echo');
        this.channels.clear();
        this.echo.disconnect();
        this.echo = null;
        this.pusher = null;
        this.options = null;
    }
}

export const pusherService = new PusherService();
export default pusherService;