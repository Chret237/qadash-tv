if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => {
      console.log("Service Worker enregistré :", registration);

      // Vérifie s'il y a une mise à jour disponible
      registration.onupdatefound = () => {
        const newWorker = registration.installing;
        newWorker.onstatechange = () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // Alerte visuelle simple
            const reloadBanner = document.createElement("div");
            reloadBanner.style.cssText = `
            position: fixed; bottom: 0; left: 0; right: 0;
            background: #127484; color: white; text-align: center;
            padding: 1rem; font-weight: 600; z-index: 9999;
          `;
            reloadBanner.textContent =
              "Une nouvelle version du site est disponible. Cliquez pour recharger.";
            reloadBanner.style.cursor = "pointer";
            reloadBanner.onclick = () => {
              newWorker.postMessage({ type: "SKIP_WAITING" });
              window.location.reload();
            };
            document.body.appendChild(reloadBanner);
          }
        };
      };
    })
    .catch((err) => console.error("❌ Erreur Service Worker :", err));
}
