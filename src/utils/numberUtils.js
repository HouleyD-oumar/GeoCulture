import { i18n } from '../i18n';

/**
 * Format a number according to the user's current language
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return 'N/A';
  
  // Use the current i18n language
  const locale = i18n.language || 'en';
  
  return num.toLocaleString(locale);
};