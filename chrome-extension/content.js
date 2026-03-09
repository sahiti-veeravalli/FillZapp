// FillZapp Content Script – Detects and fills form fields on any page

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

// Build reverse map: synonym → dataKey
const synonymMap = new Map();
for (const [key, synonyms] of Object.entries(FIELD_SYNONYMS)) {
  for (const syn of synonyms) {
    synonymMap.set(syn.toLowerCase(), key);
  }
}

function getFieldIdentifiers(el) {
  const identifiers = [];
  // Collect all possible text identifiers
  const attrs = ["name", "id", "placeholder", "aria-label", "autocomplete", "data-field", "data-name"];
  for (const attr of attrs) {
    const val = el.getAttribute(attr);
    if (val) identifiers.push(val.toLowerCase().replace(/[_\-\.]/g, " ").trim());
  }
  // Check associated label
  const id = el.id;
  if (id) {
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) identifiers.push(label.textContent.toLowerCase().trim());
  }
  // Check parent label
  const parentLabel = el.closest("label");
  if (parentLabel) {
    const text = parentLabel.textContent.toLowerCase().replace(el.value || "", "").trim();
    if (text) identifiers.push(text);
  }
  // Check preceding label sibling
  const prev = el.previousElementSibling;
  if (prev && prev.tagName === "LABEL") {
    identifiers.push(prev.textContent.toLowerCase().trim());
  }
  return identifiers;
}

function matchField(identifiers) {
  for (const id of identifiers) {
    // Direct match
    if (synonymMap.has(id)) return synonymMap.get(id);
    // Partial match
    for (const [synonym, key] of synonymMap) {
      if (id.includes(synonym) || synonym.includes(id)) return key;
    }
  }
  return null;
}

function setNativeValue(el, value) {
  // Trigger React/Vue/Angular-compatible value setting
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
    if (el.offsetParent === null) return; // Skip hidden
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

function showToast(count) {
  const toast = document.createElement("div");
  toast.className = "fillzapp-toast";
  toast.innerHTML = `⚡ FillZapp filled <strong>${count}</strong> field${count !== 1 ? "s" : ""}`;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "FILLZAPP_FILL" && msg.data) {
    const filled = fillForm(msg.data);
    if (filled > 0) showToast(filled);
    sendResponse({ filled });
  }
  return true;
});
