// Gestion des liens de navigation
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    const parent = e.currentTarget.parentElement;
    parent.querySelector(".active")?.classList.remove("active");
    e.currentTarget.classList.add("active");
  });
});

// Fonction générique pour sliders avec points
function initSlider(
  containerSelector,
  slideSelector,
  prevSelector,
  nextSelector,
  dotSelector
) {
  const container = document.querySelector(containerSelector);
  const slides = container.querySelectorAll(slideSelector);
  const dots = dotSelector ? container.querySelectorAll(dotSelector) : [];
  let index = 0;

  const update = () => {
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  };

  const showSlide = (newIndex) => {
    index = (newIndex + slides.length) % slides.length;
    update();
  };

  container
    .querySelector(prevSelector)
    ?.addEventListener("click", () => showSlide(index - 1));
  container
    .querySelector(nextSelector)
    ?.addEventListener("click", () => showSlide(index + 1));

  dots.forEach((dot, i) => dot.addEventListener("click", () => showSlide(i)));

  update(); // initialise le premier affichage
  return showSlide;
}

// Initialisation des sliders
const showEventSlide = initSlider(
  ".events",
  ".slide-container",
  "#prev",
  "#next",
  ".dot"
);
const showAnnouncementSlide = initSlider(
  ".announcements",
  ".a-slide-container",
  "#a-prev",
  "#a-next",
  ".a-dot"
);

// Défilement automatique toutes les 3 secondes
setInterval(() => {
  showEventSlide && showEventSlide(Date.now());
  showAnnouncementSlide && showAnnouncementSlide(Date.now());
}, 3000);

// --- Swipe tactile pour la section événements ---
(function addEventSwipe() {
  const eventsSection = document.querySelector(".events");
  if (!eventsSection) return;

  let startX = 0;
  let endX = 0;

  eventsSection.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      startX = e.touches[0].clientX;
    }
  });

  eventsSection.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    if (Math.abs(diff) > 40) {
      // seuil de swipe
      if (diff > 0) {
        // Swipe vers la droite : slide précédent
        showEventSlide && showEventSlide(Date.now() - 1);
      } else {
        // Swipe vers la gauche : slide suivant
        showEventSlide && showEventSlide(Date.now() + 1);
      }
    }
  });
})();

// Gestion du menu burger pour mobile
const burger = document.querySelector(".burger");
const navMenu = document.querySelector(".nav-menu");
burger.addEventListener("click", () => {
  burger.querySelector(".fas").classList.toggle("fa-times");
  navMenu.classList.toggle("active");
});

window.onscroll = () => {
  burger.querySelector(".fas").classList.remove("fa-times");
  navMenu.classList.remove("active");
};
