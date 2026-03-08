function detectAndInject() {
  if (document.getElementById("fillzapp-btn")) return;

  const forms = document.querySelectorAll("form");
  const inputs = document.querySelectorAll("input:not([type='hidden']), textarea, select");

  if (forms.length > 0 || inputs.length > 2) {
    const btn = document.createElement("button");
    btn.id = "fillzapp-btn";
    btn.innerHTML = `<span class="fillzapp-btn-icon">⚡</span> Auto-fill with FillZapp`;
    btn.onclick = () => triggerAutofill();
    document.body.appendChild(btn);
  }
}

// Run on load
detectAndInject();

// Watch for dynamically loaded forms (SPAs)
const observer = new MutationObserver(() => {
  detectAndInject();
});
observer.observe(document.body, { childList: true, subtree: true });