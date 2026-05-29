import React from "react";
import { useApp } from "../context/AppContext";
import { FiUsers, FiClock, FiCheck, FiFolder } from "react-icons/fi";

function MembersPage() {
    const { projects, t } = useApp();

    const allMembers = projects.flatMap((p) =>
        (p.members || []).map((m) => ({ ...m, projectName: p.name }))
    );

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-xl font-black text-gray-900">{t.members}</h1>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                    Layihə üzvlərini idarə edin. Üzv əlavə etmək üçün layihənin içindəki "Paylaş" düyməsindən istifadə edin.
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100">
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider">
                        Bütün Layihə Üzvləri ({allMembers.length})
                    </p>
                </div>

                <div className="divide-y divide-gray-50">
                    {allMembers.map((m) => (
                        <div key={m.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <img src={m.avatar} alt="" className="w-10 h-10 rounded-xl object-cover border border-gray-100" />
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{m.name}</p>
                                    <p className="text-xs text-gray-400 font-medium">{m.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-500 rounded-lg text-[10px] font-bold">
                                    <FiFolder className="w-3 h-3" />
                                    {m.projectName}
                                </span>
                                {m.status === "pending" ? (
                                    <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-100 text-amber-700 rounded-lg text-[10px] font-black">
                                        <FiClock className="w-3 h-3" />
                                        {t.pending}
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black">
                                        <FiCheck className="w-3 h-3" />
                                        {m.intendedRole}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}

                    {allMembers.length === 0 && (
                        <div className="p-12 text-center flex flex-col items-center">
                            <FiUsers className="w-12 h-12 text-blue-100 mb-3" />
                            <h3 className="font-bold text-gray-700 text-sm">{t.noMembers}</h3>
                            <p className="text-xs text-gray-400 mt-1 max-w-xs">{t.noMembersDesc}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default MembersPage