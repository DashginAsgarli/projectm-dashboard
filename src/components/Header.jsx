import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { translations } from "../context/AppContext";
import { FiSearch, FiMenu, FiCamera, FiLogIn, FiLogOut, FiUser, FiSettings, FiGlobe } from "react-icons/fi";
import { Input, Btn } from "./UI/FormElements";
import ConfirmModal from "./UI/ConfirmModal";

const LANG_OPTIONS = [
    { code: "az", label: "AZ", flag: "🇦🇿", name: "Azərbaycanca" },
    { code: "en", label: "EN", flag: "🇬🇧", name: "English" },
    { code: "ru", label: "RU", flag: "🇷🇺", name: "Русский" },
];

export default function Header() {
    const { user, setUser, searchQuery, setSearchQuery, t, showToast, setSidebarOpen, isLoggedIn, setAuthModal, handleLogout, language, setLanguage } = useApp();

    const [profileOpen, setProfileOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [logoutConfirm, setLogoutConfirm] = useState(false);
    const [editName, setEditName] = useState(user.name);
    const [editRole, setEditRole] = useState(user.role);
    const profileRef = useRef(null);
    const langRef = useRef(null);

    useEffect(() => {
        function handleClick(e) {
            if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
            if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    useEffect(() => {
        setEditName(user.name);
        setEditRole(user.role);
    }, [user]);

    const handleSaveProfile = (e) => {
        e.preventDefault();
        setUser({ ...user, name: editName, role: editRole });
        showToast(t.profileSaved);
        setProfileOpen(false);
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setUser({ ...user, avatar: reader.result });
            showToast(t.changePhoto + " ✓");
        };
        reader.readAsDataURL(file);
    };

    const avatarSrc = user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "G")}&background=2563eb&color=fff&size=128`;

    const currentLang = LANG_OPTIONS.find((l) => l.code === language) || LANG_OPTIONS[0];

    return (
        <>
            <header className="h-16 bg-white border-b border-gray-100 px-4 lg:px-6 flex items-center justify-between shrink-0 relative z-30">
                <div className="flex items-center gap-3 flex-1 mr-4">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors">
                        <FiMenu className="w-5 h-5" />
                    </button>

                    <div className="relative w-full max-w-xs sm:max-w-sm">
                        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.searchPlaceholder} className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white text-sm text-gray-900 font-medium transition-all" />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative" ref={langRef}>
                        <button onClick={() => setLangOpen(!langOpen)} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors">
                            <span className="text-base">{currentLang.flag}</span>
                            <span className="hidden sm:block text-xs">{currentLang.label}</span>
                            <FiGlobe className="w-3.5 h-3.5 text-gray-400" />
                        </button>

                        {langOpen && (
                            <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-50">
                                {LANG_OPTIONS.map((lang) => (
                                    <button key={lang.code} onClick={() => { setLanguage(lang.code); setLangOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-gray-50 ${language === lang.code ? "text-blue-600 bg-blue-50/50" : "text-gray-700"}`}>
                                        <span>{lang.flag}</span>
                                        <span>{lang.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => {
                                if (!isLoggedIn) {
                                    setAuthModal("login");
                                } else {
                                    setProfileOpen(!profileOpen);
                                }
                            }}
                            className="flex items-center gap-2.5 focus:outline-none">
                            {isLoggedIn ? (
                                <>
                                    <div className="hidden sm:flex flex-col text-right">
                                        <span className="text-xs font-bold text-gray-900 leading-tight">{user.name}</span>
                                        <span className="text-[10px] text-gray-400 font-medium truncate max-w-30">{user.email}</span>
                                    </div>
                                    <img src={avatarSrc} alt="Avatar" className="w-9 h-9 rounded-xl object-cover border-2 border-blue-100 cursor-pointer hover:border-blue-300 transition-all" />
                                </>
                            ) : (
                                <button onClick={() => setAuthModal("login")} className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all">
                                    <FiLogIn className="w-3.5 h-3.5" />
                                    <span className="hidden sm:block">{t.loginRegister}</span>
                                </button>
                            )}
                        </button>

                        {isLoggedIn && profileOpen && (
                            <div className="absolute right-0 top-full mt-3 w-72 bg-white border border-gray-100 rounded-3xl shadow-2xl shadow-gray-200/80 p-5 z-50 animate-dropdown-in">
                                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                                    <div className="relative w-12 h-12 group shrink-0">
                                        <img src={avatarSrc} alt="Avatar" className="w-12 h-12 rounded-xl object-cover border-2 border-blue-100" />
                                        <label className="absolute inset-0 bg-black/40 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                                            <FiCamera className="w-4 h-4" />
                                            <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                                        </label>
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                                        <p className="text-[11px] text-gray-400 font-medium truncate">{user.email}</p>
                                        {user.role && (
                                            <span className="inline-block mt-0.5 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-bold">
                                                {user.role}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <form onSubmit={handleSaveProfile} className="space-y-3">
                                    <Input label={t.fullName} type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required />
                                    <Input label={t.position} type="text" value={editRole} onChange={(e) => setEditRole(e.target.value)} required />
                                    <div className="flex gap-2 pt-1">
                                        <button type="button" onClick={() => setProfileOpen(false)} className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs font-bold text-gray-500 transition-colors">
                                            {t.closeModal}
                                        </button>
                                        <button type="submit" className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all">
                                            {t.save}
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <button onClick={() => { setProfileOpen(false); setLogoutConfirm(true); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                                        <FiLogOut className="w-3.5 h-3.5" />
                                        {t.logout}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <ConfirmModal open={logoutConfirm} onClose={() => setLogoutConfirm(false)} onConfirm={handleLogout} title={t.logout} message={t.logoutConfirm} confirmLabel={t.yes} confirmVariant="danger" />
        </>
    );
}