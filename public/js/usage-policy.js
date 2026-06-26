// Initialize smooth scrolling and active navigation highlighting
document.addEventListener("DOMContentLoaded", () => {
  // Get the main scrollable container
  const scrollContainer = document.querySelector("main");

  // Select all sections that have an ID
  const sections = document.querySelectorAll("section[id]");

  // Select all navigation links in the contents menu
  const navLinks = document.querySelectorAll(".contents-link");

  // Enable smooth scrolling when a navigation link is clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const target = document.querySelector(link.getAttribute("href"));

      if (!target) return;

      scrollContainer.scrollTo({
        top: target.offsetTop - 80,

        behavior: "smooth",
      });
    });
  });

  // Highlight the navigation link for the section currently in view
  function updateActiveLink() {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;

      const sectionHeight = section.offsetHeight;

      if (
        scrollContainer.scrollTop >= sectionTop &&
        scrollContainer.scrollTop < sectionTop + sectionHeight
      ) {
        currentSection = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");

      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  // Update the active navigation link while scrolling
  scrollContainer.addEventListener("scroll", updateActiveLink);

  // Set the correct active link when the page first loads
  updateActiveLink();
});
