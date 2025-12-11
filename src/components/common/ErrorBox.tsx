// src/components/common/ErrorBox.tsx
import React from "react";

export default function ErrorBox({ message }: { message: string | null }) {
  if (!message) return null;

  return (
    <div
      style={{
        background: "#fee2e2",
        color: "#b91c1c",
        padding: "10px 14px",
        borderRadius: 6,
        marginBottom: 10,
        border: "1px solid #fca5a5",
      }}
    >
      {message}
    </div>
  );
}
