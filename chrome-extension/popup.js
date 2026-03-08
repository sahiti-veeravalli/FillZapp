// FillZapp Popup Script

const FIREBASE_API_KEY = "AIzaSyB3eEa0pQyriZWuwmSiNqgCKVC2moiuZ1I";
const DASHBOARD_URL = "https://fillzapp.lovable.app/dashboard";

const loginView = document.getElementById("login-view");
const loggedinView = document.getElementById("loggedin-view");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const errorMsg = document.getElementById("error-msg");
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const userAvatar = document.getElementById("user-avatar");
const toggleAutofill = document.getElementById("toggle-autofill");
const toggleConfirm = document.getElementById("toggle-confirm");
const btnLogout = document.getElementById("btn-logout");
const btnDashboard = document.getElementById("btn-dashboard");

// Check auth state on popup open
chrome.runtime.sendMessage({ type: "GET_AUTH_STATE" }, (response) => {
  if (response && response.user) {
    showLoggedIn(response.user);
  }
});

// Load settings
chrome.storage.local.get(["fz_autofill", "fz_confirm"], (result) => {
  toggleAutofill.checked = result.fz_autofill !== "false";
  toggleConfirm.checked = result.fz_confirm === "true";
});

// Login
loginBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (!email || !password) {
    showError("Please enter email and password");
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = "Signing in...";
  errorMsg.style.display = "none";

  try {
    // Firebase REST Auth
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await res.json();

    if (data.error) {
      const msg = data.error.message
        .replace("EMAIL_NOT_FOUND", "Account not found")
        .replace("INVALID_PASSWORD", "Wrong password")
        .replace("INVALID_LOGIN_CREDENTIALS", "Invalid email or password")
        .replace("TOO_MANY_ATTEMPTS_TRY_LATER", "Too many attempts. Try later.");
      showError(msg);
      return;
    }

    const user = {
      uid: data.localId,
      email: data.email,
      displayName: data.displayName || data.email.split("@")[0],
    };

    // Save to extension storage
    chrome.runtime.sendMessage({
      type: "SAVE_AUTH",
      user,
      token: data.idToken,
    }, () => {
      showLoggedIn(user);
    });
  } catch (err) {
    showError("Connection failed. Try again.");
  } finally {
    loginBtn.disabled = false;
    loginBtn.textContent = "Sign In";
  }
});

// Enter key to submit
passwordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") loginBtn.click();
});

// Settings toggles
toggleAutofill.addEventListener("change", () => {
  chrome.storage.local.set({ fz_autofill: String(toggleAutofill.checked) });
});

toggleConfirm.addEventListener("change", () => {
  chrome.storage.local.set({ fz_confirm: String(toggleConfirm.checked) });
});

// Dashboard
btnDashboard.addEventListener("click", () => {
  chrome.tabs.create({ url: DASHBOARD_URL });
});

// Logout
btnLogout.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "LOGOUT" }, () => {
    loggedinView.classList.add("hidden");
    loginView.classList.remove("hidden");
    emailInput.value = "";
    passwordInput.value = "";
  });
});

function showLoggedIn(user) {
  loginView.classList.add("hidden");
  loggedinView.classList.remove("hidden");
  userName.textContent = user.displayName || "User";
  userEmail.textContent = user.email || "";
  userAvatar.textContent = (user.displayName || user.email || "?")[0].toUpperCase();
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.style.display = "block";
}
