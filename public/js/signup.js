// Get references to the sign-up form and UI elements
const signupForm = document.getElementById("signupForm");
const message = document.getElementById("message");
const signupBtn = document.getElementById("signupBtn");
const passwordRequirements = document.getElementById("passwordRequirements");
const passwordInput = document.getElementById("password");

function isPasswordValid(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password)
  );
}

passwordInput.addEventListener("input", () => {
  if (passwordInput.value.length === 0) {
    passwordRequirements.classList.add("hidden");
    return;
  }

  if (isPasswordValid(passwordInput.value)) {
    passwordRequirements.classList.add("hidden");
  } else {
    passwordRequirements.classList.remove("hidden");
  }
});

// Handle user registration
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Retrieve the user's registration details
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!isPasswordValid(password)) {
    passwordRequirements.classList.remove("hidden");

    return;
  }

  // Hide any previous messages
  message.classList.add("hidden");
  passwordRequirements.classList.add("hidden");

  // Prevent multiple submissions while the request is in progress
  signupBtn.disabled = true;
  signupBtn.textContent = "Creating account...";

  // Create a new account using Supabase Authentication
  const { error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      // Redirect the user to the login page after email verification
      emailRedirectTo: "https://movexalogistics.vercel.app/login",
    },
  });

  // Display validation or registration errors
  if (error) {
    message.textContent = error.message;

    message.className = "text-sm text-center text-red-500";

    message.classList.remove("hidden");

    signupBtn.disabled = false;
    signupBtn.textContent = "Sign up";

    return;
  }

  // Notify the user that the account has been created successfully
  message.textContent =
    "Please check your email to complete your registration.";

  message.className = "text-sm text-center text-green-600";
  message.classList.remove("hidden");

  signupForm.reset();

  signupBtn.disabled = false;
  signupBtn.textContent = "Sign up";
});
