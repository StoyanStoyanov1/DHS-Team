interface AuthTranslate {
    register: string;
    createAccount: string;
    email: string;
    password: string;
    confirmPassword: string;
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
    },
    bg: {
        register: "Регистрация",
        createAccount: "Създай акаунт",
        email: "Имейл",
        password: "Парола",
        confirmPassword: "Потвърди паролата",
    },
    de: {
        register: "Registrieren",
        createAccount: "Konto erstellen",
        email: "E-Mail",
        password: "Passwort",
        confirmPassword: "Passwort bestätigen",
    },
};


export default authTranslate;