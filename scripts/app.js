// Service Worker Registration
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("../sw.js")
    .then((reg) => console.log("✅ Service Worker registered :", reg))
    .catch((err) => console.error("❌ Service Worker not registered :", err));
}

// Detect when a new SW is available and ask the user to reload the page
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    alert("Une nouvelle version du site est disponible. Rechargez la page !");
  });
}

