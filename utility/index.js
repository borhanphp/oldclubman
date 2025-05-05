import Cookies from 'js-cookie';

/**
 * Safely retrieves data from localStorage
 * @param {string} key - The localStorage key to retrieve
 * @param {any} defaultValue - Default value to return if key doesn't exist or on error
 * @returns {any} The stored value or defaultValue
 */
export const getLocal = (key, defaultValue = null) => {
  if (typeof window === 'undefined') return defaultValue;
  
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    
    // Try to parse JSON, return as-is if it fails
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Safely stores data in localStorage
 * @param {string} key - The localStorage key to set
 * @param {any} value - The value to store
 * @returns {boolean} True if successful, false otherwise
 */
export const setLocal = (key, value) => {
  if (typeof window === 'undefined') return false;
  
  try {
    // Convert non-string values to JSON
    const valueToStore = typeof value === 'string' 
      ? value 
      : JSON.stringify(value);
    
    localStorage.setItem(key, valueToStore);
    return true;
  } catch (error) {
    console.error(`Error storing ${key} in localStorage:`, error);
    return false;
  }
};

/**
 * Clears all authentication data (localStorage and cookies)
 * @param {Array<string>} [specificKeys=['old_token']] - Specific localStorage keys to clear
 * @param {Array<string>} [specificCookies=['old_token']] - Specific cookies to clear
 * @param {boolean} [shouldReload=true] - Whether to reload the page after logout
 * @returns {boolean} True if successful, false if any operations fail
 */
export const logout = (specificKeys = ['old_token'], specificCookies = ['old_token'], shouldReload = true) => {
  if (typeof window === 'undefined') return false;
  
  try {
    // Clear localStorage items
    if (specificKeys.length === 0) {
      // Clear all localStorage if no specific keys provided
      localStorage.clear();
    } else {
      // Clear only specific keys
      specificKeys.forEach(key => localStorage.removeItem(key));
    }
    
    // Clear cookies using js-cookie
    if (specificCookies.length > 0) {
      specificCookies.forEach(cookieName => {
        Cookies.remove(cookieName, { path: '/' });
      });
    }
    
    // Reload the page to apply the logged out state
    if (shouldReload) {
      window.location.href = '/auth/login';
    }
    
    return true;
  } catch (error) {
    console.error('Error during logout:', error);
    return false;
  }
};
