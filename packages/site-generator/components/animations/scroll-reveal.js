// Scroll-triggered reveal animations using IntersectionObserver
// Add to every generated site. No dependencies.
// Usage: Add class "reveal" to any element to animate it on scroll into view.
// Add "reveal-delay-1", "reveal-delay-2", "reveal-delay-3" for staggered animations.
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
})();
