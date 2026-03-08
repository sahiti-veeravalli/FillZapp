# FillZapp Chrome Extension

Smart form auto-filler that detects web forms and fills them with your saved FillZapp profile data.

## Features
- 🔍 Auto-detects forms on any webpage
- ⚡ One-click auto-fill with floating button
- ✅ Optional confirmation before filling
- 🧠 Smart field matching with synonym support
- ❌ Cancel/dismiss button to hide the floating widget
- 🔒 Secure Firebase authentication

## Setup & Deployment

### Step 1: Create Icons
Create an `icons/` folder and add three PNG icons:
- `icon16.png` (16×16)
- `icon48.png` (48×48)
- `icon128.png` (128×128)

You can use your FillZapp logo or generate icons at https://favicon.io

### Step 2: Load in Chrome (Developer Mode)
1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Select the `chrome-extension` folder from this repo
5. The FillZapp extension should appear in your extensions list

### Step 3: Pin the Extension
1. Click the puzzle piece icon (Extensions) in Chrome toolbar
2. Click the pin icon next to FillZapp
3. The FillZapp icon will now appear in your toolbar

### Step 4: Sign In
1. Click the FillZapp icon in toolbar
2. Sign in with your FillZapp email and password
3. Toggle auto-fill and confirmation settings as needed

### Step 5: Use It
1. Visit any page with a form (job applications, Google Forms, etc.)
2. A floating **"FillZapp"** button appears at bottom-right
3. Click it to auto-fill, or click ✕ to dismiss
4. If "Confirm before filling" is on, you'll see a confirmation dialog first

## Publishing to Chrome Web Store
1. Zip all files in this folder (manifest.json, *.js, *.css, *.html, icons/)
2. Go to https://chrome.google.com/webstore/devconsole
3. Pay the one-time $5 developer registration fee
4. Click "New Item" → Upload your zip
5. Fill in store listing details and submit for review

## File Structure
```
chrome-extension/
├── manifest.json        # Extension configuration
├── background.js        # Service worker (auth + data fetching)
├── content.js           # Content script (form detection + filling)
├── content-styles.css   # Styles for floating button + modal
├── popup.html           # Extension popup UI
├── popup.js             # Popup logic (login/settings)
├── icons/               # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md            # This file
```
