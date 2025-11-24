# Online Status Debug Guide 🔍

## Debug Panel Added ✅

I've added a **debug panel** to the messaging page that shows:
- Number of online users
- List of online user IDs
- Manual test buttons (Send Heartbeat, Go Offline)

## How to Test

### Step 1: Open Messaging Page
1. Navigate to `http://localhost:3000/user/messages`
2. **Look for the blue debug panel** in the bottom-right corner
3. Open browser console (F12)

### Step 2: Check Console Logs

You should see these logs in order:

```
🚀 Initializing online status tracking
📤 Sending heartbeat...
💓 Heartbeat sent successfully: { is_online: true, last_seen: "..." }
🔌 Setting up Pusher subscription...
⚠️ Pusher not initialized, initializing now...
Connecting to Pusher...
Connected to Pusher
✅ Pusher is ready, subscribing to channel...
✅ Successfully subscribed to online-status channel
✅ Event handler bound to UserOnlineStatus
```

### Step 3: Test Manual Heartbeat
1. Click the **"💓 Send Heartbeat"** button in the debug panel
2. Check console for:
   ```
   🧪 Manual heartbeat test
   📤 Sending heartbeat...
   💓 Heartbeat sent successfully
   ```

### Step 4: Test with Two Browsers

**Browser 1 (User A):**
1. Open messaging page
2. Login as User A
3. Watch debug panel and console

**Browser 2 (User B):**
1. Open messaging page
2. Login as User B
3. Watch debug panel and console

**Expected Result:**
- Browser 1 should show User B's ID in "Online Users" list
- Browser 2 should show User A's ID in "Online Users" list
- Console should show:
  ```
  📡 Online status update received: { user_id: "xxx", is_online: true }
  ✅ Added user to online list: xxx
  📊 Total online users: 1 ['xxx-xxx-xxx']
  ```

### Step 5: Test Offline
1. In Browser 2, click **"🔴 Go Offline"** button
2. In Browser 1, check console for:
   ```
   📡 Online status update received: { user_id: "xxx", is_online: false }
   ❌ Removed user from online list: xxx
   📊 Total online users: 0 []
   ```

## Common Issues & Solutions

### Issue 1: "Failed to send heartbeat"

**Symptoms:**
```
❌ Failed to send heartbeat: Error
Error details: { message: "Unauthenticated" }
```

**Solution:**
- Check if you're logged in
- Verify token exists: `localStorage.getItem('old_token')`
- Try logging out and back in

### Issue 2: "Pusher not initialized"

**Symptoms:**
```
❌ Pusher failed to initialize
```

**Solution:**
- Check `.env.local` has correct Pusher credentials
- Verify `NEXT_PUBLIC_PUSHER_KEY` is set
- Restart the dev server: `npm run dev`

### Issue 3: No online status updates received

**Symptoms:**
- Debug panel shows 0 users
- No Pusher events in console

**Check:**
1. **Is Pusher connected?**
   ```javascript
   // In console:
   pusherService.pusher.connection.state
   // Should return: "connected"
   ```

2. **Is channel subscribed?**
   ```
   ✅ Successfully subscribed to online-status channel
   ```

3. **Is backend broadcasting?**
   - Check Laravel logs: `storage/logs/laravel.log`
   - Look for broadcast events

4. **Test backend directly:**
   ```bash
   # In Postman or browser console:
   POST http://localhost/old-backend/public/api/online-status/heartbeat
   Headers: {
     "Authorization": "Bearer YOUR_TOKEN"
   }
   ```

### Issue 4: Backend route not found (404)

**Solution:**
1. Clear Laravel route cache:
   ```bash
   cd D:\xampp\htdocs\old-backend
   php artisan route:clear
   php artisan config:clear
   php artisan cache:clear
   ```

2. Verify route exists:
   ```bash
   php artisan route:list | findstr online-status
   ```

### Issue 5: Database column missing

**Symptoms:**
```
SQLSTATE[42S22]: Column not found: is_online
```

**Solution:**
The `is_online` column already exists (migration failed because it was already there). 
If it doesn't exist, add manually:

```sql
ALTER TABLE clients 
ADD COLUMN is_online BOOLEAN DEFAULT FALSE,
ADD COLUMN last_seen TIMESTAMP NULL;
```

## Testing Checklist

- [ ] Debug panel visible in bottom-right
- [ ] Console shows initialization logs
- [ ] Manual heartbeat button works
- [ ] Heartbeat sent successfully (no errors)
- [ ] Pusher connected
- [ ] Subscribed to online-status channel
- [ ] Two browsers see each other online
- [ ] Offline button removes user from list
- [ ] Green dots appear on online users
- [ ] Gray dots appear on offline users

## Manual API Testing

### Test Heartbeat Endpoint

```bash
curl -X POST http://localhost/old-backend/public/api/online-status/heartbeat \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "is_online": true,
    "last_seen": "2024-11-24 12:34:56"
  },
  "message": "Online status updated"
}
```

### Test Offline Endpoint

```bash
curl -X POST http://localhost/old-backend/public/api/online-status/offline \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

### Check Pusher Debug Console

1. Go to: https://dashboard.pusher.com
2. Select your app
3. Go to "Debug Console"
4. Send a heartbeat
5. **Expected:** See `UserOnlineStatus` event broadcast

## Next Steps

Once you see the logs and debug panel working:

1. ✅ Verify heartbeat is sending
2. ✅ Verify Pusher is connected
3. ✅ Test with two browsers
4. ✅ Verify green/gray dots appear
5. ✅ Remove debug panel (optional)

## Remove Debug Panel

When everything works, remove the debug panel:

**File:** `views/message/feed.js`

Remove these lines:
```javascript
import { OnlineStatusDebug } from '@/components/custom/OnlineStatusDebug';

// And remove:
<OnlineStatusDebug />
```

---

**Current Status:** 🔍 Debugging Mode Enabled

Share the console logs with me if you encounter any issues!

