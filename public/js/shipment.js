// ===============================
// ETS2 CITY DATABASE
// ===============================

const ets2Cities = {
  germany: [
    // 8
    "Berlin",
    "Hamburg",
    "Munich",
    "Frankfurt",
    "Cologne",
    "Stuttgart",
    "Leipzig",
    "Dresden",
  ],

  france: [
    // 8
    "Paris",
    "Lyon",
    "Marseille",
    "Toulouse",
    "Nice",
    "Lille",
    "Bordeaux",
    "Strasbourg",
  ],

  italy: [
    // 8
    "Rome",
    "Milan",
    "Venice",
    "Turin",
    "Naples",
    "Bologna",
    "Florence",
    "Palermo",
  ],

  spain: [
    // 7
    "Madrid",
    "Barcelona",
    "Valencia",
    "Seville",
    "Bilbao",
    "Malaga",
    "Zaragoza",
  ],

  portugal: ["Lisbon", "Porto", "Braga", "Coimbra", "Faro"],

  netherlands: ["Amsterdam", "Rotterdam", "The Hague", "Utrecht", "Eindhoven"],

  belgium: ["Brussels", "Antwerp", "Ghent", "Liege"],

  luxembourg: ["Luxembourg City"],

  switzerland: ["Zurich", "Geneva", "Bern", "Basel"],

  austria: ["Vienna", "Salzburg", "Graz", "Linz"],

  uk: [
    "London",
    "Manchester",
    "Birmingham",
    "Liverpool",
    "Leeds",
    "Glasgow",
    "Edinburgh",
  ],

  ireland: ["Dublin", "Cork", "Galway", "Limerick"],

  iceland: ["Reykjavik", "Akureyri", "Keflavik"],

  norway: ["Oslo", "Bergen", "Trondheim", "Stavanger"],

  sweden: ["Stockholm", "Gothenburg", "Malmo", "Uppsala"],

  finland: ["Helsinki", "Tampere", "Turku", "Oulu"],

  denmark: ["Copenhagen", "Aarhus", "Odense", "Aalborg"],

  poland: ["Warsaw", "Krakow", "Wroclaw", "Gdansk", "Poznan", "Lodz"],

  czechia: ["Prague", "Brno", "Ostrava"],

  slovakia: ["Bratislava", "Kosice", "Zilina"],

  hungary: ["Budapest", "Debrecen", "Szeged"],

  romania: ["Bucharest", "Cluj-Napoca", "Timisoara", "Brasov"],

  bulgaria: ["Sofia", "Plovdiv", "Varna"],

  greece: ["Athens", "Thessaloniki", "Patras"],

  croatia: ["Zagreb", "Split", "Rijeka"],

  slovenia: ["Ljubljana", "Maribor", "Koper"],

  estonia: ["Tallinn", "Tartu", "Parnu"],

  latvia: ["Riga", "Daugavpils", "Liepaja"],

  lithuania: ["Vilnius", "Kaunas", "Klaipeda"],

  turkey: ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya"],
};

// ===============================
// CITY COORDINATES
// ===============================

const cityCoords = {
  Aalborg: { lat: 57.0488, lng: 9.9217 },
  Aarhus: { lat: 56.1629, lng: 10.2039 },
  Akureyri: { lat: 65.6885, lng: -18.1262 },
  Amsterdam: { lat: 52.3676, lng: 4.9041 },
  Ankara: { lat: 39.9334, lng: 32.8597 },
  Antalya: { lat: 36.8969, lng: 30.7133 },
  Antwerp: { lat: 51.2194, lng: 4.4025 },
  Athens: { lat: 37.9838, lng: 23.7275 },
  Barcelona: { lat: 41.3851, lng: 2.1734 },
  Basel: { lat: 47.5596, lng: 7.5886 },
  Bergen: { lat: 60.3913, lng: 5.3221 },
  Berlin: { lat: 52.52, lng: 13.405 },
  Bern: { lat: 46.948, lng: 7.4474 },
  Bilbao: { lat: 43.263, lng: -2.935 },
  Birmingham: { lat: 52.4862, lng: -1.8904 },
  Bologna: { lat: 44.4949, lng: 11.3426 },
  Bordeaux: { lat: 44.8378, lng: -0.5792 },
  Braga: { lat: 41.5454, lng: -8.4265 },
  Brasov: { lat: 45.6579, lng: 25.6012 },
  Bratislava: { lat: 48.1486, lng: 17.1077 },
  Brno: { lat: 49.1951, lng: 16.6068 },
  Brussels: { lat: 50.8503, lng: 4.3517 },
  Bucharest: { lat: 44.4268, lng: 26.1025 },
  Budapest: { lat: 47.4979, lng: 19.0402 },
  Bursa: { lat: 40.195, lng: 29.06 },
  "Cluj-Napoca": { lat: 46.7712, lng: 23.6236 },
  Coimbra: { lat: 40.2033, lng: -8.4103 },
  Cologne: { lat: 50.9375, lng: 6.9603 },
  Copenhagen: { lat: 55.6761, lng: 12.5683 },
  Cork: { lat: 51.8985, lng: -8.4756 },
  Daugavpils: { lat: 55.8747, lng: 26.5362 },
  Debrecen: { lat: 47.5316, lng: 21.6273 },
  Dresden: { lat: 51.0504, lng: 13.7373 },
  Dublin: { lat: 53.3498, lng: -6.2603 },
  Edinburgh: { lat: 55.9533, lng: -3.1883 },
  Eindhoven: { lat: 51.4416, lng: 5.4697 },
  Faro: { lat: 37.0194, lng: -7.9304 },
  Florence: { lat: 43.7696, lng: 11.2558 },
  Frankfurt: { lat: 50.1109, lng: 8.6821 },
  Galway: { lat: 53.2707, lng: -9.0568 },
  Gdansk: { lat: 54.352, lng: 18.6466 },
  Geneva: { lat: 46.2044, lng: 6.1432 },
  Ghent: { lat: 51.0543, lng: 3.7174 },
  Glasgow: { lat: 55.8642, lng: -4.2518 },
  Gothenburg: { lat: 57.7089, lng: 11.9746 },
  Graz: { lat: 47.0707, lng: 15.4395 },
  Hamburg: { lat: 53.5511, lng: 9.9937 },
  Helsinki: { lat: 60.1699, lng: 24.9384 },
  Istanbul: { lat: 41.0082, lng: 28.9784 },
  Izmir: { lat: 38.4237, lng: 27.1428 },
  Kaunas: { lat: 54.8985, lng: 23.9036 },
  Keflavik: { lat: 63.9998, lng: -22.5584 },
  Klaipeda: { lat: 55.7033, lng: 21.1443 },
  Koper: { lat: 45.5481, lng: 13.7302 },
  Kosice: { lat: 48.7164, lng: 21.2611 },
  Krakow: { lat: 50.0647, lng: 19.945 },
  Leeds: { lat: 53.8008, lng: -1.5491 },
  Leipzig: { lat: 51.3397, lng: 12.3731 },
  Liege: { lat: 50.6326, lng: 5.5797 },
  Liepaja: { lat: 56.5047, lng: 21.0108 },
  Lille: { lat: 50.6292, lng: 3.0573 },
  Limerick: { lat: 52.6638, lng: -8.6267 },
  Linz: { lat: 48.3069, lng: 14.2858 },
  Lisbon: { lat: 38.7223, lng: -9.1393 },
  Liverpool: { lat: 53.4084, lng: -2.9916 },
  Ljubljana: { lat: 46.0569, lng: 14.5058 },
  Lodz: { lat: 51.7592, lng: 19.456 },
  London: { lat: 51.5074, lng: -0.1278 },
  "Luxembourg City": { lat: 49.6116, lng: 6.1319 },
  Lyon: { lat: 45.764, lng: 4.8357 },
  Madrid: { lat: 40.4168, lng: -3.7038 },
  Malaga: { lat: 36.7213, lng: -4.4214 },
  Malmo: { lat: 55.605, lng: 13.0038 },
  Manchester: { lat: 53.4808, lng: -2.2426 },
  Maribor: { lat: 46.5547, lng: 15.6459 },
  Marseille: { lat: 43.2965, lng: 5.3698 },
  Milan: { lat: 45.4642, lng: 9.19 },
  Munich: { lat: 48.1351, lng: 11.582 },
  Naples: { lat: 40.8518, lng: 14.2681 },
  Nice: { lat: 43.7102, lng: 7.262 },
  Odense: { lat: 55.4038, lng: 10.4024 },
  Oslo: { lat: 59.9139, lng: 10.7522 },
  Ostrava: { lat: 49.8209, lng: 18.2625 },
  Oulu: { lat: 65.0121, lng: 25.4651 },
  Palermo: { lat: 38.1157, lng: 13.3615 },
  Paris: { lat: 48.8566, lng: 2.3522 },
  Parnu: { lat: 58.3859, lng: 24.4971 },
  Patras: { lat: 38.2466, lng: 21.7346 },
  Plovdiv: { lat: 42.1354, lng: 24.7453 },
  Porto: { lat: 41.1579, lng: -8.6291 },
  Poznan: { lat: 52.4064, lng: 16.9252 },
  Prague: { lat: 50.0755, lng: 14.4378 },
  Reykjavik: { lat: 64.1466, lng: -21.9426 },
  Riga: { lat: 56.9496, lng: 24.1052 },
  Rijeka: { lat: 45.3271, lng: 14.4422 },
  Rome: { lat: 41.9028, lng: 12.4964 },
  Rotterdam: { lat: 51.9225, lng: 4.4792 },
  Salzburg: { lat: 47.8095, lng: 13.055 },
  Seville: { lat: 37.3891, lng: -5.9845 },
  Sofia: { lat: 42.6977, lng: 23.3219 },
  Split: { lat: 43.5081, lng: 16.4402 },
  Stavanger: { lat: 58.969, lng: 5.7331 },
  Stockholm: { lat: 59.3293, lng: 18.0686 },
  Strasbourg: { lat: 48.5734, lng: 7.7521 },
  Stuttgart: { lat: 48.7758, lng: 9.1829 },
  Szeged: { lat: 46.253, lng: 20.1414 },
  Tallinn: { lat: 59.437, lng: 24.7536 },
  Tampere: { lat: 61.4978, lng: 23.761 },
  Tartu: { lat: 58.3776, lng: 26.729 },
  "The Hague": { lat: 52.0705, lng: 4.3007 },
  Thessaloniki: { lat: 40.6401, lng: 22.9444 },
  Timisoara: { lat: 45.7489, lng: 21.2087 },
  Toulouse: { lat: 43.6047, lng: 1.4442 },
  Trondheim: { lat: 63.4305, lng: 10.3951 },
  Turin: { lat: 45.0703, lng: 7.6869 },
  Turku: { lat: 60.4518, lng: 22.2666 },
  Uppsala: { lat: 59.8586, lng: 17.6389 },
  Utrecht: { lat: 52.0907, lng: 5.1214 },
  Valencia: { lat: 39.4699, lng: -0.3763 },
  Varna: { lat: 43.2141, lng: 27.9147 },
  Venice: { lat: 45.4408, lng: 12.3155 },
  Vienna: { lat: 48.2082, lng: 16.3738 },
  Vilnius: { lat: 54.6872, lng: 25.2797 },
  Warsaw: { lat: 52.2297, lng: 21.0122 },
  Wroclaw: { lat: 51.1079, lng: 17.0385 },
  Zagreb: { lat: 45.815, lng: 15.9819 },
  Zaragoza: { lat: 41.6488, lng: -0.8891 },
  Zilina: { lat: 49.2232, lng: 18.7394 },
  Zurich: { lat: 47.3769, lng: 8.5417 },
};

// ===============================
// DISTANCE CALCULATION
// ===============================

function getDistanceKm(cityA, cityB) {
  const a = cityCoords[cityA];
  const b = cityCoords[cityB];

  if (!a || !b) return 0;

  const R = 6371;

  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 *
      Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180);

  return Math.round(2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)));
}

// ===============================
// COUNTRY + CITY DROPDOWNS
// ===============================

function setupCountryCity(
  countryDropdownId,
  countryOptionsId,
  countrySelectedId,
  cityDropdownId,
  cityOptionsId,
  cityTextId,
) {
  const countryDropdown = document.getElementById(countryDropdownId);

  const countryOptions = document.getElementById(countryOptionsId);

  const countrySelected = document.getElementById(countrySelectedId);

  const cityDropdown = document.getElementById(cityDropdownId);

  const cityOptions = document.getElementById(cityOptionsId);

  const cityText = document.getElementById(cityTextId);

  let selectedCountry = null;

  countryDropdown.addEventListener("click", (e) => {
    e.stopPropagation();
    countryOptions.classList.toggle("hidden");
  });

  countryOptions.querySelectorAll("div").forEach((option) => {
    option.addEventListener("click", () => {
      selectedCountry = option.dataset.value;

      countrySelected.textContent = option.textContent.trim();

      cityText.textContent = "Select City";
      cityOptions.innerHTML = "";

      ets2Cities[selectedCountry]?.forEach((city) => {
        const div = document.createElement("div");

        div.textContent = city;

        div.className = "px-4 py-3 hover:bg-gray-100 cursor-pointer";

        div.addEventListener("click", () => {
          cityText.textContent = city;

          cityOptions.classList.add("hidden");

          calculatePrice();
        });

        cityOptions.appendChild(div);
      });

      countryOptions.classList.add("hidden");

      calculatePrice();
    });
  });

  cityDropdown.addEventListener("click", (e) => {
    e.stopPropagation();

    if (!selectedCountry) {
      const message =
        countryDropdownId === "fromCountryDropdown"
          ? "Please select the sender's country first."
          : "Please select the receiver's country first.";

      showToast(message, "error");

      return;
    }

    cityOptions.classList.toggle("hidden");
  });

  document.addEventListener("click", () => {
    countryOptions.classList.add("hidden");
    cityOptions.classList.add("hidden");
  });
}

// ===============================
// GENERIC DROPDOWNS
// ===============================

function setupDropdown(dropdownId, optionsId, selectedId, callback = null) {
  const dropdown = document.getElementById(dropdownId);

  const options = document.getElementById(optionsId);

  const selected = document.getElementById(selectedId);

  dropdown.addEventListener("click", (e) => {
    e.stopPropagation();
    options.classList.toggle("hidden");
  });

  options.querySelectorAll("div").forEach((option) => {
    option.addEventListener("click", () => {
      selected.textContent = option.textContent.trim();

      options.classList.add("hidden");

      if (callback) callback();

      calculatePrice();
    });
  });

  document.addEventListener("click", () => {
    options.classList.add("hidden");
  });
}

// ===============================
// PRICE CALCULATION
// ===============================

function calculatePrice() {
  const weight = Number(document.getElementById("weight").value) || 0;
  const quantity = Number(document.getElementById("numItems").value) || 0;

  const service = document.getElementById("serviceSelected").innerText.trim();
  const additional = document
    .getElementById("additionalServiceSelected")
    .innerText.trim();
  const delivery = document.getElementById("deliverySelected").innerText.trim();

  const fromCity = document.getElementById("fromCity").innerText.trim();
  const toCity = document.getElementById("toCity").innerText.trim();

  if (fromCity === "Select City" || toCity === "Select City") return;

  const distance = getDistanceKm(fromCity, toCity);

  const serviceMultiplier = {
    "Standard Delivery": 1.0,
    "Express Delivery": 1.5,
    "Fragile Cargo Transport": 1.8,
    "Heavy Haul Transport": 2.2,
  };

  const additionalMultiplier = {
    "Cargo Insurance": 1.1,
    "Priority Handling": 1.2,
    "Escort Vehicle Service": 1.4,
    "Roadside Assistance": 1.15,
    Select: 1.0,
  };

  const deliveryMultiplier = {
    Domestic: 1.0,
    International: 2.0,
  };

  let total =
    distance *
    weight *
    quantity *
    0.015 *
    (serviceMultiplier[service] || 1.0) *
    (additionalMultiplier[additional] || 1.0) *
    (deliveryMultiplier[delivery] || 1.0);

  total = Math.max(0, Math.round(total));

  document.getElementById("totalAmount").value = "€ " + total;
}

// ===============================
// TOAST
// ===============================

function showToast(message, type = "success") {
  const toast = document.getElementById("toast");

  toast.textContent = message;

  toast.className =
    "fixed top-5 right-5 px-5 py-3 rounded-lg shadow-lg text-white z-50";

  toast.classList.add(type === "success" ? "bg-green-500" : "bg-red-500");

  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}

// ===============================
// GENERATE SHIPMENT
// ===============================

function setupGenerateButton() {
  const generateBtn = document.getElementById("generateBtn");

  if (!generateBtn) {
    console.error("Generate button not found");
    return;
  }

  generateBtn.addEventListener("click", async () => {
    const messageBox = document.getElementById("message");

    messageBox.classList.add("hidden");
    messageBox.textContent = "";

    if (generateBtn.disabled) return;
    generateBtn.disabled = true;

    generateBtn.textContent = "Creating shipment...";

    try {
      const requiredFields = document.querySelectorAll(
        "input[required], textarea[required]",
      );

      let valid = true;

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          valid = false;

          field.classList.add("border-red-500", "ring-1", "ring-red-500");
        } else {
          field.classList.remove("border-red-500", "ring-1", "ring-red-500");
        }
      });

      if (!valid) {
        showToast("Please fill all required fields.", "error");

        return;
      }

      const dropdowns = [
        {
          id: "fromCountrySelected",
          placeholder: "Select Country",
          name: "From Country",
        },
        {
          id: "fromCity",
          placeholder: "Select City",
          name: "From City",
        },
        {
          id: "toCountrySelected",
          placeholder: "Select Country",
          name: "To Country",
        },
        {
          id: "toCity",
          placeholder: "Select City",
          name: "To City",
        },
        {
          id: "itemSelected",
          placeholder: "Select",
          name: "Item Type",
        },
        {
          id: "serviceSelected",
          placeholder: "Select",
          name: "Service",
        },
        {
          id: "deliverySelected",
          placeholder: "Select",
          name: "Delivery Type",
        },
        {
          id: "paymentSelected",
          placeholder: "Select",
          name: "Payment Mode",
        },
      ];

      for (const dropdown of dropdowns) {
        const element = document.getElementById(dropdown.id);

        if (element.textContent.trim() === dropdown.placeholder) {
          showToast(`Please select ${dropdown.name}.`, "error");

          return;
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      generateBtn.disabled = false;
      generateBtn.textContent = "Generate Shipment";
    }

    const senderName = document.getElementById("senderName").value.trim();
    const senderPhone = document.getElementById("senderPhone").value.trim();
    const senderAddress = document.getElementById("senderAddress").value.trim();
    const senderCity = document.getElementById("fromCity").innerText.trim();
    const senderPincode = document.getElementById("senderPincode").value.trim();

    const receiverName = document.getElementById("receiverName").value.trim();
    const receiverPhone = document.getElementById("receiverPhone").value.trim();
    const receiverAddress = document
      .getElementById("receiverAddress")
      .value.trim();
    const receiverCity = document.getElementById("toCity").innerText.trim();
    const receiverPincode = document
      .getElementById("receiverPincode")
      .value.trim();

    const senderCountry = document
      .getElementById("fromCountrySelected")
      .textContent.trim();

    const receiverCountry = document
      .getElementById("toCountrySelected")
      .textContent.trim();

    if (
      senderName.toLowerCase() === receiverName.toLowerCase() &&
      senderPhone === receiverPhone &&
      senderAddress.toLowerCase() === receiverAddress.toLowerCase() &&
      senderCity === receiverCity &&
      senderPincode === receiverPincode
    ) {
      showToast(
        "Sender and receiver cannot be the same person at the same address.",
        "error",
      );

      generateBtn.disabled = false;
      generateBtn.textContent = "Generate Shipment";

      return;
    }

    const shipmentData = {
      // Sender

      senderName: document.getElementById("senderName").value,

      senderPhone: document.getElementById("senderPhone").value,

      senderAddress: document.getElementById("senderAddress").value,

      senderCity: document.getElementById("fromCity").innerText.trim(),

      senderPincode: document.getElementById("senderPincode").value,

      senderLandmark: document.getElementById("senderLandmark").value,

      // Receiver

      receiverName: document.getElementById("receiverName").value,

      receiverPhone: document.getElementById("receiverPhone").value,

      receiverAddress: document.getElementById("receiverAddress").value,

      receiverCity: document.getElementById("toCity").innerText.trim(),

      receiverPincode: document.getElementById("receiverPincode").value,

      receiverLandmark: document.getElementById("receiverLandmark").value,

      // Services

      itemType: document.getElementById("itemSelected").innerText.trim(),

      serviceType: document.getElementById("serviceSelected").innerText.trim(),

      additionalService: document
        .getElementById("additionalServiceSelected")
        .innerText.trim(),

      paymentMode: document.getElementById("paymentSelected").innerText.trim(),

      // Package details

      quantity: parseInt(document.getElementById("numItems").value) || 0,

      weight: parseFloat(document.getElementById("weight").value) || 0,

      length: parseFloat(document.getElementById("length").value) || 0,

      width: parseFloat(document.getElementById("width").value) || 0,

      height: parseFloat(document.getElementById("height").value) || 0,

      description: document.getElementById("description").value,

      totalAmount:
        parseFloat(
          document.getElementById("totalAmount").value.replace(/[^\d.]/g, ""),
        ) || 0,

      specialInstructions: document.getElementById("specialInstructions").value,
    };

    try {
      generateBtn.disabled = true;

      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      const profileResponse = await fetch("/api/profile", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const profile = await profileResponse.json();

      console.log(profile);

      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      shipmentData.userId = user.id;

      clearErrors();

      const response = await fetch("/api/create-shipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(shipmentData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          displayErrors(data.errors);
        }

        messageBox.textContent = data.message || "Something went wrong.";

        messageBox.classList.remove("hidden");

        return;
      }

      setTimeout(() => {
        window.location.href = `/shipment-processing?consignment=${encodeURIComponent(data.consignmentId)}`;
      });
    } catch (error) {
      console.error(error);

      showToast(error.message, "error");
    } finally {
      generateBtn.disabled = false;
    }
  });
}

// ===============================
// INIT
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  setupCountryCity(
    "fromCountryDropdown",
    "fromCountryOptions",
    "fromCountrySelected",
    "fromCityDropdown",
    "fromCityOptions",
    "fromCity",
  );

  setupCountryCity(
    "toCountryDropdown",
    "toCountryOptions",
    "toCountrySelected",
    "toCityDropdown",
    "toCityOptions",
    "toCity",
  );

  setupDropdown("itemDropdown", "itemOptions", "itemSelected");

  setupDropdown("serviceDropdown", "serviceOptions", "serviceSelected");

  setupDropdown(
    "additionalServiceDropdown",
    "additionalServiceOptions",
    "additionalServiceSelected",
  );

  setupDropdown("deliveryDropdown", "deliveryOptions", "deliverySelected");

  setupDropdown("paymentDropdown", "paymentOptions", "paymentSelected");

  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", calculatePrice);
  });

  calculatePrice();
  setupGenerateButton();
});

function resetDropdowns() {
  document.getElementById("fromCountrySelected").textContent = "Select Country";
  document.getElementById("fromCity").textContent = "Select City";

  document.getElementById("toCountrySelected").textContent = "Select Country";
  document.getElementById("toCity").textContent = "Select City";

  document.getElementById("itemSelected").textContent = "Select";

  document.getElementById("serviceSelected").textContent = "Select";

  document.getElementById("additionalServiceSelected").textContent = "Select";

  document.getElementById("deliverySelected").textContent = "Select";

  document.getElementById("paymentSelected").textContent = "Select";

  calculatePrice();
}

function clearErrors() {
  document.querySelectorAll('[id$="Error"]').forEach((element) => {
    element.textContent = "";

    element.classList.add("hidden");
  });
}

function displayErrors(errors) {
  clearErrors();

  Object.keys(errors).forEach((field) => {
    const errorElement = document.getElementById(`${field}Error`);

    if (errorElement) {
      errorElement.textContent = errors[field][0];

      errorElement.classList.remove("hidden");
    }
  });
}

window.addEventListener("load", () => {
  document.getElementById("shipmentForm").reset();
  resetDropdowns();
  clearErrors();
});
