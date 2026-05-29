import React from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { Modal, ModalBody } from "./Modal";
import { Btn } from "./FormElements";

function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel, confirmVariant = "danger" }) {
    if (!open) return null;

    return (
        <Modal open={open} onClose={onClose} size="sm">
            <ModalBody>
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center">
                        <FiAlertTriangle className="w-6 h-6 text-rose-500" />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
                        <p className="text-sm text-gray-400 font-medium">{message}</p>
                    </div>
                    <div className="flex gap-2 w-full pt-2">
                        <Btn variant="secondary" onClick={onClose} className="flex-1 justify-center">
                            Xeyr
                        </Btn>
                        <Btn variant={confirmVariant} onClick={() => { onConfirm(); onClose(); }} className="flex-1 justify-center">
                            {confirmLabel || "Bəli"}
                        </Btn>
                    </div>
                </div>
            </ModalBody>
        </Modal>
    );
}
export default ConfirmModal