import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Modal, ModalBody } from "./Modal";
import { Input, Btn } from "./FormElements";
import { FiZap, FiUser } from "react-icons/fi";

function AuthModal() {
    const { authModal, setAuthModal, setIsLoggedIn, setIsGuest, setUser, t, showToast, enterAsGuest } = useApp();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [tab, setTab] = useState(authModal || "login");

    const open = authModal !== null;

    const handleAuth = (e) => {
        e.preventDefault();
        if (!email.trim() || !password.trim()) return;
        if (tab === "register" && !name.trim()) return;
        if (password.length < 6) {
            showToast(t.minPassword, "error");
            return;
        }

        const finalName = tab === "login" ? (name || "İstifadəçi") : name;
        setUser({
            name: finalName,
            email,
            role: "Layihə Sahibi",
            avatar: "",
        });
        setIsLoggedIn(true);
        setIsGuest(false);
        setAuthModal(null);
        showToast(`Xoş gəldiniz, ${finalName}! 👋`);
        setEmail("");
        setPassword("");
        setName("");
    };

    const handleGuestEntry = () => {
        enterAsGuest();
        showToast("Qonaq kimi daxil oldunuz.");
    };

    return (
        <Modal open={open} onClose={() => setAuthModal(null)} size="sm">
            <ModalBody>
                <div className="flex flex-col items-center mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-3 shadow-lg shadow-blue-600/30">
                        <FiZap className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-black text-gray-900">TaskFlow</h2>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                        {tab === "login" ? t.welcomeBack : t.createAccount}
                    </p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-xl mb-5">
                    {["login", "register"].map((t_) => (
                        <button
                            key={t_}
                            onClick={() => setTab(t_)}
                            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${tab === t_ ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                        >
                            {t_ === "login" ? t.login : t.register}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleAuth} className="space-y-3.5">
                    {tab === "register" && (
                        <Input label={t.fullName} type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Adınız və Soyadınız" required />
                    )}
                    <Input label={t.email} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nümunə@gmail.com" required />
                    <Input label={t.password} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                    <Btn variant="primary" type="submit" className="w-full justify-center py-2.5 text-sm mt-2">
                        {tab === "login" ? t.loginBtn : t.registerBtn}
                    </Btn>
                </form>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <button onClick={handleGuestEntry} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-300 text-sm text-gray-400 font-bold hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/30 transition-all">
                        <FiUser className="w-4 h-4" />
                        {t.enterAsGuest}
                    </button>
                </div>
            </ModalBody>
        </Modal>
    );
}

export default AuthModal