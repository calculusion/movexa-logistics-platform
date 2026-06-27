// Get references to the password reset form and UI elements
const resetPasswordForm = document.getElementById("resetPasswordForm");
const resetBtn = document.getElementById("resetBtn");
const message = document.getElementById("message");
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

// Handle password reset form submission
resetPasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Retrieve the new password and confirmation password
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  if (!isPasswordValid(password)) {
    passwordRequirements.classList.remove("hidden");

    return;
  }

  // Hide any previous status message
  message.classList.add("hidden");
  passwordRequirements.classList.add("hidden");

  // Ensure both password fields match
  if (password !== confirmPassword) {
    message.textContent = "Passwords do not match.";

    message.className = "text-sm text-center text-red-500";

    message.classList.remove("hidden");

    return;
  }

  // Prevent multiple submissions while the password is being updated
  resetBtn.disabled = true;
  resetBtn.textContent = "Updating...";

  // Update the user's password through Supabase Authentication
  const { error } = await supabaseClient.auth.updateUser({
    password,
  });

  // Display an error message if the update fails
  if (error) {
    message.textContent = error.message;

    message.className = "text-sm text-center text-red-500";

    message.classList.remove("hidden");

    resetBtn.disabled = false;
    resetBtn.textContent = "Reset Password";

    return;
  }

  // Notify the user that the password was updated successfully
  message.textContent =
    "Password updated successfully. Redirecting to sign in...";

  message.className = "text-sm text-center text-green-600";

  message.classList.remove("hidden");

  setTimeout(() => {
    window.location.href = "/login";
  }, 2000);
});
