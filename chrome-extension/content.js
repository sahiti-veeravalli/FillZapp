// FillZapp Content Script
// Detects forms, shows floating button, and auto-fills fields

(() => {
  let floatingBtn = null;
  let confirmModal = null;
  let userData = null;
  let settings = { autoFill: true, confirmBeforeFill: false };

  // Synonym map for smart field matching
  const FIELD_SYNONYMS = {
    fullName: ["full name", "name", "your name", "applicant name", "candidate name", "full_name", "fullname"],
    firstName: ["first name", "first_name", "firstname", "given name"],
    lastName: ["last name", "last_name", "lastname", "surname", "family name"],
    email: ["email", "e-mail", "email address", "mail", "email_address"],
    phone: ["phone", "telephone", "mobile", "cell", "contact number", "phone number", "mobile number", "tel"],
    dateOfBirth: ["date of birth", "dob", "birth date", "birthday", "date_of_birth"],
    gender: ["gender", "sex"],
    address: ["address", "street address", "street", "residential address", "mailing address"],
    city: ["city", "town"],
    state: ["state", "province", "region"],
    zipCode: ["zip", "zip code", "postal code", "pincode", "pin code", "zipcode", "pin"],
    country: ["country", "nation"],

    // Education
    university: ["university", "college", "institution", "school", "institute"],
    degree: ["degree", "qualification", "education level"],
    fieldOfStudy: ["field of study", "major", "specialization", "branch", "department", "course"],
    gpa: ["gpa", "cgpa", "grade", "percentage", "marks", "score"],
    graduationYear: ["graduation year", "year of graduation", "passing year", "batch"],

    // Professional
    currentCompany: ["current company", "company", "employer", "organization", "organisation"],
    jobTitle: ["job title", "position", "designation", "role", "title"],
    experience: ["experience", "years of experience", "work experience", "total experience"],
    skills: ["skills", "skill set", "key skills", "technical skills", "competencies"],
    linkedin: ["linkedin", "linkedin url", "linkedin profile"],

    // Government IDs
    ssn: ["ssn", "social security", "social security number"],
    passportNumber: ["passport", "passport number", "passport no"],
    driverLicense: ["driver license", "driving license", "license number", "dl number", "dl no"],
    aadhar: ["aadhar", "aadhaar", "aadhar number", "aadhaar number", "uid"],
    pan: ["pan", "pan number", "pan card", "permanent account number"],
    voterId: ["voter id", "voter card", "epic number"],

    // Job Preferences
    expectedSalary: ["expected salary", "salary expectation", "desired salary", "salary"],
    jobType: ["job type", "employment type", "work type"],
    preferredLocation: ["preferred location", "location preference", "desired location", "work location"],
    noticePeriod: ["notice period", "availability", "joining time"],
  };

  // Flatten user data to handle nested objects
  function flattenData(obj, prefix = "") {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        Object.assign(result, flattenData(value, prefix));
      } else {
        result[key] = Array.isArray(value) ? value.join(", ") : value;
      }
    }
    return result;
  }

  // Match a field label/name/placeholder to user data key
  function matchField(text) {
    if (!text) return null;
    const lower = text.toLowerCase().trim();
    for (const [dataKey, synonyms] of Object.entries(FIELD_SYNONYMS)) {
      for (const synonym of synonyms) {
        if (lower.includes(synonym) || synonym.includes(lower)) {
          return dataKey;
        }
      }
    }
    return null;
  }

  // Get label text for an input
  function getFieldLabel(input) {
    // Check label[for]
    if (input.id) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (label) return label.textContent;
    }
    // Check parent label
    const parentLabel = input.closest("label");
    if (parentLabel) return parentLabel.textContent;
    // Check aria-label
    if (input.getAttribute("aria-label")) return input.getAttribute("aria-label");
    // Check placeholder
    if (input.placeholder) return input.placeholder;
    // Check name attribute
    if (input.name) return input.name.replace(/[_-]/g, " ");
    // Check preceding sibling text
    const prev = input.previousElementSibling;
    if (prev && prev.textContent) return prev.textContent;
    return null;
  }

  // Detect fillable forms on the page
  function detectForms() {
    const inputs = document.querySelectorAll(
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="file"]):not([type="image"]), textarea, select'
    );
    return inputs.length >= 2; // At least 2 fields = likely a form
  }

  // Fill all detected fields
  function fillFields(data) {
    const flat = flattenData(data);
    const inputs = document.querySelectorAll(
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="file"]):not([type="image"]), textarea, select'
    );

    let filledCount = 0;

    inputs.forEach((input) => {
      const labelText = getFieldLabel(input);
      const dataKey = matchField(labelText);

      if (dataKey && flat[dataKey]) {
        const value = String(flat[dataKey]);

        if (input.tagName === "SELECT") {
          // Try to match select option
          const options = Array.from(input.options);
          const match = options.find(
            (opt) =>
              opt.value.toLowerCase() === value.toLowerCase() ||
              opt.textContent.toLowerCase().includes(value.toLowerCase())
          );
          if (match) {
            input.value = match.value;
            input.dispatchEvent(new Event("change", { bubbles: true }));
            filledCount++;
          }
        } else if (input.type === "radio") {
          if (input.value.toLowerCase() === value.toLowerCase() ||
              input.labels?.[0]?.textContent?.toLowerCase().includes(value.toLowerCase())) {
            input.checked = true;
            input.dispatchEvent(new Event("change", { bubbles: true }));
            filledCount++;
          }
        } else if (input.type === "checkbox") {
          const shouldCheck = value === "true" || value === "yes" || value === "1";
          if (input.checked !== shouldCheck) {
            input.checked = shouldCheck;
            input.dispatchEvent(new Event("change", { bubbles: true }));
            filledCount++;
          }
        } else {
          // Text, email, tel, textarea, etc.
          input.value = value;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
          // For React-based forms
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, "value"
          )?.set || Object.getOwnPropertyDescriptor(
            window.HTMLTextAreaElement.prototype, "value"
          )?.set;
          if (nativeInputValueSetter) {
            nativeInputValueSetter.call(input, value);
            input.dispatchEvent(new Event("input", { bubbles: true }));
          }
          filledCount++;

          // Highlight filled fields briefly
          input.style.transition = "background-color 0.3s";
          input.style.backgroundColor = "#00e5c030";
          setTimeout(() => {
            input.style.backgroundColor = "";
          }, 1500);
        }
      }
    });

    return filledCount;
  }

  // Create floating button
  function createFloatingButton() {
    if (floatingBtn) return;

    floatingBtn = document.createElement("div");
    floatingBtn.id = "fillzapp-floating-btn";
    floatingBtn.innerHTML = `
      <div class="fz-fab-container">
        <button class="fz-fab-main" title="Auto-fill with FillZapp">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          <span>FillZapp</span>
        </button>
        <button class="fz-fab-cancel" title="Dismiss">✕</button>
      </div>
    `;

    document.body.appendChild(floatingBtn);

    // Fill button click
    floatingBtn.querySelector(".fz-fab-main").addEventListener("click", async () => {
      if (settings.confirmBeforeFill) {
        showConfirmModal();
      } else {
        await performFill();
      }
    });

    // Cancel button click
    floatingBtn.querySelector(".fz-fab-cancel").addEventListener("click", () => {
      floatingBtn.remove();
      floatingBtn = null;
    });
  }

  // Show confirmation modal
  function showConfirmModal() {
    if (confirmModal) confirmModal.remove();

    confirmModal = document.createElement("div");
    confirmModal.id = "fillzapp-confirm-modal";
    confirmModal.innerHTML = `
      <div class="fz-modal-overlay">
        <div class="fz-modal-box">
          <div class="fz-modal-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00e5c0" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            <span>FillZapp Auto-Fill</span>
          </div>
          <p class="fz-modal-text">Do you want to auto-fill this form with your saved data?</p>
          <div class="fz-modal-actions">
            <button class="fz-modal-cancel">Cancel</button>
            <button class="fz-modal-confirm">Fill Now</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(confirmModal);

    confirmModal.querySelector(".fz-modal-cancel").addEventListener("click", () => {
      confirmModal.remove();
      confirmModal = null;
    });

    confirmModal.querySelector(".fz-modal-confirm").addEventListener("click", async () => {
      confirmModal.remove();
      confirmModal = null;
      await performFill();
    });

    confirmModal.querySelector(".fz-modal-overlay").addEventListener("click", (e) => {
      if (e.target === confirmModal.querySelector(".fz-modal-overlay")) {
        confirmModal.remove();
        confirmModal = null;
      }
    });
  }

  // Perform the actual fill
  async function performFill() {
    if (!userData) {
      try {
        const response = await chrome.runtime.sendMessage({ type: "GET_USER_DATA" });
        if (response.error) {
          showToast("Please log in to FillZapp first", "error");
          return;
        }
        userData = response.data;
      } catch {
        showToast("Failed to fetch your data", "error");
        return;
      }
    }

    const count = fillFields(userData);
    if (count > 0) {
      showToast(`✓ Filled ${count} field${count > 1 ? "s" : ""} successfully`, "success");
    } else {
      showToast("No matching fields found", "warning");
    }
  }

  // Toast notification
  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `fz-toast fz-toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("fz-toast-show"), 10);
    setTimeout(() => {
      toast.classList.remove("fz-toast-show");
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Initialize
  async function init() {
    // Get settings
    try {
      const s = await chrome.runtime.sendMessage({ type: "GET_SETTINGS" });
      if (s) settings = s;
    } catch {}

    // Check if user is logged in
    try {
      const authState = await chrome.runtime.sendMessage({ type: "GET_AUTH_STATE" });
      if (!authState.user) return; // Not logged in, don't show button
    } catch {
      return;
    }

    // Detect forms
    if (detectForms()) {
      // Small delay to let dynamic forms load
      setTimeout(() => {
        if (detectForms()) {
          createFloatingButton();

          // If auto-fill is on and no confirmation needed, fill immediately
          if (settings.autoFill && !settings.confirmBeforeFill) {
            performFill();
          }
        }
      }, 1500);
    }
  }

  // Run when page is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Also watch for dynamically added forms (SPAs)
  const observer = new MutationObserver(() => {
    if (!floatingBtn && detectForms()) {
      createFloatingButton();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
