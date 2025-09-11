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

// Gestion du menu burger pour mobile
// const burger = document.querySelector(".burger");
// const navLinks = document.querySelector(".nav-links");
// burger.addEventListener("click", () => {
//   navLinks.classList.toggle("active");
// });
