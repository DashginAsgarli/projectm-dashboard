import React from "react";

const baseInput = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-500/10 text-sm text-gray-900 font-medium transition-all";

export function Input({ label, className = "", ...props }) {
    return (
        <div>
            {label && (
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    {label}
                </label>
            )}
            <input className={`${baseInput} ${className}`} {...props} />
        </div>
    );
}

export function Textarea({ label, className = "", ...props }) {
    return (
        <div>
            {label && (
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    {label}
                </label>
            )}
            <textarea className={`${baseInput} resize-none ${className}`} {...props} />
        </div>
    );
}

export function Select({ label, options = [], className = "", ...props }) {
    return (
        <div>
            {label && (
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                    {label}
                </label>
            )}
            <select className={`${baseInput} ${className}`} {...props}>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

const btnVariants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-600",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/20",
    ghost: "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
    outline: "border border-gray-200 text-gray-700 hover:bg-gray-50",
};

export function Btn({ variant = "primary", className = "", children, ...props }) {
    return (
        <button className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-1.5 ${btnVariants[variant]} ${className}`}    {...props}>
            {children}
        </button>
    );
}