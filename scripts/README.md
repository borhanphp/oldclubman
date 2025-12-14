# Demo Users Creation Script

This script creates 20 demo users (10 male, 10 female) for testing purposes.

## Prerequisites

Make sure you have Node.js installed and axios package available.

## Installation

1. Install axios if not already installed:
```bash
npm install axios
```

## Usage

### Method 1: Using Node directly

```bash
node scripts/create-demo-users.js
```

### Method 2: Using npm script (recommended)

Add this to your `package.json` scripts section:

```json
"scripts": {
  "create-demo-users": "node scripts/create-demo-users.js"
}
```

Then run:

```bash
npm run create-demo-users
```

## Configuration

The script uses the `NEXT_PUBLIC_API_URL` environment variable for the API base URL. 

- Default: `http://localhost:8000/api`
- To change: Set the environment variable before running

```bash
NEXT_PUBLIC_API_URL=https://your-api-url.com/api node scripts/create-demo-users.js
```

## Demo Users

The script creates 20 users with the following details:

### Male Users (10)
1. John Smith - john.smith@demo.com
2. Michael Johnson - michael.johnson@demo.com
3. David Williams - david.williams@demo.com
4. James Brown - james.brown@demo.com
5. Robert Davis - robert.davis@demo.com
6. William Miller - william.miller@demo.com
7. Richard Wilson - richard.wilson@demo.com
8. Thomas Moore - thomas.moore@demo.com
9. Daniel Taylor - daniel.taylor@demo.com
10. Christopher Anderson - christopher.anderson@demo.com

### Female Users (10)
1. Emma Garcia - emma.garcia@demo.com
2. Olivia Martinez - olivia.martinez@demo.com
3. Sophia Rodriguez - sophia.rodriguez@demo.com
4. Isabella Hernandez - isabella.hernandez@demo.com
5. Mia Lopez - mia.lopez@demo.com
6. Charlotte Gonzalez - charlotte.gonzalez@demo.com
7. Amelia Wilson - amelia.wilson@demo.com
8. Harper Anderson - harper.anderson@demo.com
9. Evelyn Thomas - evelyn.thomas@demo.com
10. Abigail Jackson - abigail.jackson@demo.com

## Default Password

All demo users share the same password for easy testing:

**Password:** `Demo@123456`

## Login

After running the script, you can login with any of the created users:

- **Email:** Any email from the list above
- **Password:** `Demo@123456`

## Example Output

```
🚀 Starting to create 20 demo users...

API URL: http://localhost:8000/api
Default Password: Demo@123456

Creating user: John Smith (male)...
✅ Successfully created: John Smith
Creating user: Emma Garcia (female)...
✅ Successfully created: Emma Garcia
...

📊 Summary:
✅ Successfully created: 20 users
❌ Failed: 0 users

✨ Demo users creation completed!
```

## Troubleshooting

### API URL Issues
- Make sure your backend server is running
- Verify the API URL is correct
- Check if the `/client/regi` endpoint is accessible

### Creation Failures
- Check if users already exist (emails must be unique)
- Verify database connection
- Check backend logs for specific errors

### Rate Limiting
The script includes a 500ms delay between requests to avoid overwhelming the server. Adjust if needed in the code.

## Notes

- Users are created with birth dates between 1985-1995
- All users are marked as not keeping signed in
- The script will continue even if some users fail to create
- A summary is provided at the end showing successful and failed creations

