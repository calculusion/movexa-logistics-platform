// Get references to the password reset form and UI elements
const resetPasswordForm = document.getElementById("resetPasswordForm");

const resetBtn = document.getElementById("resetBtn");
const message = document.getElementById("message");

// Handle password reset form submission
resetPasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Retrieve the new password and confirmation password
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Hide any previous status message
  message.classList.add("hidden");

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
    resetBtn.textContent = "Update Password";

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
