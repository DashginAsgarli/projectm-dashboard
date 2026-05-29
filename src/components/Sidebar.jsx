import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { FiCheckSquare, FiMessageSquare, FiUsers, FiLogOut, FiPlus, FiX, FiZap, FiLogIn, FiUserPlus } from "react-icons/fi";
import { Modal, ModalHeader, ModalBody } from "./UI/Modal";
import { Input, Btn } from "./UI/FormElements";
import ConfirmModal from "./UI/ConfirmModal";

export default function Sidebar() {
    const { page, setPage, projects, setProjects, activeProjectId, setActiveProjectId, setBoard, emptyBoard, t, sidebarOpen, setSidebarOpen, handleLogout, isLoggedIn, setAuthModal } = useApp();

    const [projModal, setProjModal] = useState(false);
    const [newProjName, setNewProjName] = useState("");
    const [logoutConfirm, setLogoutConfirm] = useState(false);

    const menuItems = [
        { id: "tasks", label: t.tasks, icon: <FiCheckSquare className="w-4 h-4" /> },
        { id: "messages", label: t.messages, icon: <FiMessageSquare className="w-4 h-4" /> },
        { id: "members", label: t.members, icon: <FiUsers className="w-4 h-4" /> },
    ];

    const handleCreateProject = (e) => {
        e.preventDefault();
        if (!newProjName.trim()) return;
        const newId = `p-${Date.now()}`;
        const newProj = { id: newId, name: newProjName, boardData: emptyBoard };
        setProjects([...projects, newProj]);
        setActiveProjectId(newId);
        setBoard(emptyBoard);
        setPage("tasks");
        setNewProjName("");
        setProjModal(false);
        setSidebarOpen(false);
    };

    return (
        <>
            {sidebarOpen && (
                <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm" />
            )}

            <aside className={`fixed inset-y-0 left-0 z-40 w-60 bg-white border-r border-gray-100 flex flex-col h-full shrink-0 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/25">
                            <FiZap className="w-4 h-4" />
                        </div>
                        <span className="font-black text-base tracking-tight text-gray-900">TaskFlow</span>
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1.5 text-gray-400 hover:bg-gray-100 rounded-xl">
                        <FiX className="w-4 h-4" />
                    </button>
                </div>

                <nav className="px-3 pt-4 pb-2 space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-3 pb-2">
                        Naviqasiya
                    </p>
                    {menuItems.map((item) => {
                        const active = page === item.id;
                        return (
                            <button key={item.id} onClick={() => { setPage(item.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all text-left ${active ? "bg-blue-50 text-blue-600" : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"}`}>
                                {item.icon}
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="flex-1 overflow-y-auto px-3 py-2">
                    <div className="flex items-center justify-between px-3 mb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            {t.projects}
                        </p>
                        <button onClick={() => setProjModal(true)} className="p-1 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors">
                            <FiPlus className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="space-y-0.5">
                        {projects.map((p) => {
                            const active = activeProjectId === p.id && page === "tasks";
                            return (
                                <button key={p.id} onClick={() => { setActiveProjectId(p.id); setPage("tasks"); setBoard(p.boardData || emptyBoard); setSidebarOpen(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${active ? "bg-blue-50 text-blue-700 border border-blue-100" : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${active ? "bg-blue-500" : "bg-gray-300"}`} />
                                    <span className="truncate">{p.name}</span>
                                </button>
                            );
                        })}
                        {projects.length === 0 && (
                            <p className="text-[11px] text-gray-400 font-medium px-3 py-2 italic">
                                Layihə yoxdur.
                            </p>
                        )}
                    </div>
                </div>

                <div className="p-3 border-t border-gray-100 space-y-0.5">
                    {isLoggedIn ? (
                        <button onClick={() => setLogoutConfirm(true)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                            <FiLogOut className="w-4 h-4" />
                            {t.logout}
                        </button>
                    ) : (
                        <>
                            <button onClick={() => { setAuthModal("login"); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all">
                                <FiLogIn className="w-4 h-4" />
                                {t.login}
                            </button>
                            <button onClick={() => { setAuthModal("register"); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:bg-blue-50 hover:text-blue-600 transition-all">
                                <FiUserPlus className="w-4 h-4" />
                                {t.register}
                            </button>
                        </>
                    )}
                </div>
            </aside>

            <Modal open={projModal} onClose={() => setProjModal(false)} size="sm">
                <ModalHeader title={t.addProject} onClose={() => setProjModal(false)} />
                <ModalBody>
                    <form onSubmit={handleCreateProject} className="space-y-4">
                        <Input label="Layihənin Adı" type="text" value={newProjName} onChange={(e) => setNewProjName(e.target.value)} required placeholder="Məs. Yeni Mobil Tətbiq" autoFocus />
                        <div className="flex justify-end gap-2">
                            <Btn variant="secondary" type="button" onClick={() => setProjModal(false)}>
                                {t.cancel}
                            </Btn>
                            <Btn variant="primary" type="submit">
                                Yarat
                            </Btn>
                        </div>
                    </form>
                </ModalBody>
            </Modal>

            <ConfirmModal open={logoutConfirm} onClose={() => setLogoutConfirm(false)} onConfirm={handleLogout} title={t.logout} message={t.logoutConfirm} confirmLabel={t.yes} confirmVariant="danger" />
        </>
    );
}