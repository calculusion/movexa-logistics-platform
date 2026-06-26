// Reveal the page content with a smooth animation after all resources have loaded
window.addEventListener("load", () => {
  const pageContent = document.getElementById("pageContent");

  if (pageContent) {
    requestAnimationFrame(() => {
      pageContent.classList.remove("opacity-0", "translate-y-2");
    });
  }
});

// Display the page transition overlay with a custom loading message
function showTransition(message = "Loading...") {
  const overlay = document.getElementById("pageTransition");

  if (!overlay) return;

  const text = overlay.querySelector("#pageTransitionText");

  if (text) {
    text.textContent = message;
  }

  overlay.classList.remove("opacity-0", "pointer-events-none");
}

// Hide the page transition overlay
function hideTransition() {
  const overlay = document.getElementById("pageTransition");

  if (!overlay) return;

  overlay.classList.add("opacity-0", "pointer-events-none");
}

// Display the transition animation before navigating to another page
function navigateWithTransition(url, message = "Loading...") {
  showTransition(message);

  setTimeout(() => {
    window.location.href = url;
  }, 250);
}
