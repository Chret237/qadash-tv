// Service Worker Registration
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/scripts/sw.js")
    .then((reg) => console.log("✅ Service Worker PWA enregistré :", reg))
    .catch((err) => console.error("❌ Erreur Service Worker :", err));
}
