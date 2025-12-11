// src/components/common/Spinner.tsx
import React from "react";

export default function Spinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div style={{ padding: 10, opacity: 0.8 }}>
      <div style={{ fontSize: 15 }}>{text}</div>
    </div>
  );
}
