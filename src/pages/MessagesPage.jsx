import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { FiSend, FiMessageSquare } from "react-icons/fi";

export default function MessagesPage() {
    const { messages, setMessages, user, t } = useApp();
    const [text, setText] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        const newMsg = {
            id: Date.now(),
            senderName: user.name || "Qonaq",
            senderAvatar: user.avatar || "",
            text: text.trim(),
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages([...messages, newMsg]);
        setText("");
    };

    return (
        <div className="flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm" style={{ height: "calc(100vh - 140px)" }}>
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50 shrink-0">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <FiMessageSquare className="w-4 h-4" />
                </div>
                <div>
                    <h2 className="font-black text-sm text-gray-900">{t.teamChat}</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.activeChat}</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map((msg) => {
                    const avatar = msg.senderAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.senderName)}&background=2563eb&color=fff`;
                    return (
                        <div key={msg.id} className="flex items-start gap-3 max-w-xl animate-slide-in">
                            <img src={avatar} alt="" className="w-8 h-8 rounded-xl object-cover shrink-0 border border-gray-100" />
                            <div className="bg-gray-50 border border-gray-100 p-3 rounded-2xl rounded-tl-none">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-black text-gray-900">{msg.senderName}</span>
                                    <span className="text-[9px] text-gray-400 font-medium">{msg.time}</span>
                                </div>
                                <p className="text-sm text-gray-600 font-medium whitespace-pre-line leading-relaxed">
                                    {msg.text}
                                </p>
                            </div>
                        </div>
                    );
                })}
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 italic text-sm">
                        <FiMessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                        {t.noMessages}
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white flex items-center gap-3 shrink-0">
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder={t.typeMessage} className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:bg-white focus:border-blue-400 text-sm font-medium transition-all" />
                <button type="submit" className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm shadow-blue-600/20 transition-all shrink-0">
                    <FiSend className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
}