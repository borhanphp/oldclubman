# Frontend Environment Setup

## Create `.env.local` File

Create a file named `.env.local` in the root of the frontend project (`D:\muktodhara\old-club-man\`) with the following content:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost/oldclubman/public/api

# Pusher Configuration
NEXT_PUBLIC_PUSHER_KEY=6536db454316e302c142
NEXT_PUBLIC_PUSHER_CLUSTER=us2

# File Upload Path
NEXT_PUBLIC_CLIENT_FILE_PATH=http://localhost/oldclubman/public/uploads/client/
```

## Steps to Create

### Option 1: Manual Creation

1. Open the project folder: `D:\muktodhara\old-club-man\`
2. Create a new file named `.env.local`
3. Copy and paste the environment variables above
4. Save the file

### Option 2: Using Command Line

**Windows (PowerShell):**
```powershell
cd D:\muktodhara\old-club-man
@"
NEXT_PUBLIC_API_URL=http://localhost/oldclubman/public/api
NEXT_PUBLIC_PUSHER_KEY=6536db454316e302c142
NEXT_PUBLIC_PUSHER_CLUSTER=us2
NEXT_PUBLIC_CLIENT_FILE_PATH=http://localhost/oldclubman/public/uploads/client/
"@ | Out-File -FilePath .env.local -Encoding UTF8
```

**Windows (CMD):**
```cmd
cd D:\muktodhara\old-club-man
echo NEXT_PUBLIC_API_URL=http://localhost/oldclubman/public/api > .env.local
echo NEXT_PUBLIC_PUSHER_KEY=6536db454316e302c142 >> .env.local
echo NEXT_PUBLIC_PUSHER_CLUSTER=us2 >> .env.local
echo NEXT_PUBLIC_CLIENT_FILE_PATH=http://localhost/oldclubman/public/uploads/client/ >> .env.local
```

## Verify Setup

After creating the file:

1. Restart your Next.js development server
   ```bash
   npm run dev
   ```

2. Check if environment variables are loaded:
   - Open browser console
   - Type: `console.log(process.env.NEXT_PUBLIC_API_URL)`
   - Should output: `http://localhost/oldclubman/public/api`

## Important Notes

- **DO NOT** commit `.env.local` to git (it's in `.gitignore`)
- **DO** update values if your API URL or Pusher credentials change
- **Restart** Next.js dev server after any changes to this file

## Troubleshooting

### Environment Variables Not Loading

**Problem:** `process.env.NEXT_PUBLIC_*` returns `undefined`

**Solutions:**
1. Make sure file is named exactly `.env.local` (not `.env.local.txt`)
2. Restart Next.js dev server (`Ctrl+C` then `npm run dev`)
3. Clear Next.js cache: `rm -rf .next` (or delete `.next` folder)
4. Verify file location: Must be in project root, not in subdirectories

### Wrong API URL

**Problem:** API requests go to wrong URL

**Solution:** Update `NEXT_PUBLIC_API_URL` in `.env.local` to match your backend URL

### Pusher Not Connecting

**Problem:** Pusher shows connection errors

**Solutions:**
1. Verify `NEXT_PUBLIC_PUSHER_KEY` matches backend `.env` `PUSHER_APP_KEY`
2. Verify `NEXT_PUBLIC_PUSHER_CLUSTER` matches backend `.env` `PUSHER_APP_CLUSTER`
3. Check browser console for specific Pusher errors

## Alternative: Update pusher.js Directly

If you prefer not to use environment variables, you can update `D:\muktodhara\old-club-man\utility\pusher.js`:

```javascript
// Line 36
this.pusher = new Pusher('6536db454316e302c142', this.options);
// Instead of:
// this.pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || '6536db454316e302c142', this.options);
```

**Note:** Using `.env.local` is recommended for better security and flexibility.

