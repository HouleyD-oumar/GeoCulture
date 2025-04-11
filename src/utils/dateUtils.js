import i18n from '../i18n';

/**
 * Format a date string according to the user's current language
 * @param {string|Date} dateString - The date to format
 * @param {Object} options - Date formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const defaultOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  // Use the current i18n language
  const locale = i18n.language || 'en';
  
  return date.toLocaleDateString(locale, { ...defaultOptions, ...options });
};

/**
 * Format a date with time according to the user's current language
 * @param {string|Date} dateString - The date to format
 * @param {Object} options - Date formatting options
 * @returns {string} Formatted date and time string
 */
export const formatDateTime = (dateString, options = {}) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const defaultOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  // Use the current i18n language
  const locale = i18n.language || 'en';
  
  return date.toLocaleDateString(locale, { ...defaultOptions, ...options });
};