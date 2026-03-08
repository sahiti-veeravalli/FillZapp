const SYNONYM_MAP = {
  "fullName":       ["full name", "name", "your name", "applicant name", "candidate name", "first name", "last name"],
  "email":          ["email", "e-mail", "email address", "mail", "email id"],
  "phone":          ["phone", "mobile", "contact number", "tel", "cell", "phone number", "mobile number"],
  "gender":         ["gender", "sex"],
  "dateOfBirth":    ["date of birth", "dob", "birth date", "birthday"],
  "address":        ["address", "street", "residence", "location", "permanent address", "current address"],
  "city":           ["city", "town"],
  "state":          ["state", "province"],
  "country":        ["country", "nation"],
  "pincode":        ["pincode", "zip", "zip code", "postal code", "pin"],
  "linkedin":       ["linkedin", "linkedin url", "linkedin profile"],
  "github":         ["github", "github url", "github profile"],
  "portfolio":      ["portfolio", "website", "personal website", "portfolio url"],
  "twitter":        ["twitter", "twitter url", "x profile", "twitter / x"],
  "instagram":      ["instagram", "instagram url", "instagram profile"],
  "facebook":       ["facebook", "facebook url", "facebook profile"],
  "university":     ["university", "college", "institution", "school", "institute"],
  "degree":         ["degree", "qualification", "course", "program"],
  "graduationYear": ["graduation year", "year of graduation", "passing year", "batch"],
  "gpa":            ["gpa", "cgpa", "percentage", "grade", "marks"],
  "company":        ["company", "employer", "organization", "organisation", "current company"],
  "jobTitle":       ["job title", "designation", "position", "role", "current role"],
  "experience":     ["experience", "years of experience", "work experience", "total experience"],
  "skills":         ["skills", "key skills", "technical skills", "skill set"],
  "expectedSalary": ["expected salary", "salary expectation", "expected ctc", "desired salary"],
  "noticePeriod":   ["notice period", "notice", "availability"],
  "aadhaar":        ["aadhaar", "aadhar", "uid", "aadhaar number"],
  "pan":            ["pan", "pan number", "pan card"],
  "voterID":        ["voter id", "voter", "voter id number", "epic"],
  "driverLicense":  ["driver license", "driving license", "dl number", "dl"],
  "passport":       ["passport", "passport number"],
  "cardNumber":     ["card number", "credit card", "debit card", "card no"],
  "cardExpiry":     ["expiry", "expiry date", "valid thru", "valid through"],
  "cvv":            ["cvv", "cvc", "security code"],
  "bankAccount":    ["bank account", "account number", "a/c number", "a/c no"],
  "ifsc":           ["ifsc", "ifsc code", "bank code"],
  "upi":            ["upi", "upi id", "vpa"],
};

function findBestMatch(label) {
  const normalized = label.toLowerCase().trim().replace(/[*:]/g, "").trim();
  for (const [key, synonyms] of Object.entries(SYNONYM_MAP)) {
    if (synonyms.some(s => normalized.includes(s))) return key;
  }
  return null;
}