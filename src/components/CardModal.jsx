import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Modal, ModalHeader, ModalBody } from "./UI/Modal";
import { Input, Textarea, Select, Btn } from "./UI/FormElements";
import { FiTrash2 } from "react-icons/fi";

function CardModal({ open, onClose, editData, targetColId }) {
    const { board, setBoard, showToast, t } = useApp();

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [priority, setPriority] = useState("low");
    const [imageUrl, setImageUrl] = useState("");
    const [link, setLink] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [isCompleted, setIsCompleted] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    useEffect(() => {
        if (editData) {
            setTitle(editData.title || "");
            setDesc(editData.desc || "");
            setPriority(editData.priority || "low");
            setImageUrl(editData.imageUrl || "");
            setLink(editData.link || "");
            setDueDate(editData.dueDate || "");
            setIsCompleted(editData.isCompleted || false);
        } else {
            setTitle("");
            setDesc("");
            setPriority("low");
            setImageUrl("");
            setLink("");
            setDueDate("");
            setIsCompleted(false);
        }
    }, [editData, open]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setImageUrl(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        if (editData) {
            setBoard({
                ...board,
                tasks: {
                    ...board.tasks,
                    [editData.id]: { ...board.tasks[editData.id], title, desc, priority, imageUrl, link, dueDate, isCompleted },
                },
            });
            showToast(t.taskSaved);
        }
        else {
            const id = `task-${Date.now()}`;
            const newTask = { id, title, desc, priority, imageUrl, link, dueDate, isCompleted: false };
            const col = board.columns[targetColId];
            if (!col) return;
            setBoard({
                ...board,
                tasks: { ...board.tasks, [id]: newTask },
                columns: { ...board.columns, [targetColId]: { ...col, taskIds: [...col.taskIds, id] } },
            });
            showToast(t.taskSaved);
        }
        onClose();
    };

    const handleDelete = () => {
        if (!editData) return;
        const colId = Object.keys(board.columns).find((cId) =>
            board.columns[cId].taskIds.includes(editData.id)
        );
        const nextTasks = { ...board.tasks };
        delete nextTasks[editData.id];
        const nextCols = colId
            ? {
                ...board.columns,
                [colId]: {
                    ...board.columns[colId],
                    taskIds: board.columns[colId].taskIds.filter((id) => id !== editData.id),
                },
            }
            : board.columns;
        setBoard({ ...board, tasks: nextTasks, columns: nextCols });
        showToast(t.taskDeleted);
        onClose();
    };

    const priorityOptions = [
        { value: "low", label: t.low },
        { value: "medium", label: t.medium },
        { value: "high", label: t.high },
    ];

    const priorityColors = {
        low: "bg-emerald-50 text-emerald-700",
        medium: "bg-amber-50 text-amber-700",
        high: "bg-rose-50 text-rose-700",
    };

    return (
        <Modal open={open} onClose={onClose} size="md">
            <ModalHeader title={editData ? t.editCard : t.addCard} onClose={onClose} />
            <ModalBody>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label={t.taskName} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tapşırığın adını yazın..." required autoFocus />
                    <Textarea label={t.description} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Ətraflı açıqlama..." rows={3} />

                    <div className="grid grid-cols-2 gap-3">
                        <Select label={t.priority} value={priority} onChange={(e) => setPriority(e.target.value)} options={priorityOptions} />
                        <Input label={t.dueDate} type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                    </div>

                    <Input label={t.resourceLink} type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://example.com" />

                    <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                            {t.imageUrl}
                        </label>
                        <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/..." />
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[11px] text-gray-400 font-bold">və ya fayldan:</span>
                            <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 transition-all" />
                        </div>
                        {imageUrl && (
                            <img src={imageUrl} alt="preview" className="mt-2 w-full h-28 object-cover rounded-xl border border-gray-100" />
                        )}
                    </div>

                    {editData && (
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={isCompleted} onChange={(e) => setIsCompleted(e.target.checked)} className="w-4 h-4 accent-blue-600 rounded" />
                                <span className="text-sm font-bold text-gray-600">{t.completed}</span>
                            </label>

                            {!deleteConfirm ? (
                                <Btn variant="ghost" type="button" onClick={() => setDeleteConfirm(true)} className="text-rose-500 hover:bg-rose-50 text-xs">
                                    <FiTrash2 className="w-3.5 h-3.5" />
                                    {t.delete}
                                </Btn>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 font-medium">Əminsiniz?</span>
                                    <Btn variant="danger" type="button" onClick={handleDelete} className="text-xs py-1">
                                        Bəli
                                    </Btn>
                                    <Btn variant="secondary" type="button" onClick={() => setDeleteConfirm(false)} className="text-xs py-1">
                                        Xeyr
                                    </Btn>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end gap-2 pt-1">
                        <Btn variant="secondary" type="button" onClick={onClose}>{t.cancel}</Btn>
                        <Btn variant="primary" type="submit">{t.save}</Btn>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    );
}

export default CardModal