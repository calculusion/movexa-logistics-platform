const pageTransition = document.getElementById("pageTransition");

pageTransition.classList.remove("opacity-0", "pointer-events-none");

// Execute the shipment details loading process immediately
(async () => {
  try {
    // Read the consignment ID from the URL
    const params = new URLSearchParams(window.location.search);

    const consignmentId = params.get("consignmentId");

    // Redirect if no consignment ID was provided
    if (!consignmentId) {
      window.location.href = "/no-shipment";

      return;
    }

    // Retrieve the current authenticated session
    const {
      data: { session },
    } = await window.supabaseClient.auth.getSession();

    // Redirect unauthenticated users to the home page
    if (!session) {
      window.location.href = "/";

      return;
    }

    // Store the shipment details
    let shipment;

    // Attempt to load the shipment from session storage
    const cachedShipment = sessionStorage.getItem("currentShipment");

    if (cachedShipment) {
      shipment = JSON.parse(cachedShipment);

      // Ensure the cached shipment matches the requested consignment
      if (shipment.consignment_id !== consignmentId) {
        sessionStorage.removeItem("currentShipment");

        window.location.href = "/no-shipment";

        return;
      }
    }

    if (!shipment) {
      // Retrieve shipment details from the backend if no cached data exists
      const response = await fetch(
        `/api/get-shipment-details?consignmentId=${encodeURIComponent(consignmentId)}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      if (!response.ok) {
        sessionStorage.removeItem("currentShipment");

        window.location.replace("/no-shipment");

        return;
      }

      shipment = await response.json();
    }

    // Update the shipment progress timeline and delivery badge
    function updateTimeline(status) {
      const steps = {
        Pending: {
          dot: "stepPendingDot",
          text: "stepPendingText",
          color: "gray",
        },

        Accepted: {
          dot: "stepAcceptedDot",
          text: "stepAcceptedText",
          color: "blue",
        },

        "Started Delivery": {
          dot: "stepStartedDot",
          text: "stepStartedText",
          color: "orange",
        },

        "On Route": {
          dot: "stepRouteDot",
          text: "stepRouteText",
          color: "orange",
        },

        Delivered: {
          dot: "stepDeliveredDot",
          text: "stepDeliveredText",
          color: "green",
        },
      };

      const order = [
        "Pending",
        "Accepted",
        "Started Delivery",
        "On Route",
        "Delivered",
      ];

      const activeIndex = order.indexOf(status);

      order.forEach((step, index) => {
        const dot = document.getElementById(steps[step].dot);

        const text = document.getElementById(steps[step].text);

        if (!dot || !text) return;

        dot.className = "w-2.5 h-2.5 rounded-full";

        text.className = "text-[13px] font-medium whitespace-nowrap";

        if (index < activeIndex) {
          dot.classList.add("bg-green-500", "ring-4", "ring-green-500/20");

          text.classList.add("text-green-500");
        } else if (index === activeIndex) {
          dot.classList.add("ring-4", "animate-pulse-dot");

          if (step === "Accepted") {
            dot.classList.add("bg-blue-500", "ring-blue-500/20");

            text.classList.add("text-blue-500");
          } else if (step === "Started Delivery" || step === "On Route") {
            dot.classList.add("bg-orange-400", "ring-orange-400/20");

            text.classList.add("text-orange-400");
          } else if (step === "Delivered") {
            dot.classList.add("bg-green-500", "ring-green-500/20");

            text.classList.add("text-green-500");
          } else {
            dot.classList.add("bg-gray-400", "ring-gray-400/20");

            text.classList.add("text-gray-400");
          }
        } else {
          dot.classList.add("bg-gray-500", "ring-4", "ring-gray-500/20");

          text.classList.add("text-gray-500");
        }
      });

      const badge = document.getElementById("deliveryBadge");

      if (!badge) return;

      if (status === "Delayed") {
        badge.textContent = "DELAYED";

        badge.className =
          "bg-[#F93C3F] text-white px-5 py-2.5 rounded-md text-[15px] font-medium shadow-sm";
      } else if (status === "Delivered") {
        badge.textContent = "DELIVERY COMPLETED";

        badge.className =
          "bg-[#32B66B] text-white px-5 py-2.5 rounded-md text-[15px] font-medium shadow-sm";
      } else {
        badge.textContent = "ON TIME";

        badge.className =
          "bg-[#4690FF] text-white px-5 py-2.5 rounded-md text-[15px] font-medium shadow-sm";
      }
    }

    // Safely display a shipment field or a placeholder if no value exists
    function setText(id, value) {
      const element = document.getElementById(id);

      if (element) {
        element.textContent = value && value.toString().trim() ? value : "-";
      }
    }

    // Populate the shipment details on the page
    setText("consignmentId", shipment.consignment_id);

    setText("senderName", shipment.sender_name);

    setText("senderPhone", shipment.sender_phone);

    setText("senderCity", shipment.sender_city);

    setText("senderAddress", shipment.sender_address);

    setText("senderPincode", shipment.sender_pincode);

    setText("senderLandmark", shipment.sender_landmark);

    setText("senderCountry", shipment.sender_country);

    setText("receiverName", shipment.receiver_name);

    setText("receiverPhone", shipment.receiver_phone);

    setText("receiverCity", shipment.receiver_city);

    setText("receiverAddress", shipment.receiver_address);

    setText("receiverPincode", shipment.receiver_pincode);

    setText("receiverLandmark", shipment.receiver_landmark);

    setText("receiverCountry", shipment.receiver_country);

    setText("itemType", shipment.item_name);

    setText("quantity", shipment.quantity);

    setText("weight", shipment.weight);

    setText("length", shipment.length);

    setText("width", shipment.width);

    setText("height", shipment.height);

    setText("serviceName", shipment.service_name);

    setText("additionalService", shipment.additional_service || "None");

    setText("totalAmount", `€ ${shipment.total_amount}`);

    setText("description", shipment.description);

    setText("specialInstructions", shipment.special_instructions);

    // Display the current shipment progress
    updateTimeline(shipment.current_status);

    // Remove the cached shipment after it has been displayed
    sessionStorage.removeItem("currentShipment");

    // Reveal the page content after all data has loaded
    const pageContent = document.getElementById("pageContent");

    pageTransition.classList.add("opacity-0", "pointer-events-none");
    pageContent.classList.remove("opacity-0", "translate-y-2");
  } catch (error) {
    // Log unexpected errors
    console.error(error);
  }
})();
