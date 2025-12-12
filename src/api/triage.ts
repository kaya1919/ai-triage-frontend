// src/api/triage.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export type TriageResponse = {
  predicted_specialty?: string;
  specialty?: string;
  [k: string]: any;
};

export async function triage(symptoms: string, user_name = "Anonymous"): Promise<TriageResponse> {
  const res = await fetch(`${API_BASE}/triage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_name, symptoms }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || `Triage failed: ${res.status}`);
  }
  return res.json();
}
