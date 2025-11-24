# Online Status Privacy Feature 🔒✅

## What's New

Users can now **control their online visibility**! By default, they appear online when using the messaging page, but they can choose to hide their status and appear offline.

## UI Location

**In the messaging sidebar** (between Tabs and Search):
- Shows "Your Status:" label
- Displays current status with colored dot (🟢 Online / ⚫ Offline)
- Click the status button to open a menu

## How It Works

### Default Behavior
- ✅ **Auto-Online:** When users open the messaging page, they automatically appear online
- ✅ **Heartbeat:** Sends automatic ping every 60 seconds to stay online
- ✅ **Real-time:** Other users see status changes instantly via Pusher

### Privacy Control
Users can click their status to toggle visibility:

#### Option 1: Online (Default)
- 🟢 **Green dot** next to their profile
- ✅ Shows as "Active now" to others
- ✅ Visible in contacts list and chat headers
- ✅ Sends heartbeat every 60 seconds

#### Option 2: Appear Offline
- ⚫ **Gray dot** next to their profile  
- ✅ Shows as "Offline" to others
- ✅ **Can still send/receive messages**
- ✅ Heartbeat stops, status broadcasts as offline

### Persistent Preference
- 💾 Choice is saved to browser's `localStorage`
- ✅ Persists across page refreshes
- ✅ Remembered for next session

## User Interface

### Status Toggle Button

**When Online:**
```
┌─────────────────────┐
│ 🟢 Online   👁      │
└─────────────────────┘
```

**When Offline:**
```
┌─────────────────────┐
│ ⚫ Offline   🚫      │
└─────────────────────┘
```

### Dropdown Menu

Click the button to see:

```
┌──────────────────────────────┐
│  Online Status               │
│  Control your visibility     │
├──────────────────────────────┤
│  🟢  Online          ✓       │
│     Show as active to        │
│     everyone                 │
├──────────────────────────────┤
│  🚫  Appear Offline          │
│     Hide your online status  │
│                              │
├──────────────────────────────┤
│  💡 You can still send and   │
│     receive messages when    │
│     appearing offline        │
└──────────────────────────────┘
```

## Technical Implementation

### Frontend (useOnlineStatus Hook)

```javascript
const {
  isUserOnline,      // Check if a user is online
  onlineUsers,       // Set of all online user IDs
  appearOnline,      // Current user's visibility preference
  toggleOnlineStatus // Function to toggle online/offline
} = useOnlineStatus();
```

**Key Features:**
- `appearOnline`: Boolean state (true = online, false = offline)
- `toggleOnlineStatus(true/false)`: Toggle visibility
- Saves preference to localStorage: `appear_online`
- Loads preference on page mount

### Heartbeat Logic

```javascript
if (appearOnline) {
  // Send heartbeat - appear online
  POST /api/online-status/heartbeat
} else {
  // Send offline signal - hide status
  POST /api/online-status/offline
}
```

### Privacy Features

1. **Immediate Effect:**
   - Toggle triggers instant heartbeat/offline call
   - Status broadcasts via Pusher immediately
   - Other users see change in real-time

2. **Persistent:**
   - Preference saved to localStorage
   - Survives page refresh
   - Survives browser close/reopen

3. **Messaging Still Works:**
   - Users can send messages while appearing offline
   - They receive messages normally
   - Typing indicators still work
   - Only visibility is affected

## Use Cases

### Why Use "Appear Offline"?

1. **Privacy:** Don't want others to know when you're active
2. **Avoid Interruptions:** Check messages without starting conversations
3. **Selective Availability:** Read messages at your own pace
4. **Personal Time:** Stay logged in but appear unavailable

### Important Notes

- ✅ Messages work normally when appearing offline
- ✅ You still see who else is online
- ✅ File sharing works
- ✅ Real-time updates still work
- ⚠️ Others see you as offline and may not expect immediate responses

## User Guide

### How to Appear Offline

1. Open messaging page
2. Look for "Your Status" section (below tabs)
3. Click the status button (shows "Online" or "Offline")
4. Select "Appear Offline" from menu
5. ✅ You now appear offline to everyone

### How to Go Back Online

1. Click your status button
2. Select "Online" from menu
3. ✅ You now appear online to everyone

### Check Your Current Status

Look at the status button:
- 🟢 **Green dot + "Online"** = You're visible
- ⚫ **Gray dot + "Offline"** = You're hidden

## Privacy Guarantee

When you choose "Appear Offline":
- ❌ Others **cannot** see you're online
- ❌ Green dot does **not** appear on your profile
- ❌ "Active now" does **not** show in chat headers
- ✅ But you **can** still use all messaging features

## Backend API

### Endpoints Used

**Heartbeat (Online):**
```
POST /api/online-status/heartbeat
Response: { user_id, is_online: true, last_seen }
```

**Go Offline:**
```
POST /api/online-status/offline  
Response: { user_id, is_online: false, last_seen }
```

**Get Online Users:**
```
GET /api/online-status/current
Response: ['user-id-1', 'user-id-2', ...]
```

### Pusher Broadcasting

Both endpoints broadcast via Pusher:
```javascript
Channel: 'online-status'
Event: 'UserOnlineStatus'
Data: {
  user_id: 'xxx-xxx-xxx',
  is_online: true/false,
  timestamp: '2024-11-24T...'
}
```

## Testing

### Test Privacy Feature

1. **Open Browser 1** (User A)
   - Set status to "Online"
   - ✅ Should see green dot

2. **Open Browser 2** (User B)  
   - Should see User A as online (green dot)

3. **In Browser 1:**
   - Change status to "Appear Offline"
   - ✅ Green dot changes to gray

4. **In Browser 2:**
   - User A should now show offline (gray dot)
   - "Active now" changes to "Offline"

5. **Test Messaging:**
   - User A sends message while "offline"
   - ✅ Message delivers normally
   - User B receives it
   - User A still appears offline

### Verify Persistence

1. Set status to "Appear Offline"
2. Refresh page
3. ✅ Should still show "Offline"
4. Close browser
5. Reopen and login
6. ✅ Should still be "Offline"

## Files Modified/Created

### New Files
- ✅ `components/custom/OnlineStatusToggle.js` - UI component
- ✅ `ONLINE_STATUS_PRIVACY_FEATURE.md` - This documentation

### Modified Files
- ✅ `components/custom/useOnlineStatus.js` - Added privacy logic
- ✅ `views/message/feed.js` - Integrated toggle component
- ✅ Backend routes and controller (already working)

## Success Criteria ✅

- [x] Users can toggle online/offline status
- [x] Choice persists across sessions
- [x] Real-time updates via Pusher
- [x] Messages still work when appearing offline
- [x] Clean, intuitive UI
- [x] No linter errors

---

**Feature Status:** 🟢 **Fully Implemented and Ready!**

Users now have full control over their online visibility while maintaining all messaging functionality! 🎉

