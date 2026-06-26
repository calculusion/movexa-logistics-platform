// Wait until the page has fully loaded before checking authentication
document.addEventListener("DOMContentLoaded", async () => {
  // Get the protected content container
  const protectedContent = document.getElementById("protectedContent");

  // Retrieve the current user session from Supabase
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  // Redirect unauthenticated users to the login page
  if (!session) {
    window.location.href = "/login";
    return;
  }

  // Display the protected content after successful authentication
  if (protectedContent) {
    protectedContent.style.opacity = "1";
  }
});
