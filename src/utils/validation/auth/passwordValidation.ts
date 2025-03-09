export interface PasswordValidationInterface {
    hasUpperCase: boolean;
    hasLowerCase: boolean;
    hasNumbers: boolean;
    hasMinLength: boolean;
    hasSpecialChar: boolean;
  }
  
export const passwordValidation = (password: string): PasswordValidationInterface => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasMinLength = password.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    return {
      hasUpperCase,
      hasLowerCase,
      hasNumbers,
      hasMinLength,
      hasSpecialChar,
    };
};