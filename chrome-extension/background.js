// FillZapp Background Service Worker
// Handles Firebase auth state and data fetching

const FIREBASE_API_KEY = "AIzaSyB3eEa0pQyriNqgCKVC2moiuZ1I";
const FIREBASE_PROJECT_ID = "fillzapp";
const FIRESTORE_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;

// Listen for messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_USER_DATA") {
    getUserData().then(sendResponse).catch(() => sendResponse({ error: "Failed to fetch data" }));
    return true; // async
  }

  if (message.type === "GET_AUTH_STATE") {
    chrome.storage.local.get(["fz_user", "fz_token"], (result) => {
      sendResponse({ user: result.fz_user || null, token: result.fz_token || null });
    });
    return true;
  }

  if (message.type === "SAVE_AUTH") {
    chrome.storage.local.set({
      fz_user: message.user,
      fz_token: message.token,
    }, () => sendResponse({ success: true }));
    return true;
  }

  if (message.type === "LOGOUT") {
    chrome.storage.local.remove(["fz_user", "fz_token"], () => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (message.type === "GET_SETTINGS") {
    chrome.storage.local.get(["fz_autofill", "fz_confirm"], (result) => {
      sendResponse({
        autoFill: result.fz_autofill !== "false",
        confirmBeforeFill: result.fz_confirm === "true",
      });
    });
    return true;
  }
});

async function getUserData() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(["fz_user", "fz_token"], async (result) => {
      if (!result.fz_user || !result.fz_token) {
        reject("Not authenticated");
        return;
      }
      try {
        const uid = result.fz_user.uid;
        const response = await fetch(
          `${FIRESTORE_BASE}/users/${uid}`,
          {
            headers: {
              Authorization: `Bearer ${result.fz_token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Fetch failed");
        const doc = await response.json();
        const data = parseFirestoreDocument(doc.fields || {});
        resolve({ data, user: result.fz_user });
      } catch (err) {
        reject(err);
      }
    });
  });
}

// Parse Firestore REST response into plain object
function parseFirestoreDocument(fields) {
  const result = {};
  for (const [key, value] of Object.entries(fields)) {
    result[key] = parseFirestoreValue(value);
  }
  return result;
}

function parseFirestoreValue(value) {
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return Number(value.integerValue);
  if (value.doubleValue !== undefined) return value.doubleValue;
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.nullValue !== undefined) return null;
  if (value.mapValue) return parseFirestoreDocument(value.mapValue.fields || {});
  if (value.arrayValue) return (value.arrayValue.values || []).map(parseFirestoreValue);
  if (value.timestampValue) return value.timestampValue;
  return null;
}
