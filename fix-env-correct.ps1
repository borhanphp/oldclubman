# Fix .env.local file with CORRECT API URL
$envPath = "D:\muktodhara\old-club-man\.env.local"

$newContent = @"
NEXT_PUBLIC_API_URL=http://localhost/old-backend/public/api
NEXT_PUBLIC_FILE_PATH=http://localhost/old-backend/public/uploads/
NEXT_PUBLIC_CARD_FILE_PATH=http://localhost/old-backend/public/uploads/cards/
NEXT_PUBLIC_CLIENT_FILE_PATH=http://localhost/old-backend/public/uploads/client/
NEXT_PUBLIC_BACKGROUND_FILE_PATH=http://localhost/old-backend/public/uploads/nfc_virtual_background/

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBj3_YOBtjEcDl0woAc_oUSz2EJ8fp1SzA

NEXT_PUBLIC_PUSHER_APP_ID=1999768
NEXT_PUBLIC_PUSHER_KEY=6536db454316e302c142
NEXT_PUBLIC_PUSHER_SECRET=dd8e4528e12c13f4f6cc
NEXT_PUBLIC_PUSHER_CLUSTER=us2
"@

Set-Content -Path $envPath -Value $newContent -NoNewline

Write-Host "✅ Fixed .env.local with CORRECT API URL!"
Write-Host ""
Write-Host "API URL: http://localhost/old-backend/public/api"
Write-Host ""
Write-Host "Now checking backend CORS configuration..."

