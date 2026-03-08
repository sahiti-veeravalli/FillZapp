// FillZapp Popup Script

const DASHBOARD_URL = "https://your-fillzapp-app.lovable.app/dashboard";

// Elements
const statusEl = document.getElementById("status");
const toggleAutofill = document.getElementById("toggle-autofill");
const toggleConfirm = document.getElementById("toggle-confirm");
const syncBtn = document.getElementById("sync-btn");
const dashboardBtn = document.getElementById("dashboard-btn");
const fieldCountEl = document.getElementById("field-count");

// Load saved state
chrome.storage.local.get(["profileData", "settings", "uid"], (result) => {
  const data = result.profileData || {};
  const settings = result.settings || { autofillEnabled: true, confirmBeforeFill: true };
  const uid = result.uid;

  const fieldCount = Object.keys(data).filter(k => data[k] && !k.includes("customFields")).length;

  if (uid && fieldCount > 0) {
    statusEl.textContent = `✓ Connected — ${fieldCount} fields synced`;
    statusEl.className = "status connected";
  } else {
    statusEl.textContent = "Not connected — sync your profile";
    statusEl.className = "status disconnected";
  }

  fieldCountEl.innerHTML = `<strong>${fieldCount}</strong> fields ready for auto-fill`;

  if (!settings.autofillEnabled) toggleAutofill.classList.remove("active");
  if (!settings.confirmBeforeFill) toggleConfirm.classList.remove("active");
});

// Toggle handlers
toggleAutofill.onclick = () => {
  toggleAutofill.classList.toggle("active");
  saveSettings();
};

toggleConfirm.onclick = () => {
  toggleConfirm.classList.toggle("active");
  saveSettings();
};

function saveSettings() {
  const settings = {
    autofillEnabled: toggleAutofill.classList.contains("active"),
    confirmBeforeFill: toggleConfirm.classList.contains("active"),
  };
  chrome.runtime.sendMessage({ type: "SAVE_SETTINGS", settings });
}

// Sync button
syncBtn.onclick = () => {
  chrome.storage.local.get(["uid"], (result) => {
    if (!result.uid) {
      statusEl.textContent = "⚠ Please log in on the dashboard first";
      statusEl.className = "status disconnected";
      return;
    }
    syncBtn.textContent = "Syncing...";
    chrome.runtime.sendMessage({ type: "SYNC_PROFILE", uid: result.uid }, (res) => {
      syncBtn.textContent = res?.success ? "✓ Synced!" : "✕ Sync failed";
      setTimeout(() => { syncBtn.textContent = "⚡ Sync Profile Data"; }, 2000);
      if (res?.success) location.reload();
    });
  });
};

// Dashboard button
dashboardBtn.onclick = () => {
  chrome.tabs.create({ url: DASHBOARD_URL });
};