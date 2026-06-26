// Execute the tracking page initialization immediately
(async () => {
  // Retrieve the current authenticated session
  const {
    data: { session },
  } = await window.supabaseClient.auth.getSession();

  // Redirect unauthenticated users to the home page
  if (!session) {
    window.location.href = "/";

    return;
  }

  // Get references to the tracking form and input field
  const form = document.getElementById("trackingForm");

  const input = document.getElementById("trackingInput");

  // Handle shipment tracking form submission
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get and normalize the entered consignment ID
    const consignmentId = input.value.trim().toUpperCase();

    // Ensure a consignment ID has been entered
    if (!consignmentId) {
      alert("Please enter a consignment ID.");

      return;
    }

    // Redirect to the loading page with the requested consignment ID
    window.location.href = `/loading?consignmentId=${encodeURIComponent(consignmentId)}`;
  });
})();
