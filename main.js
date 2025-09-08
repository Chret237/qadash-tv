const navLinks = document.querySelectorAll(".nav-link");
for (let navLink of navLinks) {
  navLink.addEventListener("click", (e) => {
    e.currentTarget.parentElement
      .querySelector(".active")
      .classList.remove("active");
    e.currentTarget.classList.add("active");
  });
}

const events = document.querySelector(".events")
const slides = events.querySelectorAll(".slide-container");
let index = 0;

function showSlide(newIndex) {
  slides[index].classList.remove("active");
  index = (newIndex + slides.length) % slides.length;
  slides[index].classList.add("active");
}

// Bouton suivant
events.querySelector("#next").addEventListener("click", () => {
  showSlide(index + 1);
});

// Bouton précédent
events.querySelector("#prev").addEventListener("click", () => {
  showSlide(index - 1);
});

// Défilement automatique toutes les 3 secondes
setInterval(() => {
  showSlide(index + 1);
}, 3000); // 3000 ms = 3 secondes
