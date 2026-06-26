// Get references to the form and UI elements
const forgotPasswordForm = document.getElementById("forgotPasswordForm");

const resetBtn = document.getElementById("resetBtn");
const message = document.getElementById("message");

// Handle forgot password form submission
forgotPasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get the email entered by the user
  const email = document.getElementById("email").value.trim();

  // Hide any previous status message
  message.classList.add("hidden");

  // Re-enable the reset button after a delay
  setTimeout(() => {
    resetBtn.disabled = false;
    resetBtn.textContent = "Send Reset Link";
  }, 60000);

  // Request a password reset email from Supabase
  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: "https://movexalogistics.vercel.app/reset-password",
  });

  // Display an appropriate error message if the request fails
  if (error) {
    if (error.status === 429) {
      message.textContent =
        "Too many reset requests. Please wait a few minutes and try again.";
    } else {
      message.textContent = "Something went wrong. Please try again.";
    }

    message.className = "text-sm text-center text-red-500";

    message.classList.remove("hidden");

    resetBtn.disabled = false;
    resetBtn.textContent = "Send Reset Link";

    return;
  }

  // Notify the user that a reset email has been sent
  message.textContent =
    "If an account exists for this email, a reset link has been sent.";

  message.className = "text-sm text-center text-green-600";

  message.classList.remove("hidden");

  // Clear the form after a successful request
  forgotPasswordForm.reset();

  resetBtn.disabled = false;
  resetBtn.textContent = "Send Reset Link";
});
