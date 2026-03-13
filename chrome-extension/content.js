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

// ─── Field Detection ────────────────────────────────────────────────

function getFieldIdentifiers(el) {
  const identifiers = [];
  const attrs = ["name", "id", "placeholder", "aria-label", "autocomplete", "data-field", "data-name", "title"];
  for (const attr of attrs) {
    const val = el.getAttribute(attr);
    if (val) identifiers.push(val.toLowerCase().replace(/[_\-\.]/g, " ").trim());
  }
  // Label via for attribute
  const id = el.id;
  if (id) {
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) identifiers.push(label.textContent.toLowerCase().trim());
  }
  // Wrapping label
  const parentLabel = el.closest("label");
  if (parentLabel) {
    const text = parentLabel.textContent.toLowerCase().replace(el.value || "", "").trim();
    if (text) identifiers.push(text);
  }
  // Previous sibling label
  const prev = el.previousElementSibling;
  if (prev && prev.tagName === "LABEL") {
    identifiers.push(prev.textContent.toLowerCase().trim());
  }
  // Next sibling label (some forms put label after)
  const next = el.nextElementSibling;
  if (next && next.tagName === "LABEL") {
    identifiers.push(next.textContent.toLowerCase().trim());
  }
  // Parent container text (for div-wrapped labels)
  const parent = el.parentElement;
  if (parent) {
    const siblingLabels = parent.querySelectorAll("label, .label, [class*='label'], span");
    siblingLabels.forEach((lbl) => {
      const t = lbl.textContent.toLowerCase().trim();
      if (t && t.length < 60) identifiers.push(t);
    });
  }
  // Google Forms support
  const formItem = el.closest("[data-params]");
  if (formItem) {
    const params = formItem.getAttribute("data-params");
    if (params) {
      const match = params.match(/,"([^"]+)",/);
      if (match) identifiers.push(match[1].toLowerCase().trim());
    }
  }
  const formItemContainer = el.closest(".freebirdFormviewerComponentsQuestionBaseRoot, [role='listitem'], .Qr7Oae");
  if (formItemContainer) {
    const titleEl = formItemContainer.querySelector(".freebirdFormviewerComponentsQuestionBaseTitle, .M7eMe, [data-value]");
    if (titleEl) identifiers.push(titleEl.textContent.toLowerCase().trim());
  }
  return identifiers;
}

function matchField(identifiers) {
  for (const id of identifiers) {
    // Exact match first
    if (synonymMap.has(id)) return synonymMap.get(id);
  }
  for (const id of identifiers) {
    // Partial match
    for (const [synonym, key] of synonymMap) {
      if (id.includes(synonym) || synonym.includes(id)) return key;
    }
  }
  return null;
}

function getFieldLabel(identifiers) {
  // Return a human-readable label from identifiers
  for (const id of identifiers) {
    if (id.length > 2 && id.length < 40) return id.charAt(0).toUpperCase() + id.slice(1);
  }
  return "Field";
}

// ─── Value Setting ──────────────────────────────────────────────────

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

// ─── Per-field Autofill Buttons ─────────────────────────────────────

const detectedFields = new WeakSet();
const fieldButtons = new WeakMap();

function getAllFormFields() {
  return document.querySelectorAll(
    'input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="file"]):not([type="image"]):not([type="checkbox"]):not([type="radio"]), textarea, select'
  );
}

function isFieldVisible(el) {
  if (el.offsetParent === null && !el.closest(".freebirdFormviewerViewNumberedItemContainer")) return false;
  if (el.disabled) return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 20 && rect.height > 10;
}

function createFieldButton(el, dataKey, labelText) {
  if (fieldButtons.has(el)) return;

  const btn = document.createElement("div");
  btn.className = "fillzapp-field-btn";
  btn.innerHTML = `⚡`;
  btn.title = `Auto-fill: ${labelText}`;
  btn.setAttribute("data-fillzapp-key", dataKey);

  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    btn.classList.add("fillzapp-field-btn-loading");

    try {
      const data = await getProfileData();
      if (data && data[dataKey]) {
        if (el.tagName === "SELECT") {
          handleSelectField(el, dataKey, data);
        } else {
          setNativeValue(el, data[dataKey]);
        }
        highlightField(el);
        btn.innerHTML = "✓";
        btn.classList.add("fillzapp-field-btn-done");
        setTimeout(() => {
          btn.innerHTML = "⚡";
          btn.classList.remove("fillzapp-field-btn-done");
        }, 2000);
      } else {
        showToast(`⚡ No data found for "${labelText}"`, "error");
      }
    } catch (err) {
      showToast("⚡ " + err.message, "error");
    }

    btn.classList.remove("fillzapp-field-btn-loading");
  });

  // Position the button
  document.body.appendChild(btn);
  positionButton(btn, el);
  fieldButtons.set(el, btn);
}

function positionButton(btn, el) {
  const rect = el.getBoundingClientRect();
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  btn.style.top = `${rect.top + scrollY + (rect.height / 2) - 12}px`;
  btn.style.left = `${rect.right + scrollX + 4}px`;

  // If button would go off-screen, place it inside the field on the right
  if (rect.right + 36 > window.innerWidth) {
    btn.style.left = `${rect.right + scrollX - 30}px`;
  }
}

function updateButtonPositions() {
  const fields = getAllFormFields();
  fields.forEach((el) => {
    if (fieldButtons.has(el)) {
      const btn = fieldButtons.get(el);
      if (isFieldVisible(el)) {
        positionButton(btn, el);
        btn.style.display = "";
      } else {
        btn.style.display = "none";
      }
    }
  });
}

function scanAndDecorate() {
  const fields = getAllFormFields();
  let detectedCount = 0;

  fields.forEach((el) => {
    if (detectedFields.has(el)) return;
    if (!isFieldVisible(el)) return;

    const identifiers = getFieldIdentifiers(el);
    const dataKey = matchField(identifiers);

    if (dataKey) {
      const label = getFieldLabel(identifiers);
      createFieldButton(el, dataKey, label);
      detectedFields.add(el);
      detectedCount++;
    } else {
      // Even for unmatched fields, mark as detected so we don't re-check
      detectedFields.add(el);
    }
  });

  return detectedCount;
}

// ─── Fill All ───────────────────────────────────────────────────────

function fillForm(data) {
  const inputs = getAllFormFields();
  let filled = 0;

  inputs.forEach((el) => {
    if (!isFieldVisible(el)) return;
    if (el.readOnly) return;

    const identifiers = getFieldIdentifiers(el);
    const dataKey = matchField(identifiers);
    if (!dataKey || !data[dataKey]) return;

    if (el.tagName === "SELECT") {
      if (handleSelectField(el, dataKey, data)) {
        highlightField(el);
        filled++;
      }
    } else {
      setNativeValue(el, data[dataKey]);
      highlightField(el);
      filled++;
    }

    // Mark button as done
    if (fieldButtons.has(el)) {
      const btn = fieldButtons.get(el);
      btn.innerHTML = "✓";
      btn.classList.add("fillzapp-field-btn-done");
      setTimeout(() => {
        btn.innerHTML = "⚡";
        btn.classList.remove("fillzapp-field-btn-done");
      }, 2000);
    }
  });

  return filled;
}

// ─── Visual Feedback ────────────────────────────────────────────────

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

// ─── Firebase/Firestore ─────────────────────────────────────────────

let cachedProfileData = null;

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
          Object.assign(result, parseFirestoreDoc(item.mapValue.fields));
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

async function getProfileData() {
  if (cachedProfileData) return cachedProfileData;

  const stored = await new Promise((r) => chrome.storage.local.get(["fz_token", "fz_uid"], r));
  if (!stored.fz_token || !stored.fz_uid) {
    window.open("https://fillzapp.com/login", "_blank");
    throw new Error("REDIRECT");
  }

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
      throw new Error("Session expired. Please sign in again.");
    }
  }

  if (!res.ok) throw new Error("Failed to fetch profile data");

  const docData = await res.json();
  cachedProfileData = parseFirestoreDoc(docData.fields || {});
  // Clear cache after 5 min
  setTimeout(() => { cachedProfileData = null; }, 5 * 60 * 1000);
  return cachedProfileData;
}

// ─── FAB (Fill All Button) ──────────────────────────────────────────

function createFAB() {
  if (document.getElementById("fillzapp-fab")) return;

  const fab = document.createElement("div");
  fab.id = "fillzapp-fab";
  fab.innerHTML = "⚡";
  fab.title = "FillZapp – Auto-fill ALL fields";
  document.body.appendChild(fab);

  const label = document.createElement("div");
  label.id = "fillzapp-fab-label";
  label.textContent = "Fill All Fields";
  document.body.appendChild(label);

  fab.addEventListener("mouseenter", () => label.classList.add("show"));
  fab.addEventListener("mouseleave", () => label.classList.remove("show"));

  fab.addEventListener("click", async () => {
    fab.style.pointerEvents = "none";
    fab.style.opacity = "0.6";
    fab.classList.add("fillzapp-fab-spin");
    try {
      const data = await getProfileData();
      const filled = fillForm(data);
      if (filled > 0) {
        showToast(`⚡ FillZapp filled <strong>${filled}</strong> field${filled !== 1 ? "s" : ""}!`);
      } else {
        showToast("⚡ No matching fields found on this page", "error");
      }
    } catch (err) {
      showToast("⚡ " + err.message, "error");
    }
    fab.style.pointerEvents = "";
    fab.style.opacity = "";
    fab.classList.remove("fillzapp-fab-spin");
  });
}

// ─── Init ───────────────────────────────────────────────────────────

function init() {
  const fields = getAllFormFields();
  if (fields.length > 0) {
    scanAndDecorate();
    createFAB();
  }
}

init();

// Re-scan on DOM changes (dynamic forms)
const observer = new MutationObserver(() => {
  const fields = getAllFormFields();
  if (fields.length > 0) {
    scanAndDecorate();
    createFAB();
  }
});
observer.observe(document.body, { childList: true, subtree: true });

// Reposition buttons on scroll/resize
window.addEventListener("scroll", updateButtonPositions, { passive: true });
window.addEventListener("resize", updateButtonPositions, { passive: true });

// Listen for messages from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "FILLZAPP_FILL" && msg.data) {
    const filled = fillForm(msg.data);
    if (filled > 0) showToast(`⚡ FillZapp filled <strong>${filled}</strong> field${filled !== 1 ? "s" : ""}!`);
    sendResponse({ filled });
  }
  return true;
});
