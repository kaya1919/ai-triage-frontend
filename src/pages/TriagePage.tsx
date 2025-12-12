// src/pages/TriagePage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TriagePage() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [predicted, setPredicted] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setError(null);
    setPredicted(null);

    if (!symptoms.trim()) {
      setError("Please enter symptoms.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_name: "Anonymous", symptoms }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Server returned ${res.status}`);
      }

      const data = await res.json();
      const specialty = data.predicted_specialty || data.specialty || null;

      if (!specialty) {
        throw new Error("No specialty returned from triage service.");
      }

      setPredicted(specialty);
      // small delay so user can see the predicted result before navigating (optional)
      setTimeout(() => {
        navigate(`/doctors?specialty=${encodeURIComponent(specialty)}`);
      }, 350);
    } catch (err: any) {
      setError(err?.message || "Triage failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ padding: "28px 18px" }}>
      <div className="card" style={{
        background: "white",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(15,118,110,0.06)",
        maxWidth: 820,
        margin: "0 auto"
      }}>
        <h2 style={{ marginTop: 0 }}>AI Triage — Describe your symptoms</h2>
        <p style={{ color: "var(--muted)" }}>
          Type your symptoms (e.g. "fever and cough") and our AI will recommend the most suitable specialist.
        </p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g. fever, cough, sore throat..."
            rows={5}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "1px solid #e6eef0",
              resize: "vertical",
              fontSize: 14
            }}
            aria-label="symptoms"
          />

          <div style={{ marginTop: 12, display: "flex", gap: 12, alignItems: "center" }}>
            <button
              type="submit"
              className="btn-primary"
              style={{ opacity: loading ? 0.7 : 1 }}
              disabled={loading}
            >
              {loading ? "Analyzing..." : "Get Recommendation"}
            </button>

            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                setSymptoms("");
                setPredicted(null);
                setError(null);
              }}
              disabled={loading}
            >
              Clear
            </button>

            {predicted && (
              <div style={{ marginLeft: "auto", fontSize: 14 }}>
                <strong>Predicted specialty:</strong>{" "}
                <span style={{ color: "var(--primary)" }}>{predicted}</span>
              </div>
            )}
          </div>
        </form>

        {error && (
          <div style={{
            marginTop: 12,
            padding: 10,
            background: "#fff4f2",
            border: "1px solid #ffd6cc",
            borderRadius: 8,
            color: "#7a2b00"
          }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: 18, color: "var(--muted)", fontSize: 13 }}>
          Tip: Be concise. Example: "fever, sore throat, difficulty breathing".
        </div>
      </div>
    </div>
  );
}
