// Get references to the login form and UI elements
const loginForm = document.getElementById("loginForm");
const loginBtn = document.getElementById("loginBtn");
const message = document.getElementById("message");

// Handle user login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Retrieve the user's login credentials
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // Hide any previous status message
  message.classList.add("hidden");

  // Prevent multiple login attempts while the request is in progress
  loginBtn.disabled = true;
  loginBtn.textContent = "Signing in...";

  // Authenticate the user with Supabase
  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  // Display an appropriate error message if authentication fails
  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      message.textContent = "Please verify your email before signing in.";
    } else {
      message.textContent = "Invalid email or password.";
    }

    message.className = "text-sm text-center text-red-500";
    message.classList.remove("hidden");

    loginBtn.disabled = false;
    loginBtn.textContent = "Sign in";

    return;
  }

  // Redirect the user after successful authentication
  setTimeout(() => {
    window.location.href = "/redirect";
  }, 500);
});
