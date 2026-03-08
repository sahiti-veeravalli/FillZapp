function detectAndInject() {
  if (document.getElementById("fillzapp-btn-container")) return;

  const forms = document.querySelectorAll("form");
  const inputs = document.querySelectorAll("input:not([type='hidden']), textarea, select");

  if (forms.length > 0 || inputs.length > 2) {
    const container = document.createElement("div");
    container.id = "fillzapp-btn-container";

    const mainBtn = document.createElement("button");
    mainBtn.id = "fillzapp-btn";
    mainBtn.innerHTML = `<span class="fillzapp-btn-icon">⚡</span> Auto-fill`;
    mainBtn.onclick = () => triggerAutofill();

    const cancelBtn = document.createElement("button");
    cancelBtn.id = "fillzapp-cancel-btn";
    cancelBtn.innerHTML = `✕`;
    cancelBtn.title = "Dismiss FillZapp";
    cancelBtn.onclick = () => {
      container.remove();
    };

    container.appendChild(mainBtn);
    container.appendChild(cancelBtn);
    document.body.appendChild(container);
  }
}

// Run on load
detectAndInject();

// Watch for dynamically loaded forms (SPAs)
const observer = new MutationObserver(() => {
  detectAndInject();
});
observer.observe(document.body, { childList: true, subtree: true });

// Listen for manual trigger from popup
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "MANUAL_TRIGGER") {
    triggerAutofill();
  }
});
