# 🧪 Test Pusher Connection

## Quick Test in Browser Console

**Open your browser console (F12) and paste this:**

```javascript
// Test 1: Check if Pusher is loaded
console.log('Pusher object:', typeof Pusher);

// Test 2: Get current connection state
if (window.pusherService && window.pusherService.pusher) {
  console.log('✅ Pusher service exists');
  console.log('Connection state:', window.pusherService.pusher.connection.state);
  console.log('Active channels:', Array.from(window.pusherService.channels.keys()));
} else {
  console.log('❌ Pusher service not found');
}

// Test 3: Subscribe to test channel
const testChannel = new Pusher('6536db454316e302c142', {
  cluster: 'us2',
  forceTLS: true,
  authEndpoint: 'http://localhost/oldclubman/public/api/broadcasting/auth',
  auth: {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('old_token')}`
    }
  }
});

testChannel.connection.bind('connected', () => {
  console.log('✅ Test Pusher connected!');
});

testChannel.connection.bind('error', (err) => {
  console.error('❌ Test Pusher error:', err);
});

// Try subscribing to your conversation
const conversationId = 'a4c5bd56-cc9f-438e-b6d0-28a5344c5626'; // Replace with your actual ID
const channel = testChannel.subscribe(`private-conversation.${conversationId}`);

channel.bind('pusher:subscription_succeeded', () => {
  console.log('✅ Successfully subscribed to test channel!');
});

channel.bind('pusher:subscription_error', (error) => {
  console.error('❌ Subscription error:', error);
});

channel.bind('MessageSent', (data) => {
  console.log('🎉 MESSAGE RECEIVED VIA PUSHER!', data);
});

console.log('Test setup complete. Now send a message and watch for events...');
```

## What Should Happen

After pasting and running, you should see:
1. `✅ Pusher service exists`
2. `Connection state: connected`
3. `✅ Test Pusher connected!`
4. `✅ Successfully subscribed to test channel!`

Then when you send a message:
5. `🎉 MESSAGE RECEIVED VIA PUSHER!`

## Common Errors

### Error: "Invalid signature"
**Fix:** Token might be expired. Logout and login again.

### Error: "Authentication failed"
**Fix:** Check backend `/broadcasting/auth` endpoint is accessible

### Error: Channel subscription error
**Fix:** User might not be authorized for this conversation

## Alternative: Check Pusher Dashboard

1. Go to https://dashboard.pusher.com/apps/1999768/debug_console
2. You should see events appearing when messages are sent
3. Look for `MessageSent` events on channel `private-conversation.xxx`

If you see events in Pusher dashboard but not in browser, it's a frontend subscription issue.
If you don't see events in Pusher dashboard, it's a backend broadcasting issue.

