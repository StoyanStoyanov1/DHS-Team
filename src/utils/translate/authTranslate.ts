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
    loginToYourAccount: string;
    enterYourPassword: string;
    login: string;
    orContinueWith: string;
    forgotYourPassword: string;
    welcomeBack: string;
    noAccount: string;
    yourPasswordIs: string;
    veryWeak: string;
    weak: string;
    average: string;
    strong: string;
    veryStrong: string;
    passwordsDoNotMatch: string;
    passwordDoesNotMeetRequirements: string;
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
        emailFormat: "Valid format user@domain.com",
        loginToYourAccount: "Login to your account",
        enterYourPassword: "Enter Your Password",
        login: "Login",
        orContinueWith: "Or continue with",
        forgotYourPassword: "Forgot Your Password?",
        welcomeBack: "Great to have you back! Just enter your details and let's get started.",
        noAccount: "Don't have an account? Join our book community in a few easy steps.",
        yourPasswordIs: "Your password is",
        veryWeak: "Very weak",
        weak: "Weak",
        average: "Average",
        strong: "Strong",
        veryStrong: "Very strong",
        passwordsDoNotMatch: "Passwords do not match",
        passwordDoesNotMeetRequirements: "Your password does not meet the minimum security requirements."
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
        emailFormat: "Валиден формат user@domain.com",
        loginToYourAccount: "Влезте в акаунта си",
        enterYourPassword: "Въведете паролата си",
        login: "Вход",
        orContinueWith: "Или продължете с",
        forgotYourPassword: "Забравена парола?",
        welcomeBack: "Супер, че се върнахте! Просто въведете данните си и нека започнем.",
        noAccount: "Нямате акаунт? Присъединете се към нашето книжно общество с няколко лесни стъпки.",
        yourPasswordIs: "Вашата парола е",
        veryWeak: "Много слаба",
        weak: "Слаба",
        average: "Средно",
        strong: "Силна",
        veryStrong: "Много силна",
        passwordsDoNotMatch: "Паролите не съвпадат",
        passwordDoesNotMeetRequirements: "Паролата Ви не отговаря на минималните изисквания за сигурност."
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
        emailFormat: "Gültigen Format user@domain.com",
        loginToYourAccount: "Melden Sie sich bei Ihrem Konto an",
        enterYourPassword: "Geben Sie Ihr Passwort ein",
        login: "Anmelden",
        orContinueWith: "Oder fahren Sie fort mit",
        forgotYourPassword: "Passwort vergessen?",
        welcomeBack: "Super, dass du zurück bist! Gib einfach deine Daten ein und lass uns loslegen.",
        noAccount: "Kein Konto? Tritt unserer Buchgemeinschaft in wenigen einfachen Schritten bei.",
        yourPasswordIs: "Ihr Passwort ist",
        veryWeak: "Sehr schwach",
        weak: "Schwach",
        average: "Durchschnitt",
        strong: "Stark",
        veryStrong: "Sehr stark",
        passwordsDoNotMatch: "Passwörter stimmen nicht überein",
        passwordDoesNotMeetRequirements: "Ihr Passwort entspricht nicht den Mindestanforderungen an die Sicherheit. Bitte stellen Sie sicher, dass es mindestens 8 Zeichen enthält, darunter Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen."
    },
};

export default authTranslate;
