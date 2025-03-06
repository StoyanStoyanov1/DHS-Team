interface MenuTranslate {
    
    menu: string;
    myBooks: string;
    favoriteBooks: string;
    favoriteGenres: string;
    create: string;
    genre: string;
    author: string;
    pendingBooks: string;
    reportedIssues: string;
    users: string;
    support: string;
    settings: string;
    logOut: string;
    logIn: string;
}

interface LanguageMenuTranslate {
    [key: string]: MenuTranslate;
}

const menuTranslate: LanguageMenuTranslate = {
    en: {
        menu: "Menu",
        myBooks: "My Books",
        favoriteBooks: "Favorite Books",
        favoriteGenres: "Favorite Genres",
        create: "Create",
        genre: "Genre",
        author: "Author",
        pendingBooks: "Pending Books",
        reportedIssues: "Reported Issues",
        users: "Users",
        support: "Support",
        settings: "Settings",
        logOut: "Log Out",
        logIn: "Log In",
    },
    bg: {
        menu: "Меню",
        myBooks: "Моите книги",
        favoriteBooks: "Любими книги",
        favoriteGenres: "Любими жанрове",
        create: "Създай",
        genre: "Жанр",
        author: "Автор",
        pendingBooks: "Чакащи книги",
        reportedIssues: "Докладвани проблеми",
        users: "Потребители",
        support: "Поддръжка",
        settings: "Настройки",
        logOut: "Излез",
        logIn: "Вход",
    },
    de: {
        menu: "Menü",
        myBooks: "Meine Bücher",
        favoriteBooks: "Favoriten Bücher",
        favoriteGenres: "Favoriten Genres",
        create: "Erstellen",
        genre: "Genre",
        author: "Autor",
        pendingBooks: "Ausstehende Bücher",
        reportedIssues: "Gemeldete Probleme",
        users: "Benutzer",
        support: "Unterstützung",
        settings: "Einstellungen",
        logOut: "Abmelden",
        logIn: "Einloggen",
    },
};

export default menuTranslate;
