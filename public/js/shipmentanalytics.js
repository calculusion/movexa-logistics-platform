// Store all shipments retrieved from the server
let allShipments = [];

// Store the current search and filter options
let filters = {
  search: "",
  status: [],
};

// Initialize the shipment table after the page has loaded
document.addEventListener("DOMContentLoaded", () => {
  // Load shipment data and register event listeners
  loadShipments();

  document
    .getElementById("searchInput")
    .addEventListener("input", filterShipments);

  document
    .getElementById("exportCsvBtn")
    .addEventListener("click", exportShipmentsCsv);
});

// Retrieve shipment data for the authenticated user
async function loadShipments() {
  try {
    // Retrieve the current authenticated session
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    // Request the shipment list from the backend API
    const response = await fetch("/api/get-shipment", {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    // Store the retrieved shipment data
    allShipments = await response.json();

    if (!response.ok) {
      throw new Error("Failed to load shipments");
    }

    const shipments = allShipments;

    // Update the dashboard summary and shipment table
    updateStatusCounts(shipments);
    renderShipments(shipments);
  } catch (error) {
    // Log any errors while loading shipment data
    console.error(error);
  }
}

// Render the shipment table
function renderShipments(shipments) {
  const tableBody = document.getElementById("shipmentsTableBody");

  tableBody.innerHTML = "";

  // Create a table row for each shipment
  shipments.forEach((shipment) => {
    const row = document.createElement("tr");

    row.className = "cursor-pointer hover:bg-gray-50 transition-colors";

    row.innerHTML = `
            <td class="px-6 py-4">
                ${shipment.consignment_id}
            </td>

            <td class="px-6 py-4">
                ${shipment.item_name}
            </td>

            <td class="px-6 py-4">
                ${shipment.service_name}
            </td>

            <td class="px-6 py-4">
                ${new Date(shipment.created_at).toLocaleDateString()}
            </td>

            <td class="px-6 py-4">
                ${shipment.departure}
            </td>

            <td class="px-6 py-4">
                ${shipment.destination}
            </td>

            <td class="px-6 py-4">
                ${shipment.weight || "-"} kg
            </td>

            <td class="px-6 py-4 ${getStatusClass(shipment.current_status)}">
                ${shipment.current_status}
            </td>
        `;

    // Open the shipment details page when a row is clicked
    row.addEventListener("click", () => {
      window.location.href = `/loading?consignmentId=${encodeURIComponent(
        shipment.consignment_id,
      )}`;
    });

    tableBody.appendChild(row);
  });
}

// Return the CSS class for each shipment status
function getStatusClass(status) {
  switch (status) {
    case "Delivered":
      return "text-[#32B66B] font-medium";

    case "On Route":
      return "text-[#FFB22C] font-medium";

    case "Pending":
      return "text-[#F93C3F] font-medium";

    case "Accepted":
      return "text-[#4690FF] font-medium";

    case "Delayed":
      return "text-[#F93C3F] font-medium";

    default:
      return "text-gray-500 font-medium";
  }
}

// Update the shipment status counters
function updateStatusCounts(shipments) {
  const delivered = shipments.filter(
    (shipment) => shipment.current_status === "Delivered",
  ).length;

  const pending = shipments.filter(
    (shipment) => shipment.current_status === "Pending",
  ).length;

  const onRoute = shipments.filter(
    (shipment) => shipment.current_status === "On Route",
  ).length;

  document.getElementById("tableDeliveredCount").textContent = `(${delivered})`;

  document.getElementById("tablePendingCount").textContent = `(${pending})`;

  document.getElementById("tableOnRouteCount").textContent = `(${onRoute})`;
}

// Filter shipments based on the search input and selected status
function filterShipments() {
  filters.search = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();

  // Apply the active search and status filters
  const filteredShipments = allShipments.filter((shipment) => {
    const matchesSearch = shipment.consignment_id
      .toLowerCase()
      .includes(filters.search);

    const matchesStatus =
      filters.status.length === 0 ||
      filters.status.includes(shipment.current_status);

    return matchesSearch && matchesStatus;
  });
  renderShipments(filteredShipments);
}

// Export all shipment records as a CSV file
function exportShipmentsCsv() {
  // Define the CSV column headers
  const headers = [
    "Consignment ID",
    "Sender Name",
    "Receiver Name",
    "Category",
    "Delivery Type",
    "Shipper Date",
    "Departure",
    "Destination",
    "Weight",
    "Status",
  ];

  // Convert shipment data into CSV rows
  const rows = allShipments.map((shipment) => [
    shipment.consignment_id,

    shipment.sender_name,

    shipment.receiver_name,

    shipment.item_name,

    shipment.service_name,

    new Date(shipment.created_at).toLocaleDateString(),

    shipment.departure,

    shipment.destination,

    shipment.weight,

    shipment.current_status,
  ]);

  // Generate the CSV content
  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");

  // Create and download the CSV file
  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;

  link.download = `shipmentsbymovexa-${
    new Date().toISOString().split("T")[0]
  }.csv`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
