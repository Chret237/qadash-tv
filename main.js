function showPageSkeleton() {
  const startedAt = performance.now();
  const skeleton = document.createElement("div");
  skeleton.className = "page-skeleton";
  skeleton.setAttribute("role", "status");
  skeleton.setAttribute("aria-label", "Chargement de la page");
  skeleton.innerHTML = `
    <div class="page-skeleton__header" aria-hidden="true">
      <span class="page-skeleton__brand skeleton"></span>
      <span class="page-skeleton__nav skeleton"></span>
      <span class="page-skeleton__nav page-skeleton__nav--short skeleton"></span>
    </div>
    <div class="page-skeleton__content" aria-hidden="true">
      <span class="page-skeleton__title skeleton"></span>
      <span class="page-skeleton__line skeleton"></span>
      <span class="page-skeleton__line page-skeleton__line--short skeleton"></span>
      <div class="page-skeleton__grid">
        <span class="page-skeleton__item skeleton"></span>
        <span class="page-skeleton__item skeleton"></span>
        <span class="page-skeleton__item skeleton"></span>
      </div>
    </div>
  `;

  document.body.setAttribute("aria-busy", "true");
  document.body.appendChild(skeleton);

  let isDismissed = false;
  function dismissSkeleton() {
    if (isDismissed) return;
    isDismissed = true;

    const minimumDisplayTime = 250;
    const elapsed = performance.now() - startedAt;
    window.setTimeout(
      () => {
        skeleton.classList.add("page-skeleton--hidden");
        document.body.removeAttribute("aria-busy");
        window.setTimeout(() => skeleton.remove(), 250);
      },
      Math.max(0, minimumDisplayTime - elapsed),
    );
  }

  window.addEventListener("load", dismissSkeleton, { once: true });
  window.setTimeout(dismissSkeleton, 1200);
}

showPageSkeleton();

customElements.define(
  "qadash-site-header",
  class extends HTMLElement {
    connectedCallback() {
      const isNestedPage = window.location.pathname.includes("/pages/");
      const base = isNestedPage ? "../" : "./";
      const pageName = window.location.pathname.split("/").pop();

      if (this.dataset.variant === "compact") {
        let backHref = `${base}index.html#events`;
        if (pageName.startsWith("galerie-femmes-")) {
          backHref = `${base}pages/rencontre-femmes.html`;
        } else if (pageName.startsWith("galerie-jeunesse-")) {
          backHref = `${base}pages/rencontre-jeunesse.html`;
        }

        this.innerHTML = `
          <header class="nav-bar">
            <div class="logo">
              <a href="${base}index.html" aria-label="Qadash TV - Accueil">
                <img src="${base}images/logo_qadash.jpg" alt="Qadash TV" height="70" />
              </a>
              <a href="${backHref}" class="back-link" aria-label="Retour">
                <i class="fa fa-chevron-left" aria-hidden="true"></i>
              </a>
            </div>
            <div class="language gallery-language">
              <div class="language-switcher" aria-label="Sélecteur de langue">
                <button class="lang-btn active" id="lang-fr" type="button" aria-pressed="true">FR</button>
                <button class="lang-btn" id="lang-en" type="button" aria-pressed="false">EN</button>
              </div>
            </div>
          </header>
        `;
        return;
      }

      const navItems = [
        { href: `${base}index.html`, fr: "Accueil", en: "Home" },
        {
          href: `${base}pages/enseignements.html`,
          fr: "Enseignements",
          en: "Teachings",
        },
        { href: `${base}pages/livres.html`, fr: "Livres", en: "Books" },
        {
          href: `${base}pages/animations.html`,
          fr: "Animations",
          en: "Animations",
        },
        {
          href: pageName === "index.html" ? "#s5" : `${base}index.html#s5`,
          fr: "Contacts",
          en: "Contact",
        },
      ];
      const normalizePath = (path) =>
        path.replace(/\/index\.html$/, "").replace(/\/$/, "") || "/";
      const currentPath = normalizePath(window.location.pathname);
      const navLinks = navItems
        .map((item) => {
          const isCurrent =
            item.fr !== "Contacts" &&
            normalizePath(new URL(item.href, window.location.href).pathname) ===
              currentPath;
          return `
            <a class="nav-link${isCurrent ? " active" : ""}" href="${item.href}"${
              isCurrent ? ' aria-current="page"' : ""
            }>
              <span lang-fr>${item.fr}</span><span lang-en>${item.en}</span>
            </a>
          `;
        })
        .join("");

      this.innerHTML = `
        <header class="nav-bar">
          <button class="burger" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="nav-menu">
            <i class="fas fa-bars" aria-hidden="true"></i>
          </button>
          <div class="logo">
            <a href="${base}index.html" aria-label="Qadash TV - Accueil">
              <img src="${base}images/logo_qadash.jpg" alt="Qadash TV" height="79" width="164" />
            </a>
          </div>
          <nav class="nav-menu" id="nav-menu">
            <div class="nav-menu-brand">
              <a href="${base}index.html" aria-label="Qadash TV - Accueil">
                <img src="${base}images/logo_qadash.jpg" alt="Qadash TV" />
              </a>
            </div>
            ${navLinks}
            <div class="nav-menu-footer">
              <span class="nav-menu-social-label" lang-fr>Suivez-nous</span>
              <span class="nav-menu-social-label" lang-en>Follow us</span>
              <a href="https://www.youtube.com/@Qadash-TV" target="_blank" rel="noopener noreferrer" aria-label="YouTube @Qadash-TV">
                <i class="fab fa-youtube" aria-hidden="true"></i>
                <span>@Qadash-TV</span>
              </a>
            </div>
          </nav>
          <div class="language">
            <div class="language-switcher" aria-label="Sélecteur de langue">
              <button class="lang-btn active" id="lang-fr" type="button" aria-pressed="true">FR</button>
              <button class="lang-btn" id="lang-en" type="button" aria-pressed="false">EN</button>
            </div>
          </div>
        </header>
      `;
    }
  },
);

customElements.define(
  "qadash-site-footer",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <footer>
          <p>
            <span lang-fr>&copy; Qadash tv 2025 - Tous droits réservés</span>
            <span lang-en>&copy; Qadash TV 2025 - All rights reserved</span>
          </p>
          <p>
            <span lang-fr>Suivez-nous sur :</span><span lang-en>Follow us on:</span>
            <a href="https://web.facebook.com/profile.php?id=61557829689735" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fab fa-facebook-f" aria-hidden="true"></i></a>
            <a href="https://www.instagram.com/qadash_tv_officiel/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i class="fab fa-instagram" aria-hidden="true"></i></a>
            <a href="https://www.youtube.com/@Qadash-TV" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><i class="fab fa-youtube" aria-hidden="true"></i></a>
            <a href="https://www.whatsapp.com/channel/0029VaDmKpv8aKvDNdPlTP1R" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><i class="fab fa-whatsapp" aria-hidden="true"></i></a>
          </p>
        </footer>
      `;
    }
  },
);

const storageKey = "qadash-language";

function applyLocalizedContent(languageCode) {
  const normalized = languageCode === "en" ? "en" : "fr";

  document.querySelectorAll("[lang-fr], [lang-en]").forEach((element) => {
    element.hidden = !element.hasAttribute(`lang-${normalized}`);
  });
}

function applyLanguageButtonState(languageCode) {
  const normalized = languageCode === "en" ? "en" : "fr";
  const buttons = {
    en: document.getElementById("lang-en"),
    fr: document.getElementById("lang-fr"),
  };

  document.documentElement.lang = normalized;
  applyLocalizedContent(normalized);

  Object.entries(buttons).forEach(([code, button]) => {
    if (!button) return;

    const isActive = code === normalized;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  try {
    localStorage.setItem(storageKey, normalized);
  } catch {
    // ignore in restricted contexts
  }

  document.dispatchEvent(
    new CustomEvent("qadash:languagechange", {
      detail: { language: normalized },
    }),
  );
}

const languageButtons = {
  en: document.getElementById("lang-en"),
  fr: document.getElementById("lang-fr"),
};

Object.entries(languageButtons).forEach(([code, button]) => {
  if (!button) return;

  button.addEventListener("click", () => applyLanguageButtonState(code));
});

let preferredLanguage = "fr";

try {
  preferredLanguage = localStorage.getItem(storageKey) || preferredLanguage;
} catch {
  preferredLanguage = "fr";
}

if (!preferredLanguage || !["fr", "en"].includes(preferredLanguage)) {
  preferredLanguage = navigator.language?.toLowerCase().startsWith("en")
    ? "en"
    : "fr";
}

applyLanguageButtonState(preferredLanguage);

// Gestion du menu burger pour mobile
const burger = document.querySelector(".burger");
const burgerIcon = burger?.querySelector("i");
const navMenu = document.querySelector(".nav-menu");

function setMenuOpen(isOpen) {
  if (!burger || !burgerIcon || !navMenu) return;

  burger.setAttribute("aria-expanded", String(isOpen));
  burger.setAttribute(
    "aria-label",
    isOpen ? "Fermer le menu" : "Ouvrir le menu",
  );
  burgerIcon.classList.toggle("fa-bars", !isOpen);
  burgerIcon.classList.toggle("fa-times", isOpen);
  navMenu.classList.toggle("active", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
}

burger?.addEventListener("click", () => {
  setMenuOpen(!navMenu?.classList.contains("active"));
});

// Gestion des liens de navigation
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (e) => {
    const parent = e.currentTarget.parentElement;
    parent?.querySelector(".active")?.classList.remove("active");
    e.currentTarget.classList.add("active");
    setMenuOpen(false);
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navMenu?.classList.contains("active")) {
    setMenuOpen(false);
    burger?.focus();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1225) setMenuOpen(false);
});

window.addEventListener("scroll", () => setMenuOpen(false));

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
