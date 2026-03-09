// FillZapp Background Service Worker
// Handles token refresh and extension lifecycle

chrome.runtime.onInstalled.addListener(() => {
  console.log("FillZapp extension installed");
});
