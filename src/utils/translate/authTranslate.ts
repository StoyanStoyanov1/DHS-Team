interface AuthTranslate {
    register: string;
    createAccount: string;
    email: string;
    password: string;
    confirmPassword: string;
    passwordLength: string; 
    passwordUppercase: string; 
    passwordLowercase: string; 
    passwordNumber: string; 
    emailFormat: string;
}

interface LanguageAuthTranslate {
    [key: string]: AuthTranslate;
}

const authTranslate: LanguageAuthTranslate = {
    en: {
        register: "Register",
        createAccount: "Create Account",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
        passwordLength: "Password: Min 8 characters", 
        passwordUppercase: "Password: At least one uppercase letter", 
        passwordLowercase: "Password: At least one lowercase letter", 
        passwordNumber: "Password: At least one number", 
        emailFormat: "Email: valid format user@domain.com",
    },
    bg: {
        register: "Регистрация",
        createAccount: "Създай акаунт",
        email: "Имейл",
        password: "Парола",
        confirmPassword: "Потвърди паролата",
        passwordLength: "Парола: Мин. 8 символа",
        passwordUppercase: "Парола: Поне една главна буква",
        passwordLowercase: "Парола: Поне една малка буква",
        passwordNumber: "Парола: Поне една цифра",
        emailFormat: "Имейл: Валиден формат user@domain.com", 
    },
    de: {
        register: "Registrieren",
        createAccount: "Konto erstellen",
        email: "E-Mail",
        password: "Passwort",
        confirmPassword: "Passwort bestätigen",
        passwordLength: "Passwort: Mind. 8 Zeichen",
        passwordUppercase: "Passwort: Mind. ein Großbuchstabe",
        passwordLowercase: "Passwort: Mind. ein Kleinbuchstabe",
        passwordNumber: "Passwort: Mind. eine Zahl",
        emailFormat: "E-Mail: gültigen Format user@domain.com", 
    },
};

export default authTranslate;
