import { useEffect } from 'react';

export const useAccessibilityCheck = (enabled = true) => {
  useEffect(() => {
    if (!enabled || process.env.NODE_ENV !== 'development') return;
    
    // Vérification des éléments sans label
    const checkMissingLabels = () => {
      document.querySelectorAll('button, a, input, select, textarea').forEach((element) => {
        if (!element.hasAttribute('aria-label') && !element.textContent.trim() && !element.hasAttribute('aria-labelledby')) {
          console.warn('Element without accessible label detected:', element);
        }
      });
    };

    // Vérification du contraste
    const checkContrast = () => {
      const contrastRatio = (color1, color2) => {
        // Fonction pour calculer le contraste
        const luminance = (color) => {
          const rgb = color.match(/\d+/g).map(Number);
          return (0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]) / 255;
        };
        const lum1 = luminance(color1);
        const lum2 = luminance(color2);
        return lum1 > lum2 ? (lum1 + 0.05) / (lum2 + 0.05) : (lum2 + 0.05) / (lum1 + 0.05);
      };

      const bodyStyles = getComputedStyle(document.body);
      const contrast = contrastRatio(bodyStyles.color, bodyStyles.backgroundColor);
      if (contrast < 4.5) {
        console.warn('Insufficient contrast detected:', contrast);
      }
    };

    // Vérification des images sans alt
    const checkImagesWithoutAlt = () => {
      document.querySelectorAll('img').forEach((img) => {
        if (!img.hasAttribute('alt')) {
          console.warn('Image without alt attribute detected:', img);
        }
      });
    };

    // Exécuter les vérifications
    const runChecks = () => {
      checkMissingLabels();
      checkContrast();
      checkImagesWithoutAlt();
    };

    // Exécuter les vérifications après le chargement initial
    runChecks();

    // Observer les changements DOM pour vérifier les nouveaux éléments
    const observer = new MutationObserver(runChecks);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [enabled]);
};

export default useAccessibilityCheck;