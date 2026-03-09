// Firebase REST API endpoints
const FIREBASE_API_KEY = "AIzaSyB3eEa0pQyriZWuwmSiNqgCKVC2moiuZ1I";
const FIRESTORE_PROJECT = "fillzapp";
const AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/(default)/documents/users`;

const $ = (id) => document.getElementById(id);

// Check if already logged in
chrome.storage.local.get(["fz_token", "fz_uid", "fz_name", "fz_email"], (data) => {
  if (data.fz_token && data.fz_uid) {
    showMainView(data.fz_name || "User", data.fz_email || "");
  }
});

// Login
$("loginBtn").addEventListener("click", async () => {
  const email = $("email").value.trim();
  const password = $("password").value;
  if (!email || !password) return showStatus("loginStatus", "Enter email and password", "error");

  $("loginBtn").disabled = true;
  $("loginBtn").textContent = "Signing in...";

  try {
    const res = await fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);

    chrome.storage.local.set({
      fz_token: data.idToken,
      fz_uid: data.localId,
      fz_email: data.email,
      fz_name: data.displayName || email.split("@")[0],
      fz_refresh: data.refreshToken,
    });

    showMainView(data.displayName || email.split("@")[0], data.email);
  } catch (err) {
    showStatus("loginStatus", err.message.replace(/_/g, " ").toLowerCase(), "error");
  } finally {
    $("loginBtn").disabled = false;
    $("loginBtn").textContent = "Sign In";
  }
});

// Fill button
$("fillBtn").addEventListener("click", async () => {
  $("fillBtn").disabled = true;
  $("fillBtn").textContent = "Fetching data...";
  showStatus("fillStatus", "Loading your profile...", "info");

  try {
    const stored = await new Promise((r) => chrome.storage.local.get(["fz_token", "fz_uid"], r));
    if (!stored.fz_token) throw new Error("Not logged in");

    // Fetch user data from Firestore REST API
    const res = await fetch(`${FIRESTORE_URL}/${stored.fz_uid}`, {
      headers: { Authorization: `Bearer ${stored.fz_token}` },
    });
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        // Token expired, try refresh
        await refreshToken();
        const stored2 = await new Promise((r) => chrome.storage.local.get(["fz_token", "fz_uid"], r));
        const res2 = await fetch(`${FIRESTORE_URL}/${stored2.fz_uid}`, {
          headers: { Authorization: `Bearer ${stored2.fz_token}` },
        });
        if (!res2.ok) throw new Error("Failed to fetch profile");
        var docData = await res2.json();
      } else {
        throw new Error("Failed to fetch profile");
      }
    } else {
      var docData = await res.json();
    }

    // Parse Firestore document format into flat key-value
    const profileData = parseFirestoreDoc(docData.fields || {});

    // Send to content script
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { action: "FILLZAPP_FILL", data: profileData }, (response) => {
      if (chrome.runtime.lastError) {
        showStatus("fillStatus", "Reload the page and try again", "error");
      } else if (response && response.filled > 0) {
        showStatus("fillStatus", `✓ Filled ${response.filled} field${response.filled > 1 ? "s" : ""}!`, "success");
      } else {
        showStatus("fillStatus", "No matching form fields found on this page", "error");
      }
      $("fillBtn").disabled = false;
      $("fillBtn").textContent = "⚡ Auto-Fill This Page";
    });
    return; // Don't re-enable button yet, wait for response
  } catch (err) {
    showStatus("fillStatus", err.message, "error");
  }
  $("fillBtn").disabled = false;
  $("fillBtn").textContent = "⚡ Auto-Fill This Page";
});

// Logout
$("logoutBtn").addEventListener("click", () => {
  chrome.storage.local.remove(["fz_token", "fz_uid", "fz_name", "fz_email", "fz_refresh"]);
  $("loginView").style.display = "block";
  $("mainView").style.display = "none";
});

// Helpers
function showMainView(name, email) {
  $("loginView").style.display = "none";
  $("mainView").style.display = "block";
  $("userName").textContent = name;
  $("userEmail").textContent = email;
}

function showStatus(id, msg, type) {
  const el = $(id);
  el.textContent = msg;
  el.className = `status ${type}`;
}

async function refreshToken() {
  const stored = await new Promise((r) => chrome.storage.local.get(["fz_refresh"], r));
  if (!stored.fz_refresh) throw new Error("Session expired. Please sign in again.");
  const res = await fetch(`https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grant_type: "refresh_token", refresh_token: stored.fz_refresh }),
  });
  const data = await res.json();
  if (data.error) throw new Error("Session expired. Please sign in again.");
  chrome.storage.local.set({ fz_token: data.id_token, fz_refresh: data.refresh_token });
}

function parseFirestoreDoc(fields) {
  const result = {};
  for (const [key, val] of Object.entries(fields)) {
    if (val.stringValue !== undefined) result[key] = val.stringValue;
    else if (val.integerValue !== undefined) result[key] = val.integerValue;
    else if (val.doubleValue !== undefined) result[key] = String(val.doubleValue);
    else if (val.booleanValue !== undefined) result[key] = String(val.booleanValue);
    else if (val.arrayValue && val.arrayValue.values) {
      // Handle arrays (like customFields)
      const arr = val.arrayValue.values;
      for (const item of arr) {
        if (item.mapValue && item.mapValue.fields) {
          const nested = parseFirestoreDoc(item.mapValue.fields);
          // Handle customField entries
          if (nested.entries) {
            // entries is itself an array of {label, value}
          }
          Object.assign(result, nested);
        } else if (item.stringValue) {
          if (!result[key]) result[key] = [];
          if (Array.isArray(result[key])) result[key].push(item.stringValue);
          else result[key] = result[key] + ", " + item.stringValue;
        }
      }
      if (Array.isArray(result[key])) result[key] = result[key].join(", ");
    } else if (val.mapValue && val.mapValue.fields) {
      Object.assign(result, parseFirestoreDoc(val.mapValue.fields));
    }
  }
  return result;
}
