// Définition de la fonction reportWebVitals
const reportWebVitals = onPerfEntry => {
  // Vérification si onPerfEntry est une fonction
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Importation de la bibliothèque "web-vitals" de manière asynchrone
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Appel des fonctions de collecte des métriques de performances Web
      getCLS(onPerfEntry);  // Cumulative Layout Shift (CLS)
      getFID(onPerfEntry);  // First Input Delay (FID)
      getFCP(onPerfEntry);  // First Contentful Paint (FCP)
      getLCP(onPerfEntry);  // Largest Contentful Paint (LCP)
      getTTFB(onPerfEntry); // Time to First Byte (TTFB)
    });
  }
};

// Exportation de la fonction reportWebVitals pour une utilisation ailleurs
export default reportWebVitals;
