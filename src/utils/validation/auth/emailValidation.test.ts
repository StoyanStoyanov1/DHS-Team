import { EmailValidation } from './emailValidation';

describe('EmailValidation', () => {
  test('should validate correct email formats', () => {
    const validEmails = [
      'test@example.com',
      'test.name@example.com',
      'test+name@example.com',
      'test@subdomain.example.com',
      'test@example-domain.com',
      'test123@example.com'
    ];

    validEmails.forEach(email => {
      const result = EmailValidation(email);
      expect(result.emailIsValid).toBe(true);
    });
  });

  test('should reject incorrect email formats', () => {
    const invalidEmails = [
      'test@example',
      'test.example.com',
      '@example.com',
      'test@.com',
      'test@com',
      'test@example.',
      'test space@example.com',
      'test..name@example.com',
      'test@example..com'
    ];

    invalidEmails.forEach(email => {
      const result = EmailValidation(email);
      expect(result.emailIsValid).toBe(false);
    });
  });

  test('should handle empty string', () => {
    const result = EmailValidation('');
    expect(result.emailIsValid).toBe(false);
  });

  test('should handle email with valid special characters', () => {
    const result = EmailValidation('test.name+filter@example.com');
    expect(result.emailIsValid).toBe(true);
  });
}); 