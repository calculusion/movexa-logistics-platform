// Store dashboard shipment data for searching and exporting
let dashboardShipments = [];

// Store the authenticated user's access token
let accessToken = "";

// Initialize the dashboard after the page has fully loaded
document.addEventListener("DOMContentLoaded", async () => {
  const {
    data: { session },
    // Retrieve the current authenticated session
  } = await supabaseClient.auth.getSession();

  // Redirect unauthenticated users to the login page
  if (!session) {
    window.location.href = "/login";
    return;
  }

  // Store the access token for authenticated API requests
  accessToken = session.access_token;

  // Load all dashboard data
  loadDashboardStats();
  loadRevenueStats("2026");
  loadShipmentAnalytics("2026");
  loadDashboardShipments();

  // Handle revenue year selection
  const yearBtn = document.getElementById("yearFilterBtn");

  const yearMenu = document.getElementById("yearFilterMenu");

  yearBtn.addEventListener("click", () => {
    yearMenu.classList.toggle("hidden");
  });

  const selectedYear = document.getElementById("selectedYear");

  document.querySelectorAll(".year-option").forEach((option) => {
    option.addEventListener("click", () => {
      const year = option.dataset.year;

      selectedYear.textContent = year;

      yearMenu.classList.add("hidden");

      loadRevenueStats(year);
    });
  });

  // Handle shipment analytics year selection
  const shipmentYearBtn = document.getElementById("shipmentYearBtn");

  const shipmentYearMenu = document.getElementById("shipmentYearMenu");

  const selectedShipmentYear = document.getElementById("selectedShipmentYear");

  shipmentYearBtn.addEventListener("click", () => {
    shipmentYearMenu.classList.toggle("hidden");
  });

  document.querySelectorAll(".shipment-year-option").forEach((option) => {
    option.addEventListener("click", () => {
      const year = option.dataset.year;

      selectedShipmentYear.textContent = year;

      shipmentYearMenu.classList.add("hidden");

      loadShipmentAnalytics(year);
    });
  });

  // Register search and export event listeners
  document
    .getElementById("searchInput")
    .addEventListener("input", searchDashboardShipments);

  document
    .getElementById("exportCsvBtn")
    .addEventListener("click", exportShipmentsCsv);
});

// Retrieve shipment statistics for the dashboard
async function loadDashboardStats() {
  try {
    const response = await fetch("/api/dashboard-stats", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error(errorText);

      throw new Error(errorText);
    }

    const data = await response.json();

    // Update the dashboard summary cards
    document.getElementById("dashboardTotalShipments").textContent =
      data.totalShipments;

    document.getElementById("dashboardDeliveredCount").textContent =
      data.delivered;

    document.getElementById("dashboardOnRouteCount").textContent = data.onRoute;

    document.getElementById("dashboardPendingCount").textContent = data.pending;
  } catch (error) {
    // Log any errors that occur while loading dashboard statistics
    console.error("Failed to load dashboard stats:", error);
  }
}

// Retrieve yearly revenue statistics
async function loadRevenueStats(year) {
  try {
    const response = await fetch(`/api/revenue-stats?year=${year}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.message);
    }

    const data = await response.json();

    document.getElementById("totalRevenue").textContent = new Intl.NumberFormat(
      "en-US",
      {
        style: "currency",
        currency: "EUR",
      },
    ).format(data.totalRevenue);

    const container = document.getElementById("monthlyRevenueContainer");

    container.innerHTML = "";

    // Display a placeholder if no revenue exists for the selected year
    if (data.monthlyRevenue.length === 0) {
      document.getElementById("totalRevenue").textContent = "€0.00";

      container.innerHTML = `
                <div class="text-center py-8 text-sm text-gray-400">
                    No revenue data for ${year}
                </div>
            `;

      return;
    }

    // Determine the highest revenue value for percentage calculations
    const maxRevenue = Math.max(
      ...data.monthlyRevenue.map((item) => item.revenue),
      1,
    );

    // Log any errors that occur while loading revenue data
    data.monthlyRevenue.forEach((item, index) => {
      const percentage = (item.revenue / maxRevenue) * 100;

      const isCurrentMonth = index === data.monthlyRevenue.length - 1;

      container.innerHTML += `
                    <div class="flex items-center text-xs">

                        <span class="w-8 font-semibold text-gray-800">

                            ${item.month}

                        </span>

                        <div class="flex-1 bg-gray-100 rounded-full h-[18px] mx-3 relative overflow-hidden">

                            <div
                                class="absolute top-0 left-0 bottom-0 rounded-full flex items-center px-3 text-[10px] font-medium text-white"
                                style="
                                    width: ${percentage}%;
                                    background-color: ${
                                      isCurrentMonth ? "#F93C3F" : "#CDD5DF"
                                    };
                                ">

                                €${item.revenue.toLocaleString("en-US")}

                            </div>

                        </div>

                        <span class="text-gray-400 w-12 text-right font-medium text-[11px]">

                            ${percentage.toFixed(2)}%

                        </span>

                    </div>
                `;
    });
  } catch (error) {
    console.error("Failed to load revenue:", error);
  }
}

// Retrieve monthly shipment analytics
async function loadShipmentAnalytics(year) {
  try {
    const response = await fetch(`/api/shipment-analytics?year=${year}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    const barsContainer = document.getElementById("shipmentBars");

    barsContainer.innerHTML = "";

    const maxValue = 100;

    // Render the shipment analytics chart
    data.forEach((item) => {
      const height = (item.shipments / maxValue) * 100;

      barsContainer.innerHTML += `
                <div
                    class="w-6 md:w-8 rounded-t-sm bg-[#CDD5DF] hover:bg-[#ff4444] transition-all duration-300"
                    style="height: ${height}%"
                    title="${item.shipments} shipments">
                </div>
            `;
    });
  } catch (error) {
    // Log any errors while loading shipment analytics
    console.error(error);
  }
}

// Return the appropriate CSS class for each shipment status
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

// Retrieve all shipments for the dashboard table
async function loadDashboardShipments() {
  try {
    const response = await fetch("/api/get-shipment", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load shipments");
    }

    // Store the shipment data for searching and exporting
    dashboardShipments = data;

    renderDashboardShipments(dashboardShipments);
  } catch (error) {
    console.error("Failed to load dashboard shipments:", error);
  }
}

// Render the shipment table
function renderDashboardShipments(shipments) {
  const tableBody = document.getElementById("dashboardShipmentsTableBody");

  tableBody.innerHTML = "";

  // Display the first 10 shipments
  shipments.slice(0, 10).forEach((shipment) => {
    const row = document.createElement("tr");

    row.className = "hover:bg-gray-50";

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

                <td class="px-6 py-4 ${getStatusClass(
                  shipment.current_status,
                )}">
                    ${shipment.current_status}
                </td>
            `;

    tableBody.appendChild(row);
  });
}

// Filter shipments by consignment ID
function searchDashboardShipments() {
  const searchValue = document
    .getElementById("searchInput")
    .value.trim()
    .toLowerCase();

  const filtered = dashboardShipments.filter((shipment) =>
    shipment.consignment_id.toLowerCase().includes(searchValue),
  );

  renderDashboardShipments(filtered);
}

// Export dashboard shipment data as a CSV file
function exportShipmentsCsv() {
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

  const rows = dashboardShipments.map((shipment) => [
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

  // Generate CSV content
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

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");

  const today = new Date().toISOString().split("T")[0];

  link.href = url;

  link.download = `shipmentsbymovexa-${today}.csv`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
}
