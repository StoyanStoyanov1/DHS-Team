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

export const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
        return 'Email is required';
    }

    if (!EMAIL_REGEX.test(email)) {
        return 'Please enter a valid email address';
    }

    return null;
};

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

export const validatePasswordMatch = (password: string, confirmPassword: string): string | null => {
    if (password !== confirmPassword) {
        return 'Passwords do not match';
    }

    return null;
};

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