// src/pages/HomePage.tsx
import { useNavigate } from "react-router-dom";
import Hero from "../components/Layout/Hero";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page-container" style={{ paddingBottom: 40 }}>
      <Hero />

      {/* page-inner controls content width while allowing background to be full width */}
      <div className="page-inner" style={{ maxWidth: 1200, margin: "28px auto 0", padding: "0 20px" }}>
        <div style={{
          background: "white",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 8px 24px rgba(15,118,110,0.04)"
        }}>
          <h1 style={{ margin: 0, fontSize: 28 }}>Get medical help fast</h1>
          <p style={{ marginTop: 8, color: "var(--muted)" }}>
            Start with a short AI-assisted triage. We'll recommend the right specialist and help you book an available slot instantly.
          </p>

          <div style={{ marginTop: 18, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <button
              className="btn-primary"
              onClick={() => navigate("/triage")}
              style={{ padding: "12px 18px", fontSize: 16 }}
            >
              Start Triage
            </button>

            <button
              className="btn-outline"
              onClick={() => navigate("/doctors")}
              title="Browse all doctors"
            >
              Browse Doctors
            </button>

            <div style={{ marginLeft: "auto", color: "var(--muted)", fontSize: 14 }}>
              Or go to <a href="/admin">Admin</a> to manage doctors/slots.
            </div>
          </div>
        </div>

        <div style={{ marginTop: 18, color: "var(--muted)" }}>
          <h3 style={{ marginTop: 20 }}>How it works</h3>
          <ol style={{ paddingLeft: 18 }}>
            <li>Describe your symptoms (short text).</li>
            <li>AI recommends the right specialist.</li>
            <li>Choose a doctor and pick an available slot.</li>
            <li>Confirm booking — done!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
