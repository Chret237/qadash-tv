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
  burger?.classList.remove("fa-times");
  navMenu?.classList.remove("active");
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
      s.classList.remove("active", "prev", "next");
      if (idx === i) s.classList.add("active");
      else if (idx === (i - 1 + slides.length) % slides.length)
        s.classList.add("prev");
      else if (idx === (i + 1) % slides.length) s.classList.add("next");
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
    }),
  );

  section.addEventListener("mouseenter", stopAuto);
  section.addEventListener("mouseleave", startAuto);

  showSlide(index);
  startAuto();
}

function getBackgroundImageUrl(element) {
  const value = window.getComputedStyle(element).backgroundImage;
  const match = value.match(/url\((['"]?)(.*?)\1\)/i);
  return match ? match[2] : "";
}

function ensureImageLightbox() {
  let lightbox = document.getElementById("qadash-image-lightbox");

  if (!lightbox) {
    lightbox = document.createElement("div");
    lightbox.id = "qadash-image-lightbox";
    lightbox.className = "image-lightbox";
    lightbox.innerHTML = `
      <div class="image-lightbox-backdrop"></div>
      <div class="image-lightbox-content">
        <button class="image-lightbox-close" type="button" aria-label="Fermer la vue agrandie">×</button>
        <img src="" alt="Vue agrandie" />
      </div>
    `;

    const closeBtn = lightbox.querySelector(".image-lightbox-close");
    closeBtn.addEventListener("click", () => {
      lightbox.classList.remove("active");
      document.body.style.overflow = "";
    });

    lightbox.addEventListener("click", (event) => {
      if (
        event.target === lightbox ||
        event.target.classList.contains("image-lightbox-backdrop")
      ) {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        lightbox.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    document.body.appendChild(lightbox);
  }

  return lightbox;
}

function openImageLightbox(src, alt = "Image agrandie") {
  const lightbox = ensureImageLightbox();
  const img = lightbox.querySelector("img");

  if (!src) return;

  img.src = src;
  img.alt = alt;
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function bindImageLightbox() {
  document
    .querySelectorAll('.gallery-grid img[data-type="image"]')
    .forEach((img) => {
      img.style.cursor = "pointer";
      img.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const src = img.dataset.src || img.src;
        openImageLightbox(src, img.alt || "Image de galerie");
      });
    });

  document.querySelectorAll(".announcements-slide").forEach((slide) => {
    slide.style.cursor = "pointer";
    slide.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      const src = getBackgroundImageUrl(slide);
      if (!src) return;

      const title =
        slide.querySelector("h2")?.textContent || "Image de mise en avant";
      openImageLightbox(src, title);
    });
  });
}

function playGalleryVideo() {
  const gallery = document.getElementById("gallery-grid");
  gallery?.addEventListener("click", (e) => {
    const img = e.target.closest('img[data-type="video"]');
    if (!img) return;
    const src = img.dataset.src || img.src;
    try {
      const w = window.open(src, "_parent");
      if (w) w.opener = null;
    } catch (err) {
      const a = document.createElement("a");
      a.href = src;
      a.target = "_parent";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  });
}

/* Initialisation */
window.addEventListener("load", () => {
  qadashSlider(".announcements-slider", ".announcements-slide");
  qadashSlider(".events-slider", ".event-slide");
  bindImageLightbox();
  playGalleryVideo();
});
