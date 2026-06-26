// Initialize the operator dashboard after the page has loaded
document.addEventListener("DOMContentLoaded", async () => {
  // Store the currently selected shipment
  let selectedShipmentId = null;

  // Get references to the shipment action buttons
  const acceptJobBtn = document.getElementById("acceptJobBtn");
  const startDeliveryBtn = document.getElementById("startDeliveryBtn");
  const markDeliveredBtn = document.getElementById("markDeliveredBtn");

  // Retrieve the current authenticated session
  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  // Redirect unauthenticated users to the login page
  if (!session) {
    window.location.href = "/login";
    return;
  }

  // Display the operator dashboard
  document.getElementById("operatorContent").classList.remove("hidden");

  // Retrieve the authenticated user's profile
  const profileResponse = await fetch("/api/profile", {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  const profile = await profileResponse.json();

  // Restrict access to operator accounts only
  if (profile.role !== "operator") {
    window.location.href = "/dashboard";
    return;
  }

  // Retrieve all pending shipments
  const response = await fetch("/api/pending-shipments", {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  const shipments = await response.json();

  const shipmentList = document.getElementById("shipmentList");

  const shipmentSearch = document.getElementById("shipmentSearch");

  const filterBtn = document.getElementById("filterBtn");

  const filterMenu = document.getElementById("filterMenu");

  const filterOptions = document.querySelectorAll(".filter-option");

  shipmentList.innerHTML = "";

  // Render a shipment card for each shipment
  shipments.forEach((shipment) => {
    shipmentList.innerHTML += `
              <div
                class="shipment-card bg-[#181818] rounded-xl p-4 relative overflow-hidden border border-[#2a2a2a] transition-all duration-200 cursor-pointer"
                data-shipment-id="${shipment.shipment_id}"
                data-consignment-id="${shipment.consignment_id}"
                data-status="${shipment.current_status}"
              >
          
                <div class="absolute left-0 top-0 bottom-0 w-[3px] ${
                  shipment.current_status === "Delayed"
                    ? "bg-red-500"
                    : shipment.current_status === "Delivered"
                      ? "bg-green-500"
                      : shipment.current_status === "On Route"
                        ? "bg-blue-500"
                        : shipment.current_status === "Accepted"
                          ? "bg-cyan-500"
                          : "bg-yellow-500"
                }"></div>
          
                <div class="flex justify-between items-start mb-2.5">
          
                  <span class="text-[10px] font-semibold text-gray-400 bg-[#3a3a3a] px-2 py-0.5 rounded uppercase tracking-wider">
                    ${shipment.consignment_id}
                  </span>
          
                  <button
                    class="report-delay-btn text-[10px] font-medium bg-[#F93C3F] text-white px-2.5 py-1 rounded-full shadow-sm">
                    Report Delay
                  </button>
          
                </div>
          
                <h3 class="text-[15px] font-semibold text-white mb-4">
                  ${shipment.sender_name}
                </h3>
          
                <div class="relative pl-8 mb-4 space-y-4">
          
                  <div class="relative">
          
                    <div class="absolute -left-[33px] top-[0px]">
                      <img
                        src="maincontenticons/source.svg"
                        alt="source"
                        class="w-6 h-6"
                      />
                    </div>
          
                    <div class="text-[13px] font-medium text-gray-200 leading-tight">
                        ${shipment.sender_city}, ${shipment.sender_country}
                    </div>
          
                    <div class="text-[12px] font-semibold text-gray-500 mt-0.5">
                      Postal Code: ${shipment.sender_pincode || "-"}
                    </div>
          
                  </div>
          
                  <div class="relative">
          
                    <div class="absolute -left-[33px] top-[0px]">
                      <img
                        src="maincontenticons/destination.svg"
                        alt="destination"
                        class="w-6 h-6"
                      />
                    </div>
          
                    <div class="text-[13px] font-medium text-gray-200 leading-tight">
                        ${shipment.receiver_city}, ${shipment.receiver_country}
                    </div>
          
                    <div class="text-[12px] font-semibold text-gray-500 mt-0.5">
                      Postal Code: ${shipment.receiver_pincode || "-"}
                    </div>
          
                  </div>
          
                </div>
          
                <div class="flex items-center gap-1.5 text-[11px] text-gray-400">
          
                  <span>--</span>
          
                  <span class="w-[3px] h-[3px] bg-gray-600 rounded-full"></span>
          
                  <span>-- km</span>
          
                  <span class="w-[3px] h-[3px] bg-gray-600 rounded-full"></span>
          
                  <span class="${
                    shipment.current_status === "Delayed"
                      ? "text-red-500"
                      : shipment.current_status === "Delivered"
                        ? "text-green-500"
                        : shipment.current_status === "On Route"
                          ? "text-blue-500"
                          : shipment.current_status === "Accepted"
                            ? "text-cyan-500"
                            : "text-yellow-500"
                  } font-semibold">
                    ${shipment.current_status}
                  </span>
          
                </div>
          
                <div class="absolute right-4 bottom-4 flex flex-col gap-2">
          
                  <button>
                    <img
                      src="maincontenticons/call.svg"
                      class="w-8 h-8"
                      alt="Call"
                    >
                  </button>
          
                  <button>
                    <img
                      src="maincontenticons/message.svg"
                      class="w-8 h-8"
                      alt="Message"
                    >
                  </button>
          
                </div>
          
              </div>
            `;
  });
  document.querySelectorAll(".shipment-card").forEach((card) => {
    // Display the selected shipment details
    card.addEventListener("click", async () => {
      document.querySelectorAll(".shipment-card").forEach((c) => {
        c.className =
          "shipment-card bg-[#181818] rounded-xl p-4 relative overflow-hidden border border-[#2a2a2a] transition-all duration-200 cursor-pointer";
      });

      card.className =
        "shipment-card bg-[#2a2a2a] rounded-xl p-4 relative overflow-hidden border border-[#3a3a3a] shadow-sm transition-all duration-200 cursor-pointer";

      const shipmentId = card.dataset.shipmentId;

      selectedShipmentId = shipmentId;

      // Retrieve detailed shipment information
      const response = await fetch(`/api/shipment-details?id=${shipmentId}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const shipment = await response.json();

      document.getElementById("emptyState").classList.add("hidden");

      document.getElementById("shipmentDetails").classList.remove("hidden");

      acceptJobBtn.classList.add("hidden");
      startDeliveryBtn.classList.add("hidden");
      markDeliveredBtn.classList.add("hidden");

      markDeliveredBtn.textContent = "Mark Delivered";

      // Show the appropriate action button based on shipment status
      if (shipment.current_status === "Pending") {
        acceptJobBtn.classList.remove("hidden");
      } else if (shipment.current_status === "Accepted") {
        startDeliveryBtn.classList.remove("hidden");
      } else if (
        shipment.current_status === "On Route" ||
        shipment.current_status === "Delayed"
      ) {
        markDeliveredBtn.classList.remove("hidden");

        markDeliveredBtn.textContent =
          shipment.current_status === "Delayed"
            ? "Resume Delivery"
            : "Mark Delivered";
      }

      // Populate the shipment details panel
      document.getElementById("consignmentId").textContent =
        shipment.consignment_id;

      document.getElementById("senderName").textContent = shipment.sender_name;
      document.getElementById("senderPhone").textContent =
        shipment.sender_phone;
      document.getElementById("senderCountry").textContent =
        shipment.sender_country;
      document.getElementById("senderCity").textContent = shipment.sender_city;
      document.getElementById("senderPincode").textContent =
        shipment.sender_pincode;
      document.getElementById("senderAddress").textContent =
        shipment.sender_address;
      document.getElementById("senderLandmark").textContent =
        shipment.sender_landmark;

      document.getElementById("receiverName").textContent =
        shipment.receiver_name;
      document.getElementById("receiverPhone").textContent =
        shipment.receiver_phone;
      document.getElementById("receiverCountry").textContent =
        shipment.receiver_country;
      document.getElementById("receiverCity").textContent =
        shipment.receiver_city;
      document.getElementById("receiverPincode").textContent =
        shipment.receiver_pincode;
      document.getElementById("receiverAddress").textContent =
        shipment.receiver_address;
      document.getElementById("receiverLandmark").textContent =
        shipment.receiver_landmark;

      document.getElementById("shipmentWeight").textContent = shipment.weight;
      document.getElementById("shipmentLength").textContent = shipment.length;
      document.getElementById("shipmentWidth").textContent = shipment.width;
      document.getElementById("shipmentHeight").textContent = shipment.height;
      document.getElementById("shipmentItemType").textContent =
        shipment.item_name;
      document.getElementById("shipmentQuantity").textContent =
        shipment.quantity;

      document.getElementById("serviceType").textContent =
        shipment.service_name;
      document.getElementById("additionalService").textContent =
        shipment.additional_service_name || "None";
      document.getElementById("totalAmount").textContent =
        `€ ${shipment.total_amount}`;
      document.getElementById("description").textContent =
        shipment.description || "-";
      document.getElementById("specialInstruction").textContent =
        shipment.special_instructions || "-";
    });

    const delayBtn = card.querySelector(".report-delay-btn");

    // Mark the shipment as delayed
    delayBtn.addEventListener("click", async (event) => {
      event.stopPropagation();

      const shipmentId = card.dataset.shipmentId;

      const response = await fetch("/api/update-shipment-status", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },

        body: JSON.stringify({
          shipmentId,
          status: "Delayed",
        }),
      });

      const result = await response.json();

      if (result.success) {
        sessionStorage.setItem("selectedShipmentId", selectedShipmentId);

        location.reload();
      }
    });
  });

  // Restore the previously selected shipment after page reload
  const savedShipmentId = sessionStorage.getItem("selectedShipmentId");

  if (savedShipmentId) {
    const savedCard = document.querySelector(
      `[data-shipment-id="${savedShipmentId}"]`,
    );

    if (savedCard) {
      savedCard.click();
    }

    sessionStorage.removeItem("selectedShipmentId");
  }

  // Filter shipment cards by consignment ID
  shipmentSearch.addEventListener("input", () => {
    const searchValue = shipmentSearch.value.trim().toLowerCase();

    document.querySelectorAll(".shipment-card").forEach((card) => {
      const consignmentId = card.dataset.consignmentId.toLowerCase();

      card.style.display = consignmentId.includes(searchValue) ? "" : "none";
    });
  });

  // Toggle the shipment status filter menu
  filterBtn.addEventListener("click", () => {
    filterMenu.classList.toggle("hidden");
  });

  // Filter shipments by their current status
  filterOptions.forEach((option) => {
    option.addEventListener("click", () => {
      const selectedStatus = option.dataset.status;

      document.querySelectorAll(".shipment-card").forEach((card) => {
        const cardStatus = card.dataset.status;

        if (selectedStatus === "all" || cardStatus === selectedStatus) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });

      filterMenu.classList.add("hidden");
    });
  });

  document
    .getElementById("acceptJobBtn")
    // Update the shipment status to Accepted
    .addEventListener("click", async () => {
      if (!selectedShipmentId) {
        alert("Select a shipment first");
        return;
      }

      const response = await fetch("/api/update-shipment-status", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },

        body: JSON.stringify({
          shipmentId: selectedShipmentId,
          status: "Accepted",
        }),
      });

      const result = await response.json();

      if (result.success) {
        sessionStorage.setItem("selectedShipmentId", selectedShipmentId);

        location.reload();
      }
    });

  // Update the shipment status to On Route
  startDeliveryBtn.addEventListener("click", async () => {
    if (!selectedShipmentId) {
      alert("Select a shipment first");
      return;
    }

    const response = await fetch("/api/update-shipment-status", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },

      body: JSON.stringify({
        shipmentId: selectedShipmentId,
        status: "On Route",
      }),
    });

    const result = await response.json();

    if (result.success) {
      sessionStorage.setItem("selectedShipmentId", selectedShipmentId);

      location.reload();
    }
  });

  // Complete the shipment or resume delivery if previously delayed
  document
    .getElementById("markDeliveredBtn")
    .addEventListener("click", async () => {
      if (!selectedShipmentId) {
        alert("Select a shipment first");
        return;
      }

      const response = await fetch("/api/update-shipment-status", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },

        body: JSON.stringify({
          shipmentId: selectedShipmentId,
          status:
            markDeliveredBtn.textContent === "Resume Delivery"
              ? "On Route"
              : "Delivered",
        }),
      });

      const result = await response.json();

      if (result.success) {
        sessionStorage.setItem("selectedShipmentId", selectedShipmentId);

        location.reload();
      }
    });
});
