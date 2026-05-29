import React from "react";
import { useApp } from "../context/AppContext";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function ToastContainer() {
    const { toasts } = useApp();

    return (
        <div className="fixed bottom-5 right-5 z-100 space-y-2 pointer-events-none">
            {toasts.map((toast) => (
                <div key={toast.id} className={`px-4 py-3 rounded-2xl shadow-xl text-white text-xs font-bold flex items-center gap-2.5 pointer-events-auto border animate-toast-in ${toast.type === "error" ? "bg-rose-600 border-rose-500/50" : "bg-gray-900 border-white/5"}`}>
                    {toast.type === "error" ? (
                        <FiAlertCircle className="w-4 h-4 text-rose-200 shrink-0" />
                    ) : (
                        <FiCheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                    )}
                    <span>{toast.text}</span>
                </div>
            ))}
        </div>
    );
}