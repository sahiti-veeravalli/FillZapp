// FillZapp Content Script – Detects and fills form fields on any page

const FIREBASE_API_KEY = "AIzaSyB3eEa0pQyriZWuwmSiNqgCKVC2moiuZ1I";
const FIRESTORE_PROJECT = "fillzapp";
const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${FIRESTORE_PROJECT}/databases/(default)/documents/users`;

const FIELD_SYNONYMS = {
  fullName: ["full name", "name", "your name", "applicant name", "candidate name", "full_name", "fullname"],
  firstName: ["first name", "given name", "first_name", "firstname", "fname"],
  lastName: ["last name", "surname", "family name", "last_name", "lastname", "lname"],
  email: ["email", "e-mail", "email address", "email_address", "emailaddress", "mail"],
  phone: ["phone", "telephone", "mobile", "contact number", "phone number", "phone_number", "tel", "cell"],
  dateOfBirth: ["date of birth", "dob", "birth date", "birthday", "date_of_birth", "birthdate"],
  gender: ["gender", "sex"],
  address: ["address", "street address", "residential address", "street_address", "address1", "address_line_1", "street"],
  city: ["city", "town"],
  state: ["state", "province", "region"],
  zipCode: ["zip code", "postal code", "pincode", "zip", "zipcode", "postal"],
  country: ["country", "nation"],
  university: ["university", "college", "institution", "school"],
  degree: ["degree", "qualification"],
  fieldOfStudy: ["field of study", "major", "specialization", "field_of_study"],
  gpa: ["gpa", "cgpa", "grade", "grade point"],
  graduationYear: ["graduation year", "year of graduation", "grad year", "graduation_year"],
  currentCompany: ["current company", "company", "employer", "organization", "current_company"],
  jobTitle: ["job title", "position", "designation", "title", "role", "job_title"],
  experience: ["experience", "years of experience", "work experience", "years_of_experience"],
  skills: ["skills", "key skills", "technical skills", "competencies"],
  linkedin: ["linkedin", "linkedin url", "linkedin profile", "linkedin_url"],
  github: ["github", "github url", "github profile", "github_url"],
  portfolio: ["portfolio", "website", "personal website", "portfolio_url"],
  expectedSalary: ["expected salary", "salary expectation", "desired salary", "salary", "expected_salary"],
  noticePeriod: ["notice period", "availability", "notice_period", "start date"],
};

// Build reverse map
const synonymMap = new Map();
for (const [key, synonyms] of Object.entries(FIELD_SYNONYMS)) {
  for (const syn of synonyms) {
    synonymMap.set(syn.toLowerCase(), key);
  }
}

function getFieldIdentifiers(el) {
  const identifiers = [];
  const attrs = ["name", "id", "placeholder", "aria-label", "autocomplete", "data-field", "data-name"];
  for (const attr of attrs) {
    const val = el.getAttribute(attr);
    if (val) identifiers.push(val.toLowerCase().replace(/[_\-\.]/g, " ").trim());
  }
  const id = el.id;
  if (id) {
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) identifiers.push(label.textContent.toLowerCase().trim());
  }
  const parentLabel = el.closest("label");
  if (parentLabel) {
    const text = parentLabel.textContent.toLowerCase().replace(el.value || "", "").trim();
    if (text) identifiers.push(text);
  }
  const prev = el.previousElementSibling;
  if (prev && prev.tagName === "LABEL") {
    identifiers.push(prev.textContent.toLowerCase().trim());
  }
  // Google Forms: look for ancestor with data-params or aria-label
  const formItem = el.closest("[data-params]");
  if (formItem) {
    const params = formItem.getAttribute("data-params");
    if (params) {
      // Extract question text from data-params (format: %.@.[...,"Question Text",...])
      const match = params.match(/,"([^"]+)",/);
      if (match) identifiers.push(match[1].toLowerCase().trim());
    }
  }
  // Google Forms: check for nearby question title div
  const formItemContainer = el.closest(".freebirdFormviewerComponentsQuestionBaseRoot, [role='listitem'], .Qr7Oae");
  if (formItemContainer) {
    const titleEl = formItemContainer.querySelector(".freebirdFormviewerComponentsQuestionBaseTitle, .M7eMe, [data-value]");
    if (titleEl) identifiers.push(titleEl.textContent.toLowerCase().trim());
  }
  return identifiers;
}

function matchField(identifiers) {
  for (const id of identifiers) {
    if (synonymMap.has(id)) return synonymMap.get(id);
    for (const [synonym, key] of synonymMap) {
      if (id.includes(synonym) || synonym.includes(id)) return key;
    }
  }
  return null;
}

function setNativeValue(el, value) {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype, "value"
  )?.set;
  const nativeTextareaValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype, "value"
  )?.set;

  if (el.tagName === "TEXTAREA" && nativeTextareaValueSetter) {
    nativeTextareaValueSetter.call(el, value);
  } else if (nativeInputValueSetter) {
    nativeInputValueSetter.call(el, value);
  } else {
    el.value = value;
  }

  el.dispatchEvent(new Event("input", { bubbles: true }));
  el.dispatchEvent(new Event("change", { bubbles: true }));
  el.dispatchEvent(new Event("blur", { bubbles: true }));
}

function handleSelectField(el, dataKey, data) {
  const value = data[dataKey];
  if (!value) return false;
  const options = Array.from(el.options);
  const match = options.find(
    (opt) =>
      opt.value.toLowerCase() === value.toLowerCase() ||
      opt.textContent.toLowerCase().trim() === value.toLowerCase()
  );
  if (match) {
    el.value = match.value;
    el.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  }
  return false;
}

function fillForm(data) {
  const inputs = document.querySelectorAll(
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="file"]):not([type="image"]), textarea, select'
  );
  let filled = 0;

  inputs.forEach((el) => {
    if (el.offsetParent === null && !el.closest(".freebirdFormviewerViewNumberedItemContainer")) return;
    if (el.disabled || el.readOnly) return;

    const identifiers = getFieldIdentifiers(el);
    const dataKey = matchField(identifiers);
    if (!dataKey || !data[dataKey]) return;

    if (el.tagName === "SELECT") {
      if (handleSelectField(el, dataKey, data)) {
        highlightField(el);
        filled++;
      }
    } else if (el.type === "checkbox" || el.type === "radio") {
      // Skip for now
    } else {
      setNativeValue(el, data[dataKey]);
      highlightField(el);
      filled++;
    }
  });

  return filled;
}

function highlightField(el) {
  el.style.transition = "box-shadow 0.3s, border-color 0.3s";
  el.style.boxShadow = "0 0 0 2px rgba(139, 92, 246, 0.5), 0 0 15px rgba(139, 92, 246, 0.2)";
  el.style.borderColor = "#8b5cf6";
  setTimeout(() => {
    el.style.boxShadow = "";
    el.style.borderColor = "";
  }, 2000);
}

function showToast(msg, type = "success") {
  // Remove existing toast
  document.querySelectorAll(".fillzapp-toast").forEach((t) => t.remove());
  const toast = document.createElement("div");
  toast.className = "fillzapp-toast";
  if (type === "error") toast.style.borderColor = "rgba(239, 68, 68, 0.5)";
  if (type === "info") toast.style.borderColor = "rgba(59, 130, 246, 0.5)";
  toast.innerHTML = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ─── Floating Action Button ─────────────────────────────────────────

function hasFormFields() {
  return document.querySelectorAll(
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="file"]):not([type="image"]), textarea, select'
  ).length > 0;
}

function parseFirestoreDoc(fields) {
  const result = {};
  for (const [key, val] of Object.entries(fields)) {
    if (val.stringValue !== undefined) result[key] = val.stringValue;
    else if (val.integerValue !== undefined) result[key] = val.integerValue;
    else if (val.doubleValue !== undefined) result[key] = String(val.doubleValue);
    else if (val.booleanValue !== undefined) result[key] = String(val.booleanValue);
    else if (val.arrayValue && val.arrayValue.values) {
      const arr = val.arrayValue.values;
      for (const item of arr) {
        if (item.mapValue && item.mapValue.fields) {
          const nested = parseFirestoreDoc(item.mapValue.fields);
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

async function refreshToken() {
  const stored = await new Promise((r) => chrome.storage.local.get(["fz_refresh"], r));
  if (!stored.fz_refresh) throw new Error("Not logged in");
  const res = await fetch(`https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grant_type: "refresh_token", refresh_token: stored.fz_refresh }),
  });
  const data = await res.json();
  if (data.error) throw new Error("Session expired");
  chrome.storage.local.set({ fz_token: data.id_token, fz_refresh: data.refresh_token });
  return data.id_token;
}

async function fetchAndFill() {
  const stored = await new Promise((r) => chrome.storage.local.get(["fz_token", "fz_uid"], r));
  if (!stored.fz_token || !stored.fz_uid) {
    showToast("⚡ Please sign in via the FillZapp extension first", "error");
    return;
  }

  showToast("⚡ Loading your profile...", "info");

  let token = stored.fz_token;
  let res = await fetch(`${FIRESTORE_URL}/${stored.fz_uid}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401 || res.status === 403) {
    try {
      token = await refreshToken();
      res = await fetch(`${FIRESTORE_URL}/${stored.fz_uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      showToast("⚡ Session expired. Please sign in again.", "error");
      return;
    }
  }

  if (!res.ok) {
    showToast("⚡ Failed to fetch profile data", "error");
    return;
  }

  const docData = await res.json();
  const profileData = parseFirestoreDoc(docData.fields || {});
  const filled = fillForm(profileData);

  if (filled > 0) {
    showToast(`⚡ FillZapp filled <strong>${filled}</strong> field${filled !== 1 ? "s" : ""}!`);
  } else {
    showToast("⚡ No matching fields found on this page", "error");
  }
}

function createFAB() {
  if (document.getElementById("fillzapp-fab")) return;

  const fab = document.createElement("div");
  fab.id = "fillzapp-fab";
  fab.innerHTML = "⚡";
  fab.title = "FillZapp – Auto-fill this form";
  document.body.appendChild(fab);

  // Tooltip label
  const label = document.createElement("div");
  label.id = "fillzapp-fab-label";
  label.textContent = "Auto-Fill";
  document.body.appendChild(label);

  fab.addEventListener("mouseenter", () => label.classList.add("show"));
  fab.addEventListener("mouseleave", () => label.classList.remove("show"));

  fab.addEventListener("click", async () => {
    fab.style.pointerEvents = "none";
    fab.style.opacity = "0.6";
    fab.classList.add("fillzapp-fab-spin");
    try {
      await fetchAndFill();
    } catch (err) {
      showToast("⚡ Error: " + err.message, "error");
    }
    fab.style.pointerEvents = "";
    fab.style.opacity = "";
    fab.classList.remove("fillzapp-fab-spin");
  });
}

// Inject FAB when forms are detected
function tryInjectFAB() {
  if (hasFormFields()) {
    createFAB();
  }
}

// Run on load and observe for dynamically loaded forms
tryInjectFAB();
const observer = new MutationObserver(() => tryInjectFAB());
observer.observe(document.body, { childList: true, subtree: true });

// Listen for messages from popup (keep backward compat)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "FILLZAPP_FILL" && msg.data) {
    const filled = fillForm(msg.data);
    if (filled > 0) showToast(`⚡ FillZapp filled <strong>${filled}</strong> field${filled !== 1 ? "s" : ""}!`);
    sendResponse({ filled });
  }
  return true;
});
