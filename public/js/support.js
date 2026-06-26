// Initialize the support page after the document has loaded
document.addEventListener("DOMContentLoaded", () => {
  // Display a temporary success notification
  function showSupportToast() {
    const toast = document.getElementById("supportToast");

    if (!toast) return;

    toast.classList.remove("translate-x-[120%]", "opacity-0");

    setTimeout(() => {
      toast.classList.add("translate-x-[120%]", "opacity-0");
    }, 3000);
  }

  // Handle FAQ expand and collapse functionality
  document.querySelectorAll(".faq-toggle").forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const item = toggle.closest(".faq-item");

      const content = item.querySelector(".faq-content");

      const icon = item.querySelector(".faq-icon i");

      const isOpen = content.style.maxHeight !== "";

      document.querySelectorAll(".faq-content").forEach((el) => {
        el.style.maxHeight = null;

        el.classList.remove("opacity-100");

        el.classList.add("opacity-0");
      });

      document.querySelectorAll(".faq-icon i").forEach((el) => {
        el.setAttribute("data-lucide", "plus");
      });

      if (!isOpen) {
        content.style.maxHeight = content.scrollHeight + "px";

        content.classList.remove("opacity-0");

        content.classList.add("opacity-100");

        icon.setAttribute("data-lucide", "minus");
      }

      lucide.createIcons();
    });
  });

  // Initialize the custom subject selection dropdown
  const subjectDropdown = document.getElementById("subjectDropdown");
  const subjectOptions = document.getElementById("subjectOptions");
  const subjectSelected = document.getElementById("subjectSelected");
  const supportSubject = document.getElementById("supportSubject");
  const subjectChevron = document.getElementById("subjectChevron");

  if (
    subjectDropdown &&
    subjectOptions &&
    subjectSelected &&
    supportSubject &&
    subjectChevron
  ) {
    // Toggle the dropdown menu
    subjectDropdown.addEventListener("click", (event) => {
      event.stopPropagation();

      subjectOptions.classList.toggle("hidden");

      subjectChevron.classList.toggle("rotate-180");
    });

    // Update the selected support topic
    document.querySelectorAll(".subject-option").forEach((option) => {
      option.addEventListener("click", () => {
        const value = option.textContent.trim();

        subjectSelected.textContent = value;

        subjectSelected.classList.remove("text-gray-400");

        subjectSelected.classList.add("text-gray-700");

        supportSubject.value = value;

        subjectOptions.classList.add("hidden");

        subjectChevron.classList.remove("rotate-180");
      });
    });

    // Close the dropdown when clicking outside
    document.addEventListener("click", (event) => {
      if (
        !subjectDropdown.contains(event.target) &&
        !subjectOptions.contains(event.target)
      ) {
        subjectOptions.classList.add("hidden");

        subjectChevron.classList.remove("rotate-180");
      }
    });
  }

  // Handle support request submission
  const supportForm = document.getElementById("supportForm");

  if (supportForm) {
    // Validate the form and submit the support request
    supportForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const submitButton = document.getElementById("submitSupportBtn");

      submitButton.disabled = true;

      const originalText = submitButton.innerHTML;

      submitButton.innerHTML = "Sending...";

      // Retrieve the user's input
      const firstName = document.getElementById("firstName").value.trim();

      const lastName = document.getElementById("lastName").value.trim();

      const email = document.getElementById("email").value.trim();

      const subject = document.getElementById("supportSubject").value.trim();

      const message = document.getElementById("message").value.trim();

      // Ensure all required fields have been completed
      if (!firstName || !lastName || !email || !subject || !message) {
        alert("Please fill in all fields.");

        submitButton.disabled = false;

        submitButton.innerHTML = originalText;

        return;
      }

      const payload = {
        firstName,
        lastName,
        email,
        subject,
        message,
      };

      // Validate the email address format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Validate the email address format
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");

        submitButton.disabled = false;

        submitButton.innerHTML = originalText;

        return;
      }

      // Validate the message length
      if (message.length < 10) {
        alert("Message must be at least 10 characters long.");

        submitButton.disabled = false;

        submitButton.innerHTML = originalText;

        return;
      }

      if (message.length > 2000) {
        alert("Message is too long.");

        submitButton.disabled = false;

        submitButton.innerHTML = originalText;

        return;
      }

      try {
        // Submit the support request to the backend
        const response = await fetch("/api/contact-support", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (response.ok) {
          // Reset the form after a successful submission
          showSupportToast();

          supportForm.reset();

          supportSubject.value = "";

          subjectSelected.textContent = "Select a topic";

          subjectSelected.classList.remove("text-gray-700");

          subjectSelected.classList.add("text-gray-400");
        } else {
          alert(data.message || "Failed to send request.");
        }
      } catch (error) {
        // Log unexpected errors
        console.error(error);

        alert("Something went wrong.");
      } finally {
        // Restore the submit button
        submitButton.disabled = false;

        submitButton.innerHTML = originalText;
      }
    });
  }

  // Render all Lucide icons
  lucide.createIcons();
});

// Enable smooth scrolling for support page navigation
document.querySelectorAll(".support-scroll-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const target = document.querySelector(link.getAttribute("href"));

    const scrollContainer = document.querySelector("main");

    if (!target || !scrollContainer) return;

    scrollContainer.scrollTo({
      top: target.offsetTop - 80,

      behavior: "smooth",
    });
  });
});
