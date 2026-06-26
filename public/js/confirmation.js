// Wait until the page has fully loaded before retrieving shipment details
document.addEventListener("DOMContentLoaded", async () => {
  // Read the consignment ID from the page URL
  const params = new URLSearchParams(window.location.search);

  const consignmentId = params.get("consignment");

  // Get the element used to display the consignment ID
  const idElement = document.getElementById("consignmentID");

  // Display an error if no consignment ID was provided
  if (!consignmentId) {
    idElement.textContent = "No Consignment ID Found";

    return;
  }

  try {
    // Retrieve the current authenticated session
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    // Request the shipment confirmation details from the backend API
    const response = await fetch(
      `/api/get-confirmation?consignment=${consignmentId}`,
      {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      idElement.textContent = "Shipment not found";

      return;
    }

    // Display the confirmed consignment ID
    idElement.textContent = data.consignment_id;
  } catch (error) {
    // Log the error and display a fallback message
    console.error(error);

    idElement.textContent = "Unable to load shipment";
  }

  // Get the button used to copy the consignment ID
  const sendButton = document.querySelector(".bg-\\[\\#22c55e\\]");

  if (sendButton) {
    // Copy the consignment ID to the clipboard when the button is clicked
    sendButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(idElement.textContent);

        alert(
          `Consignment ID copied successfully!\n\n${idElement.textContent}`,
        );
      } catch {
        // Display the consignment ID if clipboard access is unavailable
        alert(`Consignment ID: ${idElement.textContent}`);
      }
    });
  }
});
