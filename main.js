const sections = document.querySelectorAll(".section");
// const navLinks = document.querySelectorAll("nav a");
let currentIndex = 0;
let isScrolling = false;

function showSection(index) {
  if (index < 0 || index >= sections.length) return;
  isScrolling = true;

  sections.forEach((sec) => sec.classList.remove("active"));
//   navLinks.forEach((link) => link.classList.remove("active"));

  sections[index].classList.add("active");
//   navLinks[index].classList.add("active");

  currentIndex = index;
  setTimeout(() => (isScrolling = false), 1500); // bloqué pendant l'animation
}

// Gestion molette avec direction uniquement
window.addEventListener(
  "wheel",
  (e) => {
    if (isScrolling) return;
    if (e.deltaY > 0) {
      showSection(currentIndex + 1);
    } else if (e.deltaY < 0) {
      showSection(currentIndex - 1);
    }
  },
  { passive: true }
);

// Swipe tactile
let touchStartY = 0;
window.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
});
window.addEventListener("touchend", (e) => {
  if (isScrolling) return;
  let touchEndY = e.changedTouches[0].clientY;
  if (touchStartY - touchEndY > 50) {
    showSection(currentIndex + 1);
  } else if (touchEndY - touchStartY > 50) {
    showSection(currentIndex - 1);
  }
});

// Navigation via clics
// navLinks.forEach((link, i) => {
//   link.addEventListener("click", (e) => {
//     e.preventDefault();
//     if (!isScrolling) showSection(i);
//   });
// });

document.querySelectorAll(".section").forEach((section) => {
  let slides = section.querySelectorAll(".slide-container");
  let index = 0;

  function showSlide(newIndex) {
    slides[index].classList.remove("active");
    index = (newIndex + slides.length) % slides.length;
    slides[index].classList.add("active");
  }

  // Bouton suivant
  section.querySelector("#next").addEventListener("click", () => {
    showSlide(index + 1);
  });

  // Bouton précédent
  section.querySelector("#prev").addEventListener("click", () => {
    showSlide(index - 1);
  });

  // Défilement automatique toutes les 3 secondes
  setInterval(() => {
    showSlide(index + 1);
  }, 3000); // 3000 ms = 3 secondes
});


