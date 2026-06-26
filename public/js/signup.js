// Get references to the sign-up form and UI elements
const signupForm = document.getElementById("signupForm");
const message = document.getElementById("message");
const signupBtn = document.getElementById("signupBtn");
const passwordRequirements = document.getElementById("passwordRequirements");

// Handle user registration
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Retrieve the user's registration details
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

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
    if (
      error.message.includes("Password should contain at least one character")
    ) {
      passwordRequirements.classList.remove("hidden");
    } else {
      message.textContent = error.message;
      message.className = "text-sm text-center text-red-500";
      message.classList.remove("hidden");
    }

    signupBtn.disabled = false;
    signupBtn.textContent = "Sign up";

    return;
  }

  // Notify the user that the account has been created successfully
  message.textContent =
    "Account created. Check your email to verify your account.";

  message.className = "text-sm text-center text-green-600";
  message.classList.remove("hidden");
  
  signupForm.reset();

  signupBtn.disabled = false;
  signupBtn.textContent = "Sign up";
});
