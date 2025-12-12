// src/pages/DoctorsBySpecialtyPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getDoctorsBySpecialty } from "../api/shows";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function DoctorsBySpecialtyPage() {
  const q = useQuery();
  const specialty = q.get("specialty") || "";
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!specialty) {
      // if no specialty in query, redirect to triage
      navigate("/triage");
      return;
    }

    setLoading(true);
    setError(null);
    setDoctors([]);
    getDoctorsBySpecialty(specialty)
      .then((d) => {
        // normalize to array
        setDoctors(Array.isArray(d) ? d : (d ? [d] : []));
      })
      .catch((e) => {
        setError(e?.message || "Failed to load doctors");
      })
      .finally(() => setLoading(false));
  }, [specialty, navigate]);

  // client-side search filter
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    if (!s) return doctors;
    return doctors.filter((doc) =>
      `${doc.name} ${doc.specialty}`.toLowerCase().includes(s)
    );
  }, [doctors, search]);

  return (
    <div className="container" style={{ padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <Link to="/triage" style={{ textDecoration: "none" }}>
          <button className="btn-outline">← Back to triage</button>
        </Link>

        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0 }}>Doctors — {specialty}</h2>
          <div className="muted" style={{ marginTop: 6 }}>
            Found {doctors.length} doctor{doctors.length !== 1 ? "s" : ""} for “{specialty}”
          </div>
        </div>

        <div>
          <input
            aria-label="search doctors"
            placeholder="Search by name or keyword"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "8px 10px",
              borderRadius: 8,
              border: "1px solid #e6eef0",
              minWidth: 220,
            }}
          />
        </div>
      </div>

      {loading && <div className="muted">Loading doctors...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {!loading && !error && filtered.length === 0 && (
        <div style={{ marginTop: 18 }} className="muted">
          No doctors match your search. Try a different keyword or go back to triage.
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        {filtered.map((doc: any) => (
          <div key={doc.id} className="show-card" style={{ alignItems: "center" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{
                width: 56, height: 56, borderRadius: 10, background: "#f0fbfa",
                display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "var(--primary)"
              }}>
                {doc.name ? doc.name.split(" ").map(n => n[0]).slice(0,2).join("") : "DR"}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{doc.name}</div>
                <div className="muted" style={{ marginTop: 4 }}>{doc.specialty}</div>
                {doc.description && <div className="muted" style={{ marginTop: 6, fontSize: 13 }}>{doc.description}</div>}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Link to={`/slots/${doc.id}`}>
                <button className="btn-primary">View Slots</button>
              </Link>
              <button
                className="btn-sm"
                onClick={() => {
                  // quick filter to other doctors of same specialty (keeps user on page)
                  setSearch(doc.name);
                }}
              >
                Quick search
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
