// Get the logout button
const logoutBtn = document.getElementById("logoutBtn");

// Register the logout handler if the button exists
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    // Sign the user out of their Supabase session
    const { error } = await supabaseClient.auth.signOut();

    // Clear the cached user profile from session storage
    sessionStorage.removeItem("userProfile");

    // Stop the logout process if an error occurs
    if (error) {
      console.error(error.message);
      return;
    }

    // Redirect the user to the login page after signing out
    window.location.href = "/login";
  });
}
