document.querySelectorAll(".doc-scroll-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const target = document.querySelector(link.getAttribute("href"));
    const scrollContainer = document.querySelector("main");

    if (!target || !scrollContainer) return;

    scrollContainer.scrollTo({
      top: target.offsetTop - 40,
      behavior: "smooth",
    });
  });
});
