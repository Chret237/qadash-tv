window.onload = () => {
  document.body.style.opacity = "0.5";
  setTimeout(() => {
    document.body.style.opacity = "1";
  }, 200);
};

// Gestion des liens de navigation
document.querySelectorAll(".nav-link").forEach((link) => {
  link?.addEventListener("click", (e) => {
    const parent = e.currentTarget.parentElement;
    parent?.querySelector(".active")?.classList.remove("active");
    e.currentTarget.classList.add("active");
  });
});

// Gestion du menu burger pour mobile
const burger = document.querySelector(".burger i");
const navMenu = document.querySelector(".nav-menu");

if (burger && navMenu) {
  burger.addEventListener("click", () => {
    burger.classList.toggle("fa-times");
    navMenu.classList.toggle("active");
  });
}

window.onscroll = () => {
  burger.classList.remove("fa-times");
  navMenu.classList.remove("active");
};

/* ===========================
   QADASH MASTER-LIKE SLIDERS
=========================== */
function qadashSlider(sectionSelector, slideSelector) {
  const section = document.querySelector(sectionSelector);
  if (!section) return;

  const slides = section.querySelectorAll(slideSelector);
  const dots = section.querySelectorAll(".dot");
  const prev = section.querySelector(".prev");
  const next = section.querySelector(".next");

  let index = 0;
  let timer;

  function showSlide(i) {
    slides.forEach((s, idx) => {
    s.classList.remove("active", "prev");
    if (idx === i) s.classList.add("active");
    else if (idx === (i - 1 + slides.length) % slides.length)
      s.classList.add("prev");
  });
  dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
  }

  function nextSlide() {
    index = (index + 1) % slides.length;
    showSlide(index);
  }

  function prevSlide() {
    index = (index - 1 + slides.length) % slides.length;
    showSlide(index);
  }

  function startAuto() {
    stopAuto();
    timer = setInterval(nextSlide, 5000);
  }

  function stopAuto() {
    if (timer) clearInterval(timer);
  }

  next?.addEventListener("click", () => {
    nextSlide();
    startAuto();
  });

  prev?.addEventListener("click", () => {
    prevSlide();
    startAuto();
  });

  dots.forEach((dot, i) =>
    dot.addEventListener("click", () => {
      index = i;
      showSlide(index);
      startAuto();
    })
  );

  section.addEventListener("mouseenter", stopAuto);
  section.addEventListener("mouseleave", startAuto);

  showSlide(index);
  startAuto();
}

/* Initialisation */
window.addEventListener("load", () => {
  qadashSlider(".announcements-slider", ".announcements-slide");
  qadashSlider(".events-slider", ".event-slide");
});
