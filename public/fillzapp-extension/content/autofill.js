function getFieldLabel(input) {
  const id = input.id || input.name;
  if (id) {
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) return label.textContent;
  }
  const parent = input.closest("label");
  if (parent) return parent.textContent;
  const ariaLabel = input.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel;
  if (input.placeholder) return input.placeholder;
  const prev = input.previousElementSibling;
  if (prev && (prev.tagName === "LABEL" || prev.tagName === "SPAN")) return prev.textContent;
  return input.name || "";
}

function fillFields(matches) {
  matches.forEach(({ input, value }) => {
    if (input.tagName === "SELECT") {
      const options = Array.from(input.options);
      const match = options.find(o => o.text.toLowerCase().includes(value.toLowerCase()) || o.value.toLowerCase().includes(value.toLowerCase()));
      if (match) {
        input.value = match.value;
      }
    } else {
      input.value = value;
    }
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
    input.dispatchEvent(new Event("blur", { bubbles: true }));
  });
}

function showConfirmDialog(matches, onConfirm) {
  const existing = document.getElementById("fillzapp-confirm");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "fillzapp-confirm";
  overlay.innerHTML = `
    <div class="fillzapp-modal">
      <div class="fillzapp-modal-header">
        <span class="fillzapp-logo">⚡</span>
        <h3>FillZapp — Review & Confirm</h3>
      </div>
      <div class="fillzapp-fields">
        ${matches.map(m => `
          <div class="fillzapp-row">
            <span class="fillzapp-label">${m.label}</span>
            <span class="fillzapp-value">${m.value}</span>
          </div>
        `).join("")}
      </div>
      <p class="fillzapp-count">${matches.length} field${matches.length !== 1 ? "s" : ""} matched</p>
      <div class="fillzapp-actions">
        <button id="fz-cancel">Cancel</button>
        <button id="fz-confirm">⚡ Fill All</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  document.getElementById("fz-confirm").onclick = () => { overlay.remove(); onConfirm(); };
  document.getElementById("fz-cancel").onclick = () => overlay.remove();
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
}

async function triggerAutofill() {
  const result = await chrome.storage.local.get(["profileData", "settings"]);
  const data = result.profileData || {};
  const settings = result.settings || {};

  if (!data || Object.keys(data).length === 0) {
    alert("FillZapp: No profile data found. Please log in via the extension popup.");
    return;
  }

  const inputs = document.querySelectorAll("input, textarea, select");
  const matches = [];

  inputs.forEach(input => {
    if (input.type === "hidden" || input.type === "submit" || input.type === "button") return;
    const label = getFieldLabel(input);
    const matchKey = findBestMatch(label);
    if (matchKey && data[matchKey]) {
      matches.push({ input, key: matchKey, value: data[matchKey], label: label.trim() });
    }
  });

  if (matches.length === 0) {
    alert("FillZapp: No matching fields found on this page.");
    return;
  }

  if (settings.confirmBeforeFill) {
    showConfirmDialog(matches, () => fillFields(matches));
  } else {
    fillFields(matches);
  }
}