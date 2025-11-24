@echo off
echo ========================================
echo   FIXING API URL
echo ========================================
echo.

cd /d D:\muktodhara\old-club-man

echo Checking .env.local file...
echo.

if exist .env.local (
    echo Found .env.local
    findstr "NEXT_PUBLIC_API_URL" .env.local
    echo.
    echo Updating API URL...
    powershell -Command "(Get-Content .env.local) -replace 'NEXT_PUBLIC_API_URL=.*', 'NEXT_PUBLIC_API_URL=http://localhost/oldclubman/public/api' | Set-Content .env.local"
    echo.
    echo ✅ Updated! New value:
    findstr "NEXT_PUBLIC_API_URL" .env.local
) else (
    echo .env.local not found! Creating it...
    echo NEXT_PUBLIC_API_URL=http://localhost/oldclubman/public/api > .env.local
    echo NEXT_PUBLIC_PUSHER_KEY=6536db454316e302c142 >> .env.local
    echo NEXT_PUBLIC_PUSHER_CLUSTER=us2 >> .env.local
    echo NEXT_PUBLIC_CLIENT_FILE_PATH=http://localhost/oldclubman/public/upload/profile >> .env.local
    echo.
    echo ✅ Created .env.local with correct values!
)

echo.
echo ========================================
echo   IMPORTANT: RESTART NEXT.JS NOW!
echo ========================================
echo.
echo Press Ctrl+C in your Next.js terminal
echo Then run: npm run dev
echo.
pause

