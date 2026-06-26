// Get the Google Sign-In button
const googleLoginBtn = document.getElementById("googleLoginBtn");

// Register the Google authentication handler if the button exists
if (googleLoginBtn) {
  googleLoginBtn.addEventListener("click", async () => {
    // Start the Google OAuth sign-in flow
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Redirect the user after successful authentication
        redirectTo: `${window.location.origin}/redirect`,
      },
    });

    // Display an error message if authentication fails
    if (error) {
      alert(error.message);
    }
  });
}
