/**
 * Login Required Error
 * Thrown when a user tries to access a resource that requires a login and not
 * already authenticated
 */
export const LOGIN_REQUIRED = new Error("Login Required");

/**
 * Invalid Credentials Error
 * Thrown when a user tries to login with invalid credentials
 */
export const INVALID_CREDENTIALS = new Error("Invalid Credentials");
