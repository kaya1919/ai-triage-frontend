// src/components/common/ConfirmModal.tsx
import React from "react";

export default function ConfirmModal({
  open,
  title,
  message,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 8,
          width: 300,
        }}
      >
        <h3>{title ?? "Confirm"}</h3>
        <p>{message}</p>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onCancel}>Cancel</button>
          <button
            onClick={onConfirm}
            style={{ background: "#2563eb", color: "white", padding: "6px 12px", borderRadius: 6 }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
