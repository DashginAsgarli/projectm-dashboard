import { useState } from "react";
import { useApp } from "../context/AppContext";

export function useDragDrop() {
    const { board, setBoard } = useApp();
    const [draggingId, setDraggingId] = useState(null);
    const [sourceColId, setSourceColId] = useState(null);
    const [overColId, setOverColId] = useState(null);
    const [overTaskId, setOverTaskId] = useState(null);
    const [dragType, setDragType] = useState("card");

    const onCardDragStart = (e, taskId, colId) => {
        setDragType("card");
        setDraggingId(taskId);
        setSourceColId(colId);
        e.dataTransfer.setData("text/plain", taskId);
    };

    const onColDragStart = (e, colId) => {
        setDragType("column");
        setDraggingId(colId);
    };

    const onDragOver = (e, colId, taskId = null) => {
        e.preventDefault();
        setOverColId(colId);
        setOverTaskId(taskId);
    };

    const onDragEnd = () => {
        setDraggingId(null);
        setSourceColId(null);
        setOverColId(null);
        setOverTaskId(null);
    };

    const onDrop = (e, targetColId) => {
        e.preventDefault();
        if (!draggingId) return;

        if (dragType === "column") {
            if (draggingId === targetColId) return;
            const currentOrder = [...board.columnOrder];
            const sIdx = currentOrder.indexOf(draggingId);
            const tIdx = currentOrder.indexOf(targetColId);
            currentOrder.splice(sIdx, 1);
            currentOrder.splice(tIdx, 0, draggingId);
            setBoard({ ...board, columnOrder: currentOrder });
            onDragEnd();
            return;
        }

        if (sourceColId === targetColId) {
            const col = board.columns[sourceColId];
            const nextTaskIds = [...col.taskIds];
            const sIdx = nextTaskIds.indexOf(draggingId);
            nextTaskIds.splice(sIdx, 1);
            let tIdx = nextTaskIds.length;
            if (overTaskId) tIdx = nextTaskIds.indexOf(overTaskId);
            nextTaskIds.splice(tIdx, 0, draggingId);
            setBoard({
                ...board,
                columns: { ...board.columns, [sourceColId]: { ...col, taskIds: nextTaskIds } },
            });
        } 
        else {
            const sourceCol = board.columns[sourceColId];
            const targetCol = board.columns[targetColId];
            const nextSourceIds = sourceCol.taskIds.filter((id) => id !== draggingId);
            const nextTargetIds = [...targetCol.taskIds];
            let tIdx = nextTargetIds.length;
            if (overTaskId) tIdx = nextTargetIds.indexOf(overTaskId);
            nextTargetIds.splice(tIdx, 0, draggingId);
            setBoard({
                ...board,
                columns: {
                    ...board.columns,
                    [sourceColId]: { ...sourceCol, taskIds: nextSourceIds },
                    [targetColId]: { ...targetCol, taskIds: nextTargetIds },
                },
            });
        }
        onDragEnd();
    };

    return {
        draggingId, overColId, overTaskId,
        onCardDragStart, onColDragStart, onDragOver, onDragEnd, onDrop,
    };
}