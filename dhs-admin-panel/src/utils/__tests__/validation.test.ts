// src/utils/__tests__/validation.test.ts
import {
  validateEmail,
  validatePassword,
  validatePasswordMatch,
  validateLoginForm,
  validateRegistrationForm
} from '../validation';

describe('Email Validation', () => {
  test('should return error for empty email', () => {
    expect(validateEmail('')).toBe('Email is required');
  });

  test('should return error for invalid email format', () => {
    expect(validateEmail('not-an-email')).toBe('Please enter a valid email address');
    expect(validateEmail('test@')).toBe('Please enter a valid email address');
    expect(validateEmail('test@example')).toBe('Please enter a valid email address');
  });

  test('should return null for valid email', () => {
    expect(validateEmail('test@example.com')).toBeNull();
    expect(validateEmail('user.name+tag@example.co.uk')).toBeNull();
  });
});

describe('Password Validation', () => {
  test('should return error for empty password', () => {
    expect(validatePassword('')).toBe('Password is required');
  });

  test('should return error for short password', () => {
    expect(validatePassword('Abc1!')).toBe('Password must be at least 8 characters long');
  });

  test('should return error for password without uppercase letter', () => {
    expect(validatePassword('password1!')).toBe(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    );
  });

  test('should return error for password without lowercase letter', () => {
    expect(validatePassword('PASSWORD1!')).toBe(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    );
  });

  test('should return error for password without number', () => {
    expect(validatePassword('Password!')).toBe(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    );
  });

  test('should return error for password without special character', () => {
    expect(validatePassword('Password1')).toBe(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    );
  });

  test('should return null for valid password', () => {
    expect(validatePassword('Password1!')).toBeNull();
    expect(validatePassword('StrongP@ss123')).toBeNull();
  });
});

describe('Password Match Validation', () => {
  test('should return error when passwords do not match', () => {
    expect(validatePasswordMatch('Password1!', 'Password2!')).toBe('Passwords do not match');
  });

  test('should return null when passwords match', () => {
    expect(validatePasswordMatch('Password1!', 'Password1!')).toBeNull();
  });
});

describe('Login Form Validation', () => {
  test('should return validation errors for empty form', () => {
    const result = validateLoginForm('', '');
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty('email');
    expect(result.errors).toHaveProperty('password');
  });

  test('should return validation error for invalid email', () => {
    const result = validateLoginForm('invalid-email', 'password');
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty('email');
    expect(result.errors.email).toBe('Please enter a valid email address');
  });

  test('should return validation error for empty password', () => {
    const result = validateLoginForm('test@example.com', '');
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty('password');
    expect(result.errors.password).toBe('Password is required');
  });

  test('should validate correct login form', () => {
    const result = validateLoginForm('test@example.com', 'anyPassword');
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });
});

describe('Registration Form Validation', () => {
  test('should return validation errors for empty form', () => {
    const result = validateRegistrationForm('', '', '');
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty('email');
    expect(result.errors).toHaveProperty('password');
  });

  test('should return validation error for invalid email', () => {
    const result = validateRegistrationForm('invalid-email', 'Password1!', 'Password1!');
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty('email');
  });

  test('should return validation error for invalid password', () => {
    const result = validateRegistrationForm('test@example.com', 'password', 'password');
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty('password');
  });

  test('should return validation error for non-matching passwords', () => {
    const result = validateRegistrationForm('test@example.com', 'Password1!', 'Password2!');
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveProperty('confirmPassword');
    expect(result.errors.confirmPassword).toBe('Passwords do not match');
  });

  test('should validate correct registration form', () => {
    const result = validateRegistrationForm('test@example.com', 'Password1!', 'Password1!');
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });
});