// src/components/DeleteConfirmPopup.jsx
import { AlertTriangle } from "lucide-react";

export default function DeleteConfirmPopup({ name, onCancel, onConfirm }) {
  return (
    <div className="confirm-overlay" onClick={(e) => e.stopPropagation()}>
      <div className="confirm-popup" onClick={(e) => e.stopPropagation()}>
        <AlertTriangle size={42} color="#ff4d4d" />
        <h3>Er du sikker på, at du vil slette?</h3>
        <p>{name}</p>

        <div className="confirm-buttons">
          <button className="cancel" onClick={onCancel}>
            Annuller
          </button>
          <button className="delete" onClick={onConfirm}>
            Slet
          </button>
        </div>
      </div>
    </div>
  );
}
