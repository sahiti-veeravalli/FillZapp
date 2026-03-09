# FillZapp Chrome Extension

Auto-fill job applications and web forms with your FillZapp profile data.

## Installation (Developer Mode)

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select this `chrome-extension` folder
5. The FillZapp icon ⚡ will appear in your toolbar

## Usage

1. Click the FillZapp icon in your Chrome toolbar
2. Sign in with your FillZapp account (same email/password you use on the dashboard)
3. Navigate to any job application or web form
4. Click **"⚡ Auto-Fill This Page"**
5. FillZapp will detect form fields and fill them with your profile data

## How It Works

- **Field Detection**: Scans for `<input>`, `<textarea>`, and `<select>` elements
- **Smart Matching**: Uses field names, labels, placeholders, and aria attributes to identify fields
- **Synonym Matching**: Maps variations like "Phone Number", "Tel", "Mobile" → your phone number
- **Framework Compatible**: Uses native value setters to work with React, Vue, Angular forms
- **Visual Feedback**: Filled fields glow purple briefly to confirm

## Icons

You need to add icon files before loading:
- `icons/icon16.png` (16×16)
- `icons/icon48.png` (48×48)
- `icons/icon128.png` (128×128)

You can generate these from any ⚡ icon or the FillZapp logo.
