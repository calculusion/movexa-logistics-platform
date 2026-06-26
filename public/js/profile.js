// Initialize the sidebar profile after the page has loaded
document.addEventListener("DOMContentLoaded", async () => {
  const avatar = document.getElementById("sidebarAvatar");
  const welcomeMessage = document.getElementById("welcomeMessage");
  const timeGreeting = document.getElementById("timeGreeting");
  const sidebarFirstName = document.getElementById("sidebarFirstName");

  // Attempt to load the cached user profile from session storage
  const cachedProfile = JSON.parse(sessionStorage.getItem("userProfile"));

  if (cachedProfile) {
    // Display the cached profile information
    if (welcomeMessage) {
      welcomeMessage.textContent = `Hello ${cachedProfile.name},`;
    }

    if (sidebarFirstName) {
      sidebarFirstName.textContent = cachedProfile.name;
    }

    if (avatar && cachedProfile.avatar) {
      avatar.src = cachedProfile.avatar;
    }
  } else {
    const {
      // Retrieve the current authenticated session
      data: { session },
    } = await supabaseClient.auth.getSession();

    if (!session) return;

    // Request the user's profile from the backend
    const profileResponse = await fetch("/api/profile", {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    const profile = await profileResponse.json();

    const user = session.user;

    // Determine the display name from the available user metadata
    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "User";

    const firstName = fullName.trim().split(" ")[0];

    // Shorten long names to improve the sidebar layout
    const displayName =
      firstName.length > 8 ? `${firstName.slice(0, 8)}...` : firstName;

    // Update the welcome message
    if (welcomeMessage) {
      welcomeMessage.textContent = `Hello ${firstName},`;
    }

    // Update the sidebar display name
    if (sidebarFirstName) {
      sidebarFirstName.textContent = displayName;
    }

    // Display the user's profile picture if available
    const googleAvatar =
      user.user_metadata?.avatar_url || user.user_metadata?.picture;

    if (avatar && googleAvatar) {
      avatar.src = googleAvatar;
    }

    // Cache the profile data to avoid unnecessary API requests
    sessionStorage.setItem(
      "userProfile",
      JSON.stringify({
        name: firstName,
        avatar: googleAvatar || null,
      }),
    );
  }

  // Generate a greeting based on the current time
  const hour = new Date().getHours();

  let greeting = "Good Morning!";

  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning!";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon!";
  } else if (hour >= 17 && hour < 21) {
    greeting = "Good Evening!";
  } else {
    greeting = "Good Night!";
  }

  // Display the greeting in the sidebar
  if (timeGreeting) {
    timeGreeting.textContent = greeting;
  }
});
