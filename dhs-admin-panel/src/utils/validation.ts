// src/utils/validation.ts
export interface ValidationResult {
    valid: boolean;
    errors: { [key: string]: string };
}

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Password validation regex - requires at least 8 characters, one uppercase letter,
// one lowercase letter, one number, and one special character
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Validate an email address.
 * @param email - The email address to validate.
 * @returns An error message if invalid, or null if valid.
 */
export const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
        return 'Email is required';
    }

    if (!EMAIL_REGEX.test(email)) {
        return 'Please enter a valid email address';
    }

    return null;
};

/**
 * Validate a password for complexity requirements.
 * @param password - The password to validate.
 * @returns An error message if invalid, or null if valid.
 */
export const validatePassword = (password: string): string | null => {
    if (!password) {
        return 'Password is required';
    }

    if (password.length < 8) {
        return 'Password must be at least 8 characters long';
    }

    if (!PASSWORD_REGEX.test(password)) {
        return 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character';
    }

    return null;
};

/**
 * Validate if two passwords match.
 * @param password - The original password.
 * @param confirmPassword - The confirmation password.
 * @returns An error message if passwords do not match, or null if they match.
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): string | null => {
    if (password !== confirmPassword) {
        return 'Passwords do not match';
    }

    return null;
};

/**
 * Validate the login form inputs.
 * @param email - The email address provided by the user.
 * @param password - The password provided by the user.
 * @returns A ValidationResult object containing validation status and errors.
 */
export const validateLoginForm = (email: string, password: string): ValidationResult => {
    const errors: { [key: string]: string } = {};

    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;

    // Only check if password is empty, no complexity validation for login
    if (!password) {
        errors.password = 'Password is required';
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Validate the registration form inputs.
 * @param email - The email address provided by the user.
 * @param password - The password provided by the user.
 * @param confirmPassword - The confirmation password provided by the user.
 * @returns A ValidationResult object containing validation status and errors.
 */
export const validateRegistrationForm = (
    email: string,
    password: string,
    confirmPassword: string
): ValidationResult => {
    const errors: { [key: string]: string } = {};

    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) errors.password = passwordError;

    const passwordMatchError = validatePasswordMatch(password, confirmPassword);
    if (passwordMatchError) errors.confirmPassword = passwordMatchError;

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};