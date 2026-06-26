// Start the confirmation redirect process after the page has fully loaded
window.addEventListener("load", () => {
  // Apply the page loaded animation
  document.body.classList.add("loaded");

  // Read the consignment ID from the URL
  const params = new URLSearchParams(window.location.search);

  const consignmentId = params.get("consignment");

  // Redirect to the shipping page if no consignment ID is provided
  if (!consignmentId) {
    window.location.href = "/shippingpage";

    return;
  }

  // Redirect to the confirmation page after displaying the loading animation
  setTimeout(() => {
    window.location.href = `/confirmation?consignment=${encodeURIComponent(consignmentId)}`;
  }, 2000);
});
