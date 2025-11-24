# Debug: Why is one user not showing as online?

## Quick Debug Steps

### 1. Check the Debug Panel (Top-Right)
The debug panel now shows:
- **Your ID** (yellow box) - Your current user ID
- **Online Users list** - All user IDs that are marked as online

### 2. Open Browser Console
Watch for these logs every 5 seconds:
```
📊 Current online users: 2 ['e3e0c92e...', '7ffdd270...']
```

### 3. Check User ID Matching
When you see a user in the chat/contacts list, console will show:
```
🔍 Checking user e3e0c92e... | Online: true | In set: ['e3e0c92e', '7ffdd270']
```

**What to check:**
- Is the user ID in the "In set" array?
- Does the first 8 characters match?

## Common Issues

### Issue 1: User ID Mismatch
**Problem:** The user ID being checked doesn't match any online user IDs

**Check:**
1. Look at debug panel - find the user's full ID in the online list
2. Check console log when that user's avatar/name appears
3. Compare the IDs - do they match?

**Example of mismatch:**
```
Debug panel shows: e3e0c92e-5883-4bd9-829e-fc4c3bbc0a18
Console checking: e3e0c92e-XXXX-XXXX-XXXX-XXXXXXXXXXXX (different!)
```

### Issue 2: User Not Sending Heartbeat
**Problem:** The second user hasn't sent a heartbeat yet

**Check:**
1. In the second browser, check console for:
   ```
   ✅ Online status tracking active
   ```
2. Every 60 seconds, should see heartbeat logs
3. Debug panel should show their ID

**Solution:**
- Make sure second user is logged in
- Make sure second user is on messaging page
- Wait 60 seconds for automatic heartbeat

### Issue 3: Wrong User ID Being Passed
**Problem:** The component is passing the wrong user ID to `isUserOnline()`

**Check console logs:**
```
🔍 Checking user undefined... | Online: false
🔍 Checking user 7ffdd270... | Online: true
```

If you see `undefined` or a different ID than expected, the problem is in how the user ID is extracted.

## How to Fix

### For Chat List Users
The code checks: `isUserOnline(otherUser?.id)`

**Verify in console:**
```javascript
// In browser console:
console.log(otherUser)
// Should show an object with an 'id' property
```

### For Contact List Users
The code checks: `isUserOnline(contact.userId)`

**Verify:**
```javascript
// In browser console:
console.log(contact)
// Should have 'userId' property matching user ID
```

### For Current Chat Header
The code checks: `isUserOnline(currentChat._otherUser.id)`

**Verify:**
```javascript
// In browser console:
console.log(currentChat._otherUser)
// Should have 'id' property
```

## Step-by-Step Debugging

1. **Open messaging page**
2. **Look at debug panel** - Note down online user IDs
3. **Look at a user who should be online but shows offline**
4. **Check console** for the `🔍 Checking user...` log for that user
5. **Compare:**
   - User ID being checked
   - User IDs in the online set
   - Do they match?

## Quick Test

Open two browsers side by side:

**Browser 1:**
1. Check debug panel for your user ID
2. Look at console logs

**Browser 2:**
1. Login as different user
2. Check debug panel for THEIR user ID
3. Wait 5 seconds

**Expected:**
- Browser 1 should show Browser 2's user ID in online list
- Browser 2 should show Browser 1's user ID in online list
- Console should show: `🟢 User online: xxxxxx...`

## Share These Details

If still not working, share:
1. Screenshot of debug panel from both browsers
2. The `🔍 Checking user...` console logs
3. The `📊 Current online users:` console logs
4. Which user is not showing as online (their ID from debug panel)

