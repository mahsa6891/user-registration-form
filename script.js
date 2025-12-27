// Select elements
const form = document.getElementById("registrationForm");
const usernameInput = document.getElementById("username");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePasswordBtn = document.getElementById("togglePassword");
const submitBtn = document.getElementById("submitBtn");
const successMessage = document.getElementById("formSuccessMessage");

// Error messages
const usernameError = document.getElementById("usernameError");
const fullNameError = document.getElementById("fullNameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

// Password rules
const ruleLength = document.getElementById("ruleLength");
const ruleNumberOrSymbol = document.getElementById("ruleNumberOrSymbol");
const ruleNoName = document.getElementById("ruleNoName");
const ruleNoEmail = document.getElementById("ruleNoEmail");

// Helper functions
function setValid(groupElement) {
  groupElement.classList.remove("invalid");
  groupElement.classList.add("valid");
}

function setInvalid(groupElement) {
  groupElement.classList.remove("valid");
  groupElement.classList.add("invalid");
}

function clearState(groupElement) {
  groupElement.classList.remove("valid");
  groupElement.classList.remove("invalid");
}

// Username validation
function validateUsername() {
  const value = usernameInput.value.trim();
  const group = usernameInput.closest(".input-group");
  let message = "";

  const usernameRegex = /^[A-Za-z0-9]+$/;

  if (value.length === 0) {
    clearState(group);
    usernameError.textContent = "";
    return false;
  }

  if (value.length < 3 || value.length > 15) {
    message = "Username must be between 3 and 15 characters";
  } else if (!usernameRegex.test(value)) {
    message = "Username can only contain letters and numbers";
  }

  if (message) {
    setInvalid(group);
    usernameError.textContent = message;
    return false;
  } else {
    setValid(group);
    usernameError.textContent = "";
    return true;
  }
}

// Full name validation
function validateFullName() {
  const value = fullNameInput.value.trim();
  const group = fullNameInput.closest(".input-group");
  let message = "";

  const nameRegex = /^[A-Za-z\s]+$/;

  if (value.length === 0) {
    clearState(group);
    fullNameError.textContent = "";
    return false;
  }

  if (!nameRegex.test(value)) {
    message = "Full name must contain only letters and spaces";
  } else {
    const parts = value.split(" ").filter(Boolean);
    if (parts.length < 2) {
      message = "Please enter your full name";
    }
  }

  if (message) {
    setInvalid(group);
    fullNameError.textContent = message;
    return false;
  } else {
    setValid(group);
    fullNameError.textContent = "";
    return true;
  }
}

// Email validation
function validateEmail() {
  const value = emailInput.value.trim();
  const group = emailInput.closest(".input-group");
  let message = "";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value.length === 0) {
    clearState(group);
    emailError.textContent = "";
    return false;
  }

  if (!emailRegex.test(value)) {
    message = "Please enter a valid email address";
  }

  if (message) {
    setInvalid(group);
    emailError.textContent = message;
    return false;
  } else {
    setValid(group);
    emailError.textContent = "";
    return true;
  }
}

// Password validation
function validatePassword() {
  const value = passwordInput.value;
  const group = passwordInput.closest(".input-group");
  let message = "";

  const fullName = fullNameInput.value.trim().toLowerCase();
  const email = emailInput.value.trim().toLowerCase();

  const lengthOk = value.length >= 8;
  const hasNumber = /[0-9]/.test(value);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  const numberOrSymbolOk = hasNumber || hasSymbol;
const lowerPassword = value.toLowerCase();
  let nameIncluded = false;
  if (fullName) {
    const nameParts = fullName.split(" ").filter(Boolean);
    for (const part of nameParts) {
      if (part.length >= 2 && lowerPassword.includes(part)) {
        nameIncluded = true;
        break;
      }
    }
  }

  let emailIncluded = false;
  if (email) {
    const emailParts = email.split(/[@.]/).filter(Boolean);
    for (const part of emailParts) {
      if (part.length >= 2 && lowerPassword.includes(part)) {
        emailIncluded = true;
        break;
      }
    }
  }

  updateRuleState(ruleLength, lengthOk);
  updateRuleState(ruleNumberOrSymbol, numberOrSymbolOk);
  updateRuleState(ruleNoName, !nameIncluded);
  updateRuleState(ruleNoEmail, !emailIncluded);

  if (value.length === 0) {
    clearState(group);
    passwordError.textContent = "";
    return false;
  }

  if (!lengthOk) {
    message = "Password must be at least 8 characters long";
  } else if (!numberOrSymbolOk) {
    message = "Password must include at least one number or one symbol";
  } else if (nameIncluded) {
    message = "Password cannot contain your name";
  } else if (emailIncluded) {
    message = "Password cannot contain your email";
  }

  if (message) {
    setInvalid(group);
    passwordError.textContent = message;
    return false;
  } else {
    setValid(group);
    passwordError.textContent = "";
    return true;
  }
}

function updateRuleState(element, isValid) {
  if (isValid) {
    element.classList.add("valid");
  } else {
    element.classList.remove("valid");
  }
}

// Enable/disable submit button
function updateSubmitButtonState() {
  const isUsernameValid = validateUsername();
  const isFullNameValid = validateFullName();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();

  const allValid =
    isUsernameValid && isFullNameValid && isEmailValid && isPasswordValid;

  submitBtn.disabled = !allValid;
}

// Input listeners
usernameInput.addEventListener("input", () => {
  validateUsername();
  updateSubmitButtonState();
});

fullNameInput.addEventListener("input", () => {
  validateFullName();
  validatePassword();
  updateSubmitButtonState();
});

emailInput.addEventListener("input", () => {
  validateEmail();
  validatePassword();
  updateSubmitButtonState();
});

passwordInput.addEventListener("input", () => {
  validatePassword();
  updateSubmitButtonState();
});

// Toggle password visibility
togglePasswordBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";
  togglePasswordBtn.textContent = isPassword ? "Hide" : "Show";
});

// Form submit
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const isUsernameValid = validateUsername();
  const isFullNameValid = validateFullName();
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();

  if (!(isUsernameValid && isFullNameValid && isEmailValid && isPasswordValid)) {
    updateSubmitButtonState();
    return;
  }

  const formData = {
    username: usernameInput.value.trim(),
    fullName: fullNameInput.value.trim(),
    email: emailInput.value.trim(),
    password: "****",
  };

  console.log("Form submitted:", formData);

  successMessage.textContent = "Your account has been created successfully!";
  form.reset();
  clearState(usernameInput.closest(".input-group"));
  clearState(fullNameInput.closest(".input-group"));
  clearState(emailInput.closest(".input-group"));
  clearState(passwordInput.closest(".input-group"));

  [ruleLength, ruleNumberOrSymbol, ruleNoName, ruleNoEmail].forEach((el) =>
    el.classList.remove("valid")
  );

  usernameError.textContent = "";
  fullNameError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";

  submitBtn.disabled = true;

  setTimeout(() => {
    successMessage.textContent = "";
  }, 4000);
});