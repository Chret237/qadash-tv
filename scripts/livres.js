document.addEventListener("DOMContentLoaded", async () => {
  const bookList = document.querySelector(".book-list");
  const searchInput = document.querySelector("#bookSearch");
  const authorFilter = document.querySelector("#authorFilter");
  const langFilter = document.querySelector("#langFilter");
  const prevBtn = document.querySelector("#prevPage");
  const nextBtn = document.querySelector("#nextPage");
  const pageInfo = document.querySelector("#pageInfo");
  let rechercheActive = false;

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
    bookList.innerHTML = `<p style="color:red;">Impossible de charger les livres.</p>`;
  }

  // --- FONCTIONS ---

  function afficherLivres() {
    bookList.innerHTML = "";

    const debut = (currentPage - 1) * livresParPage;
    const fin = debut + livresParPage;
    const pageLivres = livresFiltres.slice(debut, fin);

    // Met à jour le compteur
    const totalLivres = livresFiltres.length;
    if (totalLivres === 0) {
      compteur.textContent = "Aucun livre trouvé";
    } else if (rechercheActive) {
      document.querySelector("h2").textContent = ''
      document.querySelector(".book1").innerHTML = "";
      compteur.textContent = `${totalLivres} livre${
        totalLivres > 1 ? "s" : ""
      } trouvé${totalLivres > 1 ? "s" : ""}`;
    } else {
      compteur.textContent = "";
      document.querySelector("h2").textContent = 'Recommandé';
      document.querySelector(".book1").innerHTML = `<div class="book">
            <img src="../images/bym.jpg" alt="Bible de Yéhoshoua ha Mashiah" />
            <h3>
              Bible de Yéhoshoua ha Mashiah (BYM)
            </h3>
            <p>Auteur: Shora KUETU</p>
            <p style="color: #127484;">Langue: Français</p>
            <a class="btn" href="https://www.bibledejesuschrist.org/lire.html" target="_blank" >Lire en ligne</a>
          </div>`;
      document.querySelector("h1").textContent = `Tous les Livres (${totalLivres})`;
    }


    if (pageLivres.length === 0) {
      bookList.innerHTML = `<p style="color:#DE8717;">Aucun résultat pour ces critères.</p>`;
      pageInfo.textContent = "Page 0";
      return;
    }

    pageLivres.forEach((livre) => {
      const book = document.createElement("div");
      book.classList.add("book");
      book.innerHTML = `
        <img src="${livre.src}" alt="image du livre ${livre.titre}">
        <h3>${livre.titre}</h3>
        <p>Auteur: ${livre.auteur}</p>
        <p style="font-size:0.85rem;color:#127484;">Langue: ${livre.langue}</p>
        <a href="${livre.lien}" class="btn" target="_blank">Ouvrir</a>
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
