/**
 * Generate a stable key for React list items
 * @param {string} prefix - A prefix for the key
 * @param {any} id - The unique identifier
 * @param {number} index - The index in the array (fallback)
 * @returns {string} A stable key for React
 */
export const generateKey = (prefix, id, index) => {
  if (id !== undefined && id !== null) {
    return `${prefix}-${id}`;
  }
  return `${prefix}-index-${index}`;
};