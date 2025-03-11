import { passwordValidation } from './passwordValidation';

describe('passwordValidation', () => {
  test('should validate a strong password correctly', () => {
    const strongPassword = 'Test123!@#';
    const result = passwordValidation(strongPassword);
    
    expect(result.hasUpperCase).toBe(true);
    expect(result.hasLowerCase).toBe(true);
    expect(result.hasNumbers).toBe(true);
    expect(result.hasMinLength).toBe(true);
    expect(result.hasSpecialChar).toBe(true);
  });

  test('should fail validation for a password without uppercase', () => {
    const weakPassword = 'test123!@#';
    const result = passwordValidation(weakPassword);
    
    expect(result.hasUpperCase).toBe(false);
    expect(result.hasLowerCase).toBe(true);
    expect(result.hasNumbers).toBe(true);
    expect(result.hasMinLength).toBe(true);
    expect(result.hasSpecialChar).toBe(true);
  });

  test('should fail validation for a short password', () => {
    const shortPassword = 'Te1!';
    const result = passwordValidation(shortPassword);
    
    expect(result.hasMinLength).toBe(false);
  });

  test('should fail validation for a password without numbers', () => {
    const noNumberPassword = 'TestTest!@';
    const result = passwordValidation(noNumberPassword);
    
    expect(result.hasNumbers).toBe(false);
  });

  test('should fail validation for a password without special characters', () => {
    const noSpecialPassword = 'TestTest123';
    const result = passwordValidation(noSpecialPassword);
    
    expect(result.hasSpecialChar).toBe(false);
  });
}); 