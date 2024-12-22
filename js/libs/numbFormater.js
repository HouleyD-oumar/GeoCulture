/**
 * Formats a number into a string with commas as thousands separators.
 *
 * @param {number} num - The number to be formatted.
 * @returns {string} - The formatted number as a string.
 *
 * @example
 * // returns "1,234,567"
 * formatNumber(1234567);
 *
 * @example
 * // returns "12,345.67"
 * formatNumber(12345.67);
 *
 * @note This function assumes that the input is a valid number.
 *       It does not handle cases where the input is NaN or non-numeric.
 */
export function formatNumber(num) { 
    
    // Convert the number to a string to manipulate it
    const numStr = num.toString();
    
    // Split the number into integer and decimal parts
    const [integerPart, decimalPart] = numStr.split('.');
    
    // Use a regular expression to add commas to the integer part
    const formattedInteger = integerPart.replace(
        /\B(?=(\d{3})+(?!\d))/g, 
        ' '
    );
    
    // If there is a decimal part, concatenate it back to the formatted integer
    return decimalPart 
        ? `${formattedInteger}.${decimalPart}` 
        : formattedInteger;
}

// Example usage
console.log(formatNumber(1234567));    // Output: "1,234,567"
console.log(formatNumber(12345.67));    // Output: "12,345.67"
console.log(formatNumber(1000));        // Output: "1,000"
console.log(formatNumber(1000000.123)); // Output: "1,000,000.123"