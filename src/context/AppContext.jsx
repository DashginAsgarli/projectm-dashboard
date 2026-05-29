import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AppContext = createContext();

export const emptyBoard = {
    tasks: {},
    columns: {},
    columnOrder: [],
};

export const translations = {
    az: {
        searchPlaceholder: "Axtar...",
        welcomeBack: "Xoş gəldiniz",
        createAccount: "Hesab Yarat",
        name: "Ad Soyad",
        email: "E-poçt",
        password: "Şifrə",
        loginBtn: "Daxil Ol",
        registerBtn: "Qeydiyyatdan Keç",
        minPassword: "Şifrə ən azı 6 simvoldan ibarət olmalıdır!",
        statsTotal: "Ümumi",
        statsInProgress: "Gözləyən",
        statsDone: "Tamamlanan",
        statsProjects: "Layihələr",
        memberManagement: "Üzv İdarəetməsi",
        inviteMember: "Üzv Əlavə Et",
        memberList: "Üzv Siyahısı",
        cancel: "Ləğv Et",
        sendInvite: "Dəvət Et",
        memberAdded: "Üzv dəvət edildi!",
        all: "Hamısı",
        low: "Aşağı",
        medium: "Orta",
        high: "Yüksək",
        done: "Bitənlər",
        addColumn: "Sütun Əlavə Et",
        columnAdded: "Sütun əlavə edildi!",
        columnDeleted: "Sütun silindi!",
        projectDeleted: "Layihə silindi!",
        profileSaved: "Profil yadda saxlanıldı!",
        addProject: "Yeni Layihə",
        projectAdded: "Layihə yaradıldı!",
        addTask: "Tapşırıq Əlavə Et",
        taskSaved: "Tapşırıq yadda saxlanıldı!",
        taskDeleted: "Tapşırıq silindi!",
        title: "Başlıq",
        description: "Açıqlama",
        priority: "Prioritet",
        dueDate: "Bitmə Tarixi",
        imageUrl: "Şəkil URL",
        resourceLink: "Keçid Linki",
        logoutConfirm: "Çıxış etmək istədiyinizdən əminsiniz?",
        yes: "Bəli",
        no: "Xeyr",
        deleteColumnConfirm: "Bu sütunu silmək istədiyinizdən əminsiniz?",
        deleteProjectConfirm: "Bu layihəni silmək istədiyinizdən əminsiniz?",
        tasks: "Tapşırıqlar",
        messages: "Mesajlar",
        members: "Üzvlər",
        logout: "Çıxış",
        login: "Daxil Ol",
        register: "Qeydiyyat",
        guestMode: "Qonaq rejimi",
        loginRegister: "Daxil ol / Qeydiyyat",
        editCard: "Tapşırığı Redaktə Et",
        addCard: "Yeni Tapşırıq",
        save: "Yadda Saxla",
        taskName: "Tapşırıq Adı",
        completed: "Tamamlandı",
        delete: "Sil",
        projects: "Layihələr",
        noProject: "Aktiv layihə tapılmadı",
        noProjectDesc: "Sol paneldən layihə seçin və ya yeni layihə yaradın.",
        shareProject: "Paylaş / Üzvlər",
        addColumnBtn: "Sütun Əlavə Et",
        noMembers: "Hələ heç bir üzv yoxdur",
        noMembersDesc: "Layihə içərisindən üzv dəvət edin.",
        pending: "Gözləmədə",
        approve: "Təsdiqlə",
        approved: "Təsdiqləndi",
        position: "Vəzifə",
        profilePhoto: "Profil Şəkli",
        changePhoto: "Şəkil dəyiş",
        fullName: "Ad Soyad",
        noMessages: "Hələ heç bir mesaj yoxdur. İlk mesajı sən yaz!",
        typeMessage: "Mesajınızı bura yazın...",
        teamChat: "Komanda Çatı",
        activeChat: "Aktiv Yazışma",
        enterAsGuest: "Qonaq kimi daxil ol",
        alreadyHaveAccount: "Hesabınız var?",
        dontHaveAccount: "Hesabınız yoxdur?",
        closeModal: "Bağla",
    },
    en: {
        searchPlaceholder: "Search...",
        welcomeBack: "Welcome back",
        createAccount: "Create Account",
        name: "Full Name",
        email: "Email",
        password: "Password",
        loginBtn: "Login",
        registerBtn: "Register",
        minPassword: "Password must be at least 6 characters!",
        statsTotal: "Total",
        statsInProgress: "Pending",
        statsDone: "Completed",
        statsProjects: "Projects",
        memberManagement: "Member Management",
        inviteMember: "Add Member",
        memberList: "Member List",
        cancel: "Cancel",
        sendInvite: "Invite",
        memberAdded: "Member invited!",
        all: "All",
        low: "Low",
        medium: "Medium",
        high: "High",
        done: "Done",
        addColumn: "Add Column",
        columnAdded: "Column added!",
        columnDeleted: "Column deleted!",
        projectDeleted: "Project deleted!",
        profileSaved: "Profile saved!",
        addProject: "New Project",
        projectAdded: "Project created!",
        addTask: "Add Task",
        taskSaved: "Task saved!",
        taskDeleted: "Task deleted!",
        title: "Title",
        description: "Description",
        priority: "Priority",
        dueDate: "Due Date",
        imageUrl: "Image URL",
        resourceLink: "Resource Link",
        logoutConfirm: "Are you sure you want to logout?",
        yes: "Yes",
        no: "No",
        deleteColumnConfirm: "Are you sure you want to delete this column?",
        deleteProjectConfirm: "Are you sure you want to delete this project?",
        tasks: "Tasks",
        messages: "Messages",
        members: "Members",
        logout: "Logout",
        login: "Login",
        register: "Register",
        guestMode: "Guest mode",
        loginRegister: "Login / Register",
        editCard: "Edit Task",
        addCard: "New Task",
        save: "Save",
        taskName: "Task Name",
        completed: "Completed",
        delete: "Delete",
        projects: "Projects",
        noProject: "No active project",
        noProjectDesc: "Select a project from the sidebar or create a new one.",
        shareProject: "Share / Members",
        addColumnBtn: "Add Column",
        noMembers: "No members yet",
        noMembersDesc: "Invite members from within the project.",
        pending: "Pending",
        approve: "Approve",
        approved: "Approved",
        position: "Position",
        profilePhoto: "Profile Photo",
        changePhoto: "Change photo",
        fullName: "Full Name",
        noMessages: "No messages yet. Be the first!",
        typeMessage: "Type your message here...",
        teamChat: "Team Chat",
        activeChat: "Active Chat",
        enterAsGuest: "Enter as Guest",
        alreadyHaveAccount: "Already have an account?",
        dontHaveAccount: "Don't have an account?",
        closeModal: "Close",
    },
    ru: {
        searchPlaceholder: "Поиск...",
        welcomeBack: "Добро пожаловать",
        createAccount: "Создать аккаунт",
        name: "Имя Фамилия",
        email: "Электронная почта",
        password: "Пароль",
        loginBtn: "Войти",
        registerBtn: "Зарегистрироваться",
        minPassword: "Пароль должен содержать не менее 6 символов!",
        statsTotal: "Всего",
        statsInProgress: "В процессе",
        statsDone: "Завершено",
        statsProjects: "Проекты",
        memberManagement: "Управление участниками",
        inviteMember: "Добавить участника",
        memberList: "Список участников",
        cancel: "Отмена",
        sendInvite: "Пригласить",
        memberAdded: "Участник приглашён!",
        all: "Все",
        low: "Низкий",
        medium: "Средний",
        high: "Высокий",
        done: "Завершённые",
        addColumn: "Добавить столбец",
        columnAdded: "Столбец добавлен!",
        columnDeleted: "Столбец удалён!",
        projectDeleted: "Проект удалён!",
        profileSaved: "Профиль сохранён!",
        addProject: "Новый проект",
        projectAdded: "Проект создан!",
        addTask: "Добавить задачу",
        taskSaved: "Задача сохранена!",
        taskDeleted: "Задача удалена!",
        title: "Заголовок",
        description: "Описание",
        priority: "Приоритет",
        dueDate: "Срок",
        imageUrl: "URL изображения",
        resourceLink: "Ссылка",
        logoutConfirm: "Вы уверены, что хотите выйти?",
        yes: "Да",
        no: "Нет",
        deleteColumnConfirm: "Вы уверены, что хотите удалить этот столбец?",
        deleteProjectConfirm: "Вы уверены, что хотите удалить этот проект?",
        tasks: "Задачи",
        messages: "Сообщения",
        members: "Участники",
        logout: "Выйти",
        login: "Войти",
        register: "Регистрация",
        guestMode: "Гостевой режим",
        loginRegister: "Войти / Регистрация",
        editCard: "Редактировать задачу",
        addCard: "Новая задача",
        save: "Сохранить",
        taskName: "Название задачи",
        completed: "Завершено",
        delete: "Удалить",
        projects: "Проекты",
        noProject: "Активный проект не найден",
        noProjectDesc: "Выберите проект на боковой панели или создайте новый.",
        shareProject: "Поделиться / Участники",
        addColumnBtn: "Добавить столбец",
        noMembers: "Участников пока нет",
        noMembersDesc: "Пригласите участников из проекта.",
        pending: "Ожидает",
        approve: "Подтвердить",
        approved: "Подтверждён",
        position: "Должность",
        profilePhoto: "Фото профиля",
        changePhoto: "Изменить фото",
        fullName: "Имя Фамилия",
        noMessages: "Пока нет сообщений. Напишите первым!",
        typeMessage: "Напишите сообщение...",
        teamChat: "Командный чат",
        activeChat: "Активный чат",
        enterAsGuest: "Войти как гость",
        alreadyHaveAccount: "Уже есть аккаунт?",
        dontHaveAccount: "Нет аккаунта?",
        closeModal: "Закрыть",
    },
};

export function AppProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isGuest, setIsGuest] = useState(true); // starts as guest
    const [authModal, setAuthModal] = useState(null); // 'login' | 'register' | null
    const [page, setPage] = useState("tasks");
    const [language, setLanguage] = useState("az");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterPriority, setFilterPriority] = useState("All");
    const [toasts, setToasts] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [user, setUser] = useState({
        name: "",
        email: "",
        role: "",
        avatar: "",
    });

    const [projects, setProjects] = useState([]);
    const [activeProjectId, setActiveProjectId] = useState("");
    const [board, setBoard] = useState(emptyBoard);
    const [messages, setMessages] = useState([]);

    const t = translations[language] || translations.az;

    useEffect(() => {
        if (activeProjectId) {
            setProjects((prev) =>
                prev.map((p) => (p.id === activeProjectId ? { ...p, boardData: board } : p))
            );
        }
    }, [board]);

    const showToast = useCallback((text, type = "success") => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, text, type }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    }, []);

    const handleLogout = useCallback(() => {
        setIsLoggedIn(false);
        setIsGuest(true);
        setUser({ name: "", email: "", role: "", avatar: "" });
        setProjects([]);
        setActiveProjectId("");
        setBoard(emptyBoard);
        setMessages([]);
        setPage("tasks");
    }, []);

    const enterAsGuest = useCallback(() => {
        setIsGuest(true);
        setIsLoggedIn(false);
        setAuthModal(null);
    }, []);

    return (
        <AppContext.Provider
            value={{
                isLoggedIn, setIsLoggedIn,
                isGuest, setIsGuest,
                authModal, setAuthModal,
                page, setPage,
                language, setLanguage,
                searchQuery, setSearchQuery,
                filterPriority, setFilterPriority,
                toasts, showToast,
                user, setUser,
                projects, setProjects,
                activeProjectId, setActiveProjectId,
                board, setBoard,
                emptyBoard,
                messages, setMessages,
                sidebarOpen, setSidebarOpen,
                handleLogout,
                enterAsGuest,
                t,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}