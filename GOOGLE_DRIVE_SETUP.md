# Google Drive Integration Setup Guide

This guide will help you configure the SEDA application to save user data to Google Drive.

## Prerequisites
- A Google Account
- Access to [Google Cloud Console](https://console.cloud.google.com/)

## Step-by-Step Setup

### Step 1: Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown (top-left) and select "New Project"
3. Name your project (e.g., "SEDA Database Backup")
4. Click "Create"

### Step 2: Enable Google Drive API
1. In the Google Cloud Console, navigate to **APIs & Services** > **Library**
2. Search for "Google Drive API"
3. Click on "Google Drive API" and click **Enable**

### Step 3: Configure OAuth Consent Screen
1. Go to **APIs & Services** > **OAuth consent screen**
2. Select **External** (or Internal if using Google Workspace)
3. Fill in the required information:
   - App name: SEDA Database
   - User support email: your email
   - Developer contact information: your email
4. Click **Save and Continue**
5. On "Scopes" page, click **Add or remove scopes**
6. Search for `drive.file` and check it
7. Click **Update** then **Save and Continue**
8. On "Test users" page, add your Google email as a test user
9. Click **Save and Continue**

### Step 4: Create OAuth Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **Web application** as the application type
4. Name it "SEDA Web App"
5. Under "Authorized JavaScript origins", add:
   - `http://localhost` (for local testing)
   - Your deployed domain (e.g., `https://your-project.vercel.app`)
6. Click **Create**
7. Copy the **Client ID** shown

### Step 5: Get API Key
1. Still on the **Credentials** page
2. Click **Create Credentials** > **API key**
3. Copy the generated API key

### Step 6: Update the Code
1. Open the file `js/googledrive.js` in your project
2. Replace the placeholder values:

```javascript
// Google API configuration
const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
const API_KEY = 'YOUR_API_KEY';
```

Replace with your actual credentials:
```javascript
const GOOGLE_CLIENT_ID = '123456789-abc123def456.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
```

### Step 7: Test the Integration
1. Open the dashboard in your browser
2. Look for the "Connect Drive" button in the Users section
3. Click it to sign in with Google
4. Once connected, use "Save to Drive" to backup your data
5. Check your Google Drive for the generated CSV/JSON files

## Features

### Mobile-Friendly Design
- Large touch targets (minimum 44px)
- Responsive button layout that wraps on smaller screens
- Clear status indicators
- Visual feedback during sync operations

### Available Actions
- **Connect Drive**: Sign in to Google Drive
- **Disconnect**: Sign out from Google Drive  
- **Save to Drive**: Export users as CSV file
- **Save JSON**: Export users as JSON file

### Data Saved
The following user data is saved to Google Drive:
- ID Number
- Full Name
- Gender
- Date of Birth
- Religion
- Tribe/Language
- Section
- Job Title
- Email
- Phone
- Role
- Verification Status
- Registration Date
- Notes

## Troubleshooting

### "API not configured" warning
This appears when you haven't added your Client ID and API key to `js/googledrive.js`

### OAuth error: "origin_mismatch"
Make sure your domain is added to "Authorized JavaScript origins" in Google Cloud Console

### "Access denied" error
Make sure you've added your email as a test user in the OAuth consent screen

## Security Notes
- The OAuth tokens are stored in browser memory only (not localStorage)
- Tokens are cleared when the user signs out
- The app only has access to files it creates (drive.file scope)
