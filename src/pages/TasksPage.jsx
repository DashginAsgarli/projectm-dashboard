import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { useDragDrop } from "../hooks/useDragDrop";
import { cls, timeLeft } from "../components/Helpers";
import CardModal from "../components/CardModal";
import { Modal, ModalHeader, ModalBody } from "../components/UI/Modal";
import { Input, Select, Btn } from "../components/UI/FormElements";
import ConfirmModal from "../components/UI/ConfirmModal";
import { FiPlus, FiTrash2, FiX, FiCalendar, FiExternalLink, FiFolder, FiCheckCircle, FiActivity, FiLayers, FiShare2, FiUserPlus, FiClock, FiCheck } from "react-icons/fi";

const COL_COLORS = [
    { id: "blue", label: "Mavi", bg: "bg-blue-50/60", dot: "bg-blue-500", border: "border-blue-200" },
    { id: "emerald", label: "Yaşıl", bg: "bg-emerald-50/60", dot: "bg-emerald-500", border: "border-emerald-200" },
    { id: "amber", label: "Sarı", bg: "bg-amber-50/60", dot: "bg-amber-500", border: "border-amber-200" },
    { id: "rose", label: "Qırmızı", bg: "bg-rose-50/60", dot: "bg-rose-500", border: "border-rose-200" },
    { id: "violet", label: "Bənövşəyi", bg: "bg-violet-50/60", dot: "bg-violet-500", border: "border-violet-200" },
    { id: "gray", label: "Boz", bg: "bg-gray-100/70", dot: "bg-gray-400", border: "border-gray-200" },
];

const PRIORITY_STYLE = {
    high: "bg-rose-50 text-rose-600",
    medium: "bg-amber-50 text-amber-600",
    low: "bg-emerald-50 text-emerald-700",
};

export default function TasksPage() {
    const { board, setBoard, projects, activeProjectId, setProjects, searchQuery, filterPriority, setFilterPriority, t, showToast } = useApp();
    const dnd = useDragDrop();

    const [colModal, setColModal] = useState(false);
    const [newColName, setNewColName] = useState("");
    const [newColColor, setNewColColor] = useState("blue");
    const [shareModal, setShareModal] = useState(false);
    const [delProjModal, setDelProjModal] = useState(false);
    const [delColConfirm, setDelColConfirm] = useState(null); // colId to delete
    const [cardModal, setCardModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [targetColId, setTargetColId] = useState("");
    const [newMemberName, setNewMemberName] = useState("");
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [newMemberRole, setNewMemberRole] = useState("developer");
    const currentProject = projects.find((p) => p.id === activeProjectId);

    if (!currentProject) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400 h-full">
                <FiFolder className="w-14 h-14 text-blue-100 mb-4" />
                <h2 className="text-lg font-bold text-gray-700">{t.noProject}</h2>
                <p className="text-sm mt-1 max-w-xs text-gray-400">{t.noProjectDesc}</p>
            </div>
        );
    }

    const allTasks = Object.values(board.tasks || {});
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter((tk) => tk.isCompleted).length;
    const activeTasks = totalTasks - completedTasks;
    const projectMembers = currentProject.members || [];

    const handleAddColumn = (e) => {
        e.preventDefault();
        if (!newColName.trim()) return;
        const id = `col-${Date.now()}`;
        setBoard({ ...board, columns: { ...board.columns, [id]: { id, title: newColName, taskIds: [], color: newColColor } }, columnOrder: [...board.columnOrder, id], });
        setNewColName("");
        setColModal(false);
        showToast(t.columnAdded);
    };

    const handleDeleteColumn = (colId) => {
        const col = board.columns[colId];
        const nextTasks = { ...board.tasks };
        (col.taskIds || []).forEach((tid) => delete nextTasks[tid]);
        const { [colId]: _, ...nextCols } = board.columns;
        setBoard({ ...board, tasks: nextTasks, columns: nextCols, columnOrder: board.columnOrder.filter((id) => id !== colId), });
        showToast(t.columnDeleted);
    };

    const handleAddMember = (e) => {
        e.preventDefault();
        if (!newMemberName.trim() || !newMemberEmail.trim()) return;
        const newMem = {
            id: `mem-${Date.now()}`,
            name: newMemberName,
            email: newMemberEmail,
            intendedRole: newMemberRole,
            status: "pending",
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newMemberName)}&background=2563eb&color=fff`,
        };
        setProjects(projects.map((p) => p.id === activeProjectId ? { ...p, members: [...(p.members || []), newMem] } : p));
        setNewMemberName("");
        setNewMemberEmail("");
        showToast(t.memberAdded);
    };

    const handleApproveMember = (memberId) => {
        setProjects(projects.map((p) => p.id === activeProjectId ? { ...p, members: p.members.map((m) => m.id === memberId ? { ...m, status: "approved" } : m) } : p));
        showToast("Üzv qəbul edildi!");
    };

    const handleDeleteProject = () => {
        setProjects(projects.filter((p) => p.id !== activeProjectId));
        showToast(t.projectDeleted);
    };

    const openCreate = (colId) => {
        setEditingTask(null);
        setTargetColId(colId);
        setCardModal(true);
    };

    const openEdit = (task) => {
        setEditingTask(task);
        setCardModal(true);
    };

    const priorityOptions = [
        { value: "All", label: t.all },
        { value: "low", label: t.low },
        { value: "medium", label: t.medium },
        { value: "high", label: t.high },
        { value: "done", label: t.done },
    ];

    const roleOptions = [
        { value: "developer", label: "Developer" },
        { value: "designer", label: "Designer" },
        { value: "manager", label: "Manager" },
    ];

    return (
        <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                    <h1 className="text-lg sm:text-xl font-black text-gray-900 truncate min-w-0" title={currentProject.name} style={{ maxWidth: "clamp(80px, 40vw, 220px)" }}>
                        {currentProject.name}
                    </h1>
                    <button onClick={() => setShareModal(true)} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors shrink-0">
                        <FiShare2 className="w-3.5 h-3.5" />
                        <span className="hidden xs:inline">{t.shareProject}</span>
                    </button>
                    <button onClick={() => setDelProjModal(true)} className="p-1.5 text-gray-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-all shrink-0">
                        <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto scrollbar-none">
                        {["All", "low", "medium", "high", "done"].map((p) => (
                            <button key={p} onClick={() => setFilterPriority(p)} className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${filterPriority === p ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}>
                                {p === "All" ? t.all : p === "low" ? t.low : p === "medium" ? t.medium : p === "high" ? t.high : t.done}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setColModal(true)} className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-600/20 shrink-0 whitespace-nowrap">
                        <FiPlus className="w-3.5 h-3.5" />
                        {t.addColumnBtn}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5 shrink-0">
                {[
                    { label: t.statsTotal, val: totalTasks, icon: <FiLayers />, color: "bg-blue-50 text-blue-600" },
                    { label: t.statsInProgress, val: activeTasks, icon: <FiActivity />, color: "bg-amber-50 text-amber-600" },
                    { label: t.statsDone, val: completedTasks, icon: <FiCheckCircle />, color: "bg-emerald-50 text-emerald-600" },
                ].map(({ label, val, icon, color }) => (
                    <div key={label} className="bg-white border border-gray-100 rounded-2xl p-2 sm:p-4 flex items-center gap-2 sm:gap-3 shadow-sm min-w-0 overflow-hidden">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 text-sm ${color}`}>
                            {icon}
                        </div>
                        <div className="min-w-0">
                            <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate leading-tight">
                                {label}
                            </p>
                            <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight">{val}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 items-start" style={{ minHeight: "min(calc(100vh - 340px), 60vh)" }}>
                {board.columnOrder.map((colId) => {
                    const col = board.columns[colId];
                    if (!col) return null;
                    const colorDef = COL_COLORS.find((c) => c.id === col.color) || COL_COLORS[0];

                    const tasks = (col.taskIds || [])
                        .map((id) => board.tasks[id])
                        .filter(Boolean)
                        .filter((tk) => {
                            const q = searchQuery.toLowerCase();
                            const matchSearch =
                                tk.title?.toLowerCase().includes(q) || tk.desc?.toLowerCase().includes(q);
                            const matchPriority =
                                filterPriority === "All" ||
                                (filterPriority === "done" ? tk.isCompleted : tk.priority === filterPriority && !tk.isCompleted);
                            return matchSearch && matchPriority;
                        });

                    return (
                        <div key={colId} onDragOver={(e) => dnd.onDragOver(e, colId)} onDrop={(e) => dnd.onDrop(e, colId)} className={cls("w-[85vw] sm:w-72 shrink-0 rounded-2xl p-3 flex flex-col border border-dashed transition-all", colorDef.bg, dnd.overColId === colId ? colorDef.border : "border-transparent")} style={{ maxHeight: "min(calc(100vh - 340px), 70vh)" }}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className={cls("w-2 h-2 rounded-full shrink-0", colorDef.dot)} />
                                    <span className="font-extrabold text-xs text-gray-700 uppercase tracking-wider truncate max-w-25 sm:max-w-32.5">
                                        {col.title}
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-white/70 text-gray-500 shrink-0">
                                        {tasks.length}
                                    </span>
                                </div>
                                <div className="flex items-center gap-0.5 shrink-0">
                                    <button onClick={() => openCreate(colId)} className="p-1.5 rounded-lg text-gray-400 hover:bg-white/70 hover:text-blue-600 transition-all">
                                        <FiPlus className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => setDelColConfirm(colId)} className="p-1.5 rounded-lg text-gray-400 hover:bg-white/70 hover:text-rose-500 transition-all">
                                        <FiTrash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-0.5">
                                <div  className=" flex flex-col gap-2">
                                    {tasks.map((tk) => (
                                        <div key={tk.id} draggable onDragStart={(e) => dnd.onCardDragStart(e, tk.id, colId)} onDragEnd={dnd.onDragEnd} onClick={() => openEdit(tk)} className={cls("bg-white p-3 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group", dnd.draggingId === tk.id ? "opacity-40 scale-95" : "", tk.isCompleted ? "opacity-60" : "")}>
                                            {tk.imageUrl && (
                                                <img src={tk.imageUrl} alt="" className="w-full h-24 object-cover rounded-lg mb-2 border border-gray-50" />
                                            )}
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className={cls("font-bold text-xs text-gray-900 leading-snug", tk.isCompleted ? "line-through text-gray-400" : "")}>
                                                    {tk.title}
                                                </h4>
                                                <span className={cls("text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase shrink-0", PRIORITY_STYLE[tk.priority] || PRIORITY_STYLE.low)}>
                                                    {tk.priority === "high" ? t.high : tk.priority === "medium" ? t.medium : t.low}
                                                </span>
                                            </div>
                                            {tk.desc && (
                                                <p className="text-[11px] text-gray-400 font-medium line-clamp-2 mt-1">
                                                    {tk.desc}
                                                </p>
                                            )}
                                            {(tk.dueDate || tk.link) && (
                                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 text-[10px] text-gray-400 font-bold">
                                                    {tk.dueDate ? (
                                                        <span className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded-md">
                                                            <FiCalendar className="w-3 h-3" />
                                                            {timeLeft(tk.dueDate, t)}
                                                        </span>
                                                    ) : (
                                                        <span />
                                                    )}
                                                    {tk.link && (

                                                        <a href={tk.link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="text-blue-500 hover:underline flex items-center gap-0.5">
                                                            <FiExternalLink className="w-3 h-3" />
                                                            Keçid
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {tasks.length === 0 && (
                                    <button onClick={() => openCreate(colId)} className="w-full py-3 border-2 border-dashed border-gray-200/80 rounded-xl text-[11px] text-gray-400 font-bold hover:border-blue-300 hover:text-blue-500 hover:bg-white/50 transition-all mt-1">
                                        + Tapşırıq əlavə et
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {board.columnOrder.length === 0 && (
                    <div className="flex-1 flex items-center justify-center min-h-50">
                        <div className="text-center text-gray-400">
                            <FiLayers className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                            <p className="text-sm font-bold text-gray-600">Sütun yoxdur</p>
                            <p className="text-xs mt-1">Yuxarıdakı "Sütun Əlavə Et" düyməsindən başlayın</p>
                        </div>
                    </div>
                )}
            </div>

            <Modal open={colModal} onClose={() => setColModal(false)} size="sm">
                <ModalHeader title="Sütun Əlavə Et" onClose={() => setColModal(false)} />
                <ModalBody>
                    <form onSubmit={handleAddColumn} className="space-y-4">
                        <Input label="Sütun Adı" type="text" value={newColName} onChange={(e) => setNewColName(e.target.value)} required placeholder="Məs. İcra Olunanlar" autoFocus />
                        <div>
                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                                Rəng
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {COL_COLORS.map((c) => (
                                    <button key={c.id} type="button" onClick={() => setNewColColor(c.id)} className={cls("flex items-center gap-2 p-2 rounded-xl border text-xs font-bold transition-all", c.bg, newColColor === c.id ? "border-blue-500 ring-2 ring-blue-500/20" : "border-gray-200")}>
                                        <span className={cls("w-2.5 h-2.5 rounded-full", c.dot)} />
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                            <Btn variant="secondary" type="button" onClick={() => setColModal(false)}>
                                {t.cancel}
                            </Btn>
                            <Btn variant="primary" type="submit">
                                Əlavə et
                            </Btn>
                        </div>
                    </form>
                </ModalBody>
            </Modal>

            <Modal open={shareModal} onClose={() => setShareModal(false)} size="lg">
                <ModalHeader title="Layihəni Paylaş & Üzvlər" onClose={() => setShareModal(false)} />
                <ModalBody>
                    <form onSubmit={handleAddMember} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <input type="text" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} required placeholder="Ad Soyad" className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-400 w-full" />
                        <input type="email" value={newMemberEmail} onChange={(e) => setNewMemberEmail(e.target.value)} required placeholder="E-poçt" className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-400 w-full" />
                        <div className="flex gap-2">
                            <select value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value)} className="flex-1 px-2 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-400 min-w-0">
                                {roleOptions.map((r) => (
                                    <option key={r.value} value={r.value}>
                                        {r.label}
                                    </option>
                                ))}
                            </select>
                            <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shrink-0">
                                <FiUserPlus className="w-4 h-4" />
                            </button>
                        </div>
                    </form>

                    <div className="space-y-2">
                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-2">
                            Layihə İştirakçıları
                        </p>
                        {projectMembers.map((m) => (
                            <div key={m.id} className="flex items-center justify-between gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                                <div className="flex items-center gap-3 min-w-0">
                                    <img src={m.avatar} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-gray-900 truncate">{m.name}</p>
                                        <p className="text-[10px] text-gray-400 truncate">{m.email}</p>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    {m.status === "pending" ? (
                                        <button onClick={() => handleApproveMember(m.id)} className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-lg text-[10px] font-black transition-all whitespace-nowrap">
                                            <FiClock className="w-3 h-3" />
                                            {t.approve}
                                        </button>
                                    ) : (
                                        <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black whitespace-nowrap">
                                            <FiCheck className="w-3 h-3" />
                                            {m.intendedRole}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                        {projectMembers.length === 0 && (
                            <p className="text-xs text-center text-gray-400 italic py-4">
                                Bu layihə hələ heç kimlə paylaşılmayıb.
                            </p>
                        )}
                    </div>
                </ModalBody>
            </Modal>

            <ConfirmModal open={!!delColConfirm} onClose={() => setDelColConfirm(null)} onConfirm={() => handleDeleteColumn(delColConfirm)} title="Sütunu sil?" message={t.deleteColumnConfirm} confirmLabel="Sil" confirmVariant="danger" />

            <ConfirmModal open={delProjModal} onClose={() => setDelProjModal(false)} onConfirm={handleDeleteProject} title="Layihəni sil?" message={t.deleteProjectConfirm} confirmLabel="Sil" confirmVariant="danger" />

            <CardModal open={cardModal} onClose={() => setCardModal(false)} editData={editingTask} targetColId={targetColId} />
        </>
    );
}