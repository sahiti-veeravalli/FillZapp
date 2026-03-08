// FillZapp Background Service Worker
// Handles Firebase sync and auth state

const FIREBASE_CONFIG = {
  // TODO: Replace with your Firebase config from src/lib/firebase.ts
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
};

// Listen for messages from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "SYNC_PROFILE") {
    syncProfile(msg.uid).then(() => sendResponse({ success: true })).catch(() => sendResponse({ success: false }));
    return true;
  }
  if (msg.type === "SAVE_SETTINGS") {
    chrome.storage.local.set({ settings: msg.settings }, () => sendResponse({ success: true }));
    return true;
  }
});

async function syncProfile(uid) {
  try {
    // Fetch user data from Firestore REST API
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_CONFIG.projectId}/databases/(default)/documents/users/${uid}`;
    const res = await fetch(url);
    const doc = await res.json();

    if (doc.fields) {
      const data = {};
      for (const [key, val] of Object.entries(doc.fields)) {
        data[key] = val.stringValue || val.integerValue || val.booleanValue || "";
      }
      await chrome.storage.local.set({ profileData: data });
    }
  } catch (err) {
    console.error("FillZapp sync error:", err);
  }
}