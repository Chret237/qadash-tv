// === GOOGLE TRANSLATE WIDGET ===
function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    {
      pageLanguage: "fr", // langue d'origine du site
      includedLanguages: "fr,en,es,de,it,sw,ar", // langues disponibles
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
      autoDisplay: false,
    },
    "google_translate_element"
  );
}
