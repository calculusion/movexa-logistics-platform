// Execute the shipment loading process immediately when the page loads
(async () => {
  // Read the consignment ID from the URL
  const params = new URLSearchParams(window.location.search);

  const consignmentId = params.get("consignmentId");

  // Redirect to the tracking page if no consignment ID is provided
  if (!consignmentId) {
    window.location.href = "/tracking";

    return;
  }

  // Get the status message element
  const status = document.getElementById("redirectStatus");

  // Retrieve the current authenticated session
  const {
    data: { session },
  } = await window.supabaseClient.auth.getSession();

  // Redirect unauthenticated users to the home page
  if (!session) {
    window.location.href = "/";

    return;
  }

  try {
    // Inform the user that shipment information is being loaded
    status.textContent = "Fetching information...";

    // Request shipment details from the backend API
    const response = await fetch(
      `/api/get-shipment-details?consignmentId=${encodeURIComponent(consignmentId)}`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      },
    );

    const shipment = await response.json();

    // Redirect to the "No Shipment" page if the shipment is not found
    if (!response.ok) {
      sessionStorage.removeItem("currentShipment");

      status.textContent = "still searching..";

      setTimeout(() => {
        window.location.replace("/no-shipment");
      }, 2000);

      return;
    }

    // Cache the shipment data for use on the details page
    sessionStorage.setItem("currentShipment", JSON.stringify(shipment));

    // Notify the user before opening the shipment details page
    status.textContent = "Opening consignment...";

    setTimeout(() => {
      window.location.replace(
        `/shipment-detail?consignmentId=${encodeURIComponent(consignmentId)}`,
      );
    }, 2500);
  } catch (error) {
    // Log the error and redirect to the fallback page
    console.error(error);

    status.textContent = "Something went wrong.";

    setTimeout(() => {
      window.location.replace("/no-shipment");
    }, 2000);
  }
})();
