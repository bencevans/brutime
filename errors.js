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
 * No Course Selected Error
 * Thrown when a user tries to access a timetable without selecting a course
 */
export const NO_COURSES_SELECTED = new Error("No Courses Selected");

/**
 * Too Many Courses Selected Error
 * Thrown when a user tries to select more than eight course due to
 * limitations set by https://teaching.brunel.ac.uk.
 */
export const TOO_MANY_COURSES = new Error("Too Many Courses");

/**
 * Not Implimented Error
 * Thrown when a user tries to access a resource that is not yet implimented
 */
export const NOT_IMPLIMENTED = new Error("Not Implimented");
