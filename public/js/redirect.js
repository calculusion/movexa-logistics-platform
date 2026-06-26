// Update the redirect status message with a fade animation
function updateStatus(message) {
  const status = document.getElementById("redirectStatus");

  if (!status) return;

  status.classList.add("opacity-0", "translate-y-1");

  setTimeout(() => {
    status.textContent = message;

    status.classList.remove("opacity-0", "translate-y-1");
  }, 400);
}

// Initialize the redirect process after the page has loaded
document.addEventListener("DOMContentLoaded", async () => {
  // Delay before navigating to the destination dashboard
  const REDIRECT_DELAY = 2000;

  const status = document.getElementById("redirectStatus");

  // Retrieve the current authenticated session
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  // Redirect unauthenticated users to the login page
  if (!session) {
    window.location.href = "/login";
    return;
  }

  // Notify the user that authentication is being verified
  updateStatus("Verifying your account...");

  // Retrieve the user's profile information from the backend
  const response = await fetch("/api/profile", {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  // Prepare the profile information to cache locally
  const profile = await response.json();

  const user = session.user;

  const cachedProfile = {
    name:
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "User",

    email: user.email,

    avatar:
      user.user_metadata?.avatar_url || user.user_metadata?.picture || null,

    role: profile.role,
  };

  // Cache the user's profile to improve loading performance
  sessionStorage.setItem("userProfile", JSON.stringify(cachedProfile));

  // Notify the user that the dashboard is being prepared
  updateStatus("Preparing your dashboard...");

  // Redirect the user based on their assigned role
  setTimeout(() => {
    if (profile.role === "operator") {
      window.location.href = "/operator";
    } else {
      window.location.href = "/dashboard";
    }
  }, REDIRECT_DELAY);
});
