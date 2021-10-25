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

/**
 * Not Implimented Error
 * Thrown when a user tries to access a resource that is not yet implimented
 */
export const NOT_IMPLIMENTED = new Error("Not Implimented");
