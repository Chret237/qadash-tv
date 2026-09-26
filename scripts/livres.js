document.addEventListener("DOMContentLoaded", async () => {
  const bookList = document.querySelector(".book-list");
  const searchInput = document.querySelector("#bookSearch");
  const authorFilter = document.querySelector("#authorFilter");
  const langFilter = document.querySelector("#langFilter");
  const prevBtn = document.querySelector("#prevPage");
  const nextBtn = document.querySelector("#nextPage");
  const pageInfo = document.querySelector("#pageInfo");
  const sectionTitle = document.querySelector(".section-header h1");
  const recommendedTitle = document.querySelector(".book1").previousElementSibling;
  const recommendedBook = document.querySelector(".book1");
  let rechercheActive = false;

  const translate = (fr, en) =>
    document.documentElement.lang === "en" ? en : fr;

  function updateInterfaceText() {
    searchInput.placeholder = translate(
      "Nom de livre ou auteur...",
      "Book title or author...",
    );
    authorFilter.options[0].textContent = translate(
      "Tous les auteurs",
      "All authors",
    );
    langFilter.options[0].textContent = translate(
      "Toutes les langues",
      "All languages",
    );
    prevBtn.textContent = translate("Précédent", "Previous");
    nextBtn.textContent = translate("Suivant", "Next");
  }

  // Création du compteur dynamique
  const compteur = document.createElement("p");
  compteur.id = "bookCount";
  compteur.style.color = "#127484";
  compteur.style.fontWeight = "500";
  compteur.style.margin = "10px 0";
  compteur.style.textAlign = "center";
  bookList.parentElement.insertBefore(compteur, bookList);

  let livres = [];
  let livresFiltres = [];
  let currentPage = 1;
  const livresParPage = 8;

  updateInterfaceText();

  // Fonction utilitaire pour mettre à jour l’URL
  function majURL() {
    const params = new URLSearchParams();
    if (searchInput.value.trim())
      params.set("recherche", searchInput.value.trim());
    if (authorFilter.value) params.set("auteur", authorFilter.value);
    if (langFilter.value) params.set("langue", langFilter.value);
    if (currentPage > 1) params.set("page", currentPage);
    history.replaceState(null, "", `?${params.toString()}`);
  }

  // Récupère les filtres depuis l’URL (si présents)
  function lireURL() {
    const params = new URLSearchParams(window.location.search);
    return {
      recherche: params.get("recherche") || "",
      auteur: params.get("auteur") || "",
      langue: params.get("langue") || "",
      page: parseInt(params.get("page") || "1"),
    };
  }

  // --- Charger les livres ---
  try {
    const response = await fetch("../data/livres.json");
    livres = await response.json();

    // Trier du plus récent au plus ancien
    livres.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Créer les listes d’auteurs et langues
    const auteurs = [...new Set(livres.map((l) => l.auteur))];
    const langues = [...new Set(livres.map((l) => l.langue))];

    auteurs.forEach((auteur) => {
      const option = document.createElement("option");
      option.value = auteur;
      option.textContent = auteur;
      authorFilter.appendChild(option);
    });

    langues.forEach((langue) => {
      const option = document.createElement("option");
      option.value = langue;
      option.textContent = langue;
      langFilter.appendChild(option);
    });

    // Appliquer les valeurs venant de l’URL
    const { recherche, auteur, langue, page } = lireURL();
    searchInput.value = recherche;
    authorFilter.value = auteur;
    langFilter.value = langue;
    currentPage = page;

    appliquerFiltres(false);
  } catch (error) {
    console.error("Erreur lors du chargement des livres :", error);
    bookList.innerHTML = `<p style="color:red;">${translate(
      "Impossible de charger les livres.",
      "Unable to load books.",
    )}</p>`;
  }

  // --- FONCTIONS ---

  function afficherLivres() {
    bookList.innerHTML = "";
    updateInterfaceText();

    const debut = (currentPage - 1) * livresParPage;
    const fin = debut + livresParPage;
    const pageLivres = livresFiltres.slice(debut, fin);

    // Met à jour le compteur
    const totalLivres = livresFiltres.length;
    sectionTitle.textContent = `${translate("Tous les livres", "All books")} (${totalLivres})`;

    if (totalLivres === 0) {
      compteur.textContent = translate("Aucun livre trouvé", "No books found");
    } else if (rechercheActive) {
      recommendedTitle.textContent = "";
      recommendedBook.innerHTML = "";
      compteur.textContent = translate(
        `${totalLivres} livre${totalLivres > 1 ? "s" : ""} trouvé${
          totalLivres > 1 ? "s" : ""
        }`,
        `${totalLivres} book${totalLivres > 1 ? "s" : ""} found`,
      );
    } else {
      compteur.textContent = "";
      recommendedTitle.textContent = translate("Recommandé", "Recommended");
      recommendedBook.innerHTML = `<div class="book">
            <img src="../images/bym.jpg" alt="Bible de Yéhoshoua ha Mashiah" />
            <h3>
              Bible de Yéhoshoua ha Mashiah (BYM)
            </h3>
            <p>${translate("Auteur", "Author")}: Shora KUETU</p>
            <p style="color: #127484;">${translate("Langue", "Language")}: ${translate("Français", "French")}</p>
            <a class="btn" href="https://www.bibledejesuschrist.org/lire.html" target="_blank" >${translate("Lire en ligne", "Read online")}</a>
          </div>`;
    }


    if (pageLivres.length === 0) {
      bookList.innerHTML = `<p style="color:#DE8717;">${translate(
        "Aucun résultat pour ces critères.",
        "No results for these criteria.",
      )}</p>`;
      pageInfo.textContent = "Page 0";
      return;
    }

    pageLivres.forEach((livre) => {
      const book = document.createElement("div");
      book.classList.add("book");
      book.innerHTML = `
        <img src="${livre.src}" alt="${translate("Image du livre", "Book cover")}: ${livre.titre}">
        <h3>${livre.titre}</h3>
        <p>${translate("Auteur", "Author")}: ${livre.auteur}</p>
        <p style="font-size:0.85rem;color:#127484;">${translate("Langue", "Language")}: ${livre.langue}</p>
        <a href="${livre.lien}" class="btn" target="_blank">${translate("Ouvrir", "Open")}</a>
      `;
      bookList.appendChild(book);
    });

    const totalPages = Math.ceil(livresFiltres.length / livresParPage);
    pageInfo.textContent = `Page ${currentPage} / ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  function appliquerFiltres(maj = true) {
    const texte = searchInput.value.toLowerCase();
    const auteurSel = authorFilter.value;
    const langueSel = langFilter.value;

    // 🔍 Vérifie s’il y a une recherche ou un filtre actif
    rechercheActive =
      texte.trim() !== "" || auteurSel !== "" || langueSel !== "";

    livresFiltres = livres.filter((livre) => {
      const matchTexte =
        livre.titre.toLowerCase().includes(texte) ||
        livre.auteur.toLowerCase().includes(texte);
      const matchAuteur = auteurSel ? livre.auteur === auteurSel : true;
      const matchLangue = langueSel ? livre.langue === langueSel : true;
      return matchTexte && matchAuteur && matchLangue;
    });

    const totalPages = Math.ceil(livresFiltres.length / livresParPage);
    if (currentPage > totalPages) currentPage = 1;
    
    afficherLivres();
    if (maj) majURL();
  }

  // --- ÉVÉNEMENTS ---

  searchInput.addEventListener("input", () => {
    currentPage = 1;
    appliquerFiltres();
  });

  authorFilter.addEventListener("change", () => {
    currentPage = 1;
    appliquerFiltres();
  });

  langFilter.addEventListener("change", () => {
    currentPage = 1;
    appliquerFiltres();
  });

  document.addEventListener("qadash:languagechange", () => {
    afficherLivres();
  });

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      afficherLivres();
      majURL();
    }
  });

  nextBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(livresFiltres.length / livresParPage);
    if (currentPage < totalPages) {
      currentPage++;
      afficherLivres();
      majURL();
    }
  });
});
