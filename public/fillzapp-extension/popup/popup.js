// FillZapp Popup Script

const DASHBOARD_URL = "https://your-fillzapp-app.lovable.app/dashboard";

// Elements
const statusEl = document.getElementById("status");
const toggleAutofill = document.getElementById("toggle-autofill");
const toggleConfirm = document.getElementById("toggle-confirm");
const toggleForce = document.getElementById("toggle-force");
const syncBtn = document.getElementById("sync-btn");
const triggerBtn = document.getElementById("trigger-btn");
const forceShowLink = document.getElementById("force-show-link");
const dashboardBtn = document.getElementById("dashboard-btn");
const fieldCountEl = document.getElementById("field-count");

// Load saved state
chrome.storage.local.get(["profileData", "settings", "uid"], (result) => {
  const data = result.profileData || {};
  const settings = result.settings || { autofillEnabled: true, confirmBeforeFill: true, alwaysShowButton: false };
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
  if (settings.alwaysShowButton) toggleForce.classList.add("active");
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

toggleForce.onclick = () => {
  toggleForce.classList.toggle("active");
  saveSettings();
};

function saveSettings() {
  const settings = {
    autofillEnabled: toggleAutofill.classList.contains("active"),
    confirmBeforeFill: toggleConfirm.classList.contains("active"),
    alwaysShowButton: toggleForce.classList.contains("active"),
  };
  chrome.runtime.sendMessage({ type: "SAVE_SETTINGS", settings });
}

// Manual trigger button
triggerBtn.onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { type: "MANUAL_TRIGGER" });
      window.close();
    }
  });
};

// Force show button on current page
forceShowLink.onclick = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { type: "FORCE_SHOW_BUTTON" });
      forceShowLink.textContent = "✓ Button injected!";
      setTimeout(() => { forceShowLink.textContent = "Force show on this page"; }, 2000);
    }
  });
};

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
