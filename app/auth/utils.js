/**
 * Authentication utilities to support the middleware and auth components
 */

import { cookies } from 'next/headers';

// JWT token expiration time (in seconds)
const TOKEN_EXPIRATION = 60 * 60 * 24 * 7; // 7 days

/**
 * Set the authentication token in cookies
 * @param {string} token - JWT token
 * @param {boolean} remember - Whether to set a longer expiration
 */
export function setAuthToken(token, remember = false) {
  const cookieStore = cookies();
  const expiration = remember ? TOKEN_EXPIRATION * 4 : TOKEN_EXPIRATION; // 4x longer if remember me is checked
  
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: expiration,
    path: '/',
    sameSite: 'strict',
  });
}

/**
 * Get the authentication token from cookies
 * @returns {string|null} The token or null if not found
 */
export function getAuthToken() {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token');
  return token?.value || null;
}

/**
 * Remove the authentication token (logout)
 */
export function removeAuthToken() {
  const cookieStore = cookies();
  cookieStore.delete('auth_token');
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
export function isAuthenticated() {
  return !!getAuthToken();
}

/**
 * Parse and validate JWT token
 * @param {string} token - JWT token to validate
 * @returns {object|null} Decoded token payload or null if invalid
 */
export function parseToken(token) {
  if (!token) return null;
  
  try {
    // Split the token and get the payload part
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    // Decode the payload
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;
    
    return payload;
  } catch (error) {
    console.error('Token parsing error:', error);
    return null;
  }
}

/**
 * Get user info from the token
 * @returns {object|null} User information or null if not authenticated
 */
export function getCurrentUser() {
  const token = getAuthToken();
  if (!token) return null;
  
  const payload = parseToken(token);
  return payload;
} 