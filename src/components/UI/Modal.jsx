import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

export function Modal({ open, onClose, children, size = "md" }) {
    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    if (!open) return null;

    const sizeClasses = {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className={`bg-white rounded-3xl w-full ${sizeClasses[size]} shadow-2xl border border-gray-100 animate-modal-in overflow-y-auto max-h-[90vh]`}>
                {children}
            </div>
        </div>
    );
}

export function ModalHeader({ title, onClose }) {
    return (
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                <FiX className="w-4 h-4" />
            </button>
        </div>
    );
}

export function ModalBody({ children }) {
    return <div className="p-6">{children}</div>;
}