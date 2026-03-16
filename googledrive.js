/**
 * Google Drive Integration Module for SEDA
 * Enables saving user data to Google Drive as CSV or JSON files
 * Mobile-friendly implementation
 */

// Google API configuration
// IMPORTANT: Replace with your own Client ID from Google Cloud Console
// See setup instructions below
const GOOGLE_CLIENT_ID = 'YOUR_CLIENT_ID.apps.googleusercontent.com';
const API_KEY = 'YOUR_API_KEY';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

let tokenClient;
let gapiInitialized = false;
let gisInitialized = false;
let isSignedIn = false;

// Initialize Google APIs
async function initGoogleAPI() {
    console.log('[GOOGLE] Initializing Google APIs...');
    
    try {
        // Load GAPI
        await loadScript('https://apis.google.com/js/api.js');
        await new Promise((resolve, reject) => {
            gapi.load('client', async () => {
                try {
                    await gapi.client.init({
                        apiKey: API_KEY,
                        discoveryDocs: DISCOVERY_DOCS,
                    });
                    gapiInitialized = true;
                    console.log('[GOOGLE] GAPI initialized');
                    resolve();
                } catch (err) {
                    console.error('[GOOGLE] GAPI init error:', err);
                    reject(err);
                }
            });
        });

        // Load GIS
        await loadScript('https://accounts.google.com/gsi/client');
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: SCOPES,
            callback: (response) => {
                if (response.error) {
                    console.error('[GOOGLE] OAuth error:', response.error);
                    return;
                }
                isSignedIn = true;
                console.log('[GOOGLE] Signed in successfully');
                updateGoogleDriveUI();
            },
        });
        gisInitialized = true;
        console.log('[GOOGLE] GIS initialized');
        
        return true;
    } catch (err) {
        console.error('[GOOGLE] Initialization failed:', err);
        return false;
    }
}

// Load script dynamically
function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Sign in to Google
function signInGoogle() {
    if (!gisInitialized) {
        alert('Google API not initialized. Please refresh the page.');
        return;
    }
    tokenClient.requestAccessToken({ prompt: 'consent' });
}

// Sign out from Google
function signOutGoogle() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        isSignedIn = false;
        updateGoogleDriveUI();
        console.log('[GOOGLE] Signed out');
    }
}

// Update UI based on sign-in status
function updateGoogleDriveUI() {
    const signInBtn = document.getElementById('googleSignInBtn');
    const signOutBtn = document.getElementById('googleSignOutBtn');
    const saveToDriveBtn = document.getElementById('saveToDriveBtn');
    const driveStatus = document.getElementById('driveStatus');
    
    if (signInBtn && signOutBtn) {
        if (isSignedIn) {
            signInBtn.style.display = 'none';
            signOutBtn.style.display = 'inline-flex';
            if (saveToDriveBtn) saveToDriveBtn.style.display = 'inline-flex';
            if (driveStatus) {
                driveStatus.innerHTML = '<i class="fas fa-cloud"></i> Connected to Google Drive';
                driveStatus.style.color = '#10b981';
            }
        } else {
            signInBtn.style.display = 'inline-flex';
            signOutBtn.style.display = 'none';
            if (saveToDriveBtn) saveToDriveBtn.style.display = 'none';
            if (driveStatus) {
                driveStatus.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Not connected';
                driveStatus.style.color = '#666';
            }
        }
    }
}

// Save users data to Google Drive as CSV
async function saveToGoogleDrive() {
    if (!isSignedIn) {
        alert('Please sign in to Google Drive first');
        signInGoogle();
        return;
    }

    const users = JSON.parse(localStorage.getItem('sedaUsers')) || [];
    if (users.length === 0) {
        alert('No users to save!');
        return;
    }

    const btn = document.getElementById('saveToDriveBtn');
    const originalText = btn ? btn.innerHTML : '';
    
    try {
        // Show loading state
        if (btn) {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            btn.disabled = true;
        }

        // Prepare CSV content
        const csvContent = convertUsersToCSV(users);
        const timestamp = new Date().toISOString().split('T')[0];
        const fileName = `SEDA_Users_${timestamp}.csv`;

        // Upload to Google Drive
        const fileId = await uploadToDrive(fileName, csvContent, 'text/csv');
        
        console.log('[GOOGLE] File uploaded successfully. File ID:', fileId);
        alert(`Data saved to Google Drive!\nFile: ${fileName}\nFile ID: ${fileId}`);
        
        // Update last sync time
        localStorage.setItem('sedaLastCloudSync', new Date().toISOString());
        updateLastSyncTime();
        
    } catch (err) {
        console.error('[GOOGLE] Save failed:', err);
        alert('Failed to save to Google Drive: ' + err.message);
    } finally {
        if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }
}

// Save users data to Google Drive as JSON
async function saveJSONToGoogleDrive() {
    if (!isSignedIn) {
        alert('Please sign in to Google Drive first');
        signInGoogle();
        return;
    }

    const users = JSON.parse(localStorage.getItem('sedaUsers')) || [];
    if (users.length === 0) {
        alert('No users to save!');
        return;
    }

    const btn = document.getElementById('saveJSONToDriveBtn');
    const originalText = btn ? btn.innerHTML : '';
    
    try {
        if (btn) {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            btn.disabled = true;
        }

        // Prepare JSON content
        const jsonContent = JSON.stringify(users, null, 2);
        const timestamp = new Date().toISOString().split('T')[0];
        const fileName = `SEDA_Users_${timestamp}.json`;

        // Upload to Google Drive
        const fileId = await uploadToDrive(fileName, jsonContent, 'application/json');
        
        console.log('[GOOGLE] JSON file uploaded. File ID:', fileId);
        alert(`Data saved to Google Drive!\nFile: ${fileName}`);
        
        localStorage.setItem('sedaLastCloudSync', new Date().toISOString());
        updateLastSyncTime();
        
    } catch (err) {
        console.error('[GOOGLE] Save JSON failed:', err);
        alert('Failed to save to Google Drive: ' + err.message);
    } finally {
        if (btn) {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    }
}

// Upload file to Google Drive
async function uploadToDrive(fileName, content, mimeType) {
    const metadata = {
        name: fileName,
        mimeType: mimeType,
    };

    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([content], { type: mimeType }));

    const response = await gapi.client.request({
        path: 'https://www.googleapis.com/upload/drive/v3/files',
        method: 'POST',
        params: {
            uploadType: 'multipart',
        },
        body: form,
    });

    return response.result.id;
}

// Convert users to CSV format
function convertUsersToCSV(users) {
    const headers = ['ID No', 'Full Name', 'Gender', 'Date of Birth', 'Religion', 'Tribe', 'Section', 'Job Title', 'Email', 'Phone', 'Role', 'Verified', 'Registration Date', 'Notes'];
    
    const rows = users.map(user => {
        const regDate = user.registrationDate ? new Date(user.registrationDate).toLocaleDateString() : 'N/A';
        const dob = user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A';
        return [
            user.idNo || '',
            user.fullname || '',
            user.gender || '',
            dob,
            user.religion || '',
            user.tribe || '',
            user.section || '',
            user.jobTitle || '',
            user.email || '',
            user.phone || '',
            user.role || 'user',
            user.verified === true ? 'Verified' : 'Pending',
            regDate,
            user.notes || ''
        ];
    });
    
    // Escape CSV values
    const escapeCSV = (val) => {
        const str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return '"' + str.replace(/"/g, '""') + '"';
        }
        return str;
    };
    
    return [headers, ...rows]
        .map(row => row.map(escapeCSV).join(','))
        .join('\n');
}

// Update last sync time display
function updateLastSyncTime() {
    const lastSyncEl = document.getElementById('lastCloudSync');
    if (lastSyncEl) {
        const lastSync = localStorage.getItem('sedaLastCloudSync');
        if (lastSync) {
            const date = new Date(lastSync);
            lastSyncEl.textContent = 'Last synced: ' + date.toLocaleString();
            lastSyncEl.style.display = 'block';
        }
    }
}

// Check if Google API is configured
function isGoogleAPIConfigured() {
    return GOOGLE_CLIENT_ID !== 'YOUR_CLIENT_ID.apps.googleusercontent.com' && 
           API_KEY !== 'YOUR_API_KEY';
}

// Show configuration warning
function showConfigWarning() {
    if (!isGoogleAPIConfigured()) {
        const warning = document.getElementById('googleConfigWarning');
        if (warning) {
            warning.style.display = 'block';
        }
    }
}

// Auto-initialize on page load (only if credentials are configured)
document.addEventListener('DOMContentLoaded', function() {
    if (isGoogleAPIConfigured()) {
        // Delay initialization to ensure GAPI is loaded
        setTimeout(() => {
            initGoogleAPI().then(success => {
                if (success) {
                    updateGoogleDriveUI();
                    updateLastSyncTime();
                }
            });
        }, 1000);
    } else {
        console.log('[GOOGLE] API not configured. Show setup instructions.');
        showConfigWarning();
    }
});
