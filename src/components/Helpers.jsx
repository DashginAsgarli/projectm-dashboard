export function cls(...classes) {
    return classes.filter(Boolean).join(" ");
}

export function timeLeft(dateStr, t) {
    if (!dateStr) return "";
    const due = new Date(dateStr);
    const now = new Date();
    const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return `${Math.abs(diff)} gün keçib`;
    if (diff === 0) return "Bu gün!";
    return `${diff} gün qaldı`;
}