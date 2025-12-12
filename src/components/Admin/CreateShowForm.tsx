// src/components/Admin/CreateShowForm.tsx
import { useState, useContext } from "react";
import ErrorBox from "../common/ErrorBox";
import { createDoctor } from "../../api/api";
import { ShowsContext } from "../../context/ShowsContext";

export default function CreateShowForm() {
  const ctx = useContext(ShowsContext);
  const refreshShows = ctx?.refreshShows;

  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setLoading(true);
    try {
      await createDoctor({ name, specialty });

      setSuccess("Doctor created successfully!");
      setName("");
      setSpecialty("");

      if (refreshShows) {
        await refreshShows(); // refresh context data
      }
    } catch (err: any) {
      console.error(err);
      const msg = err?.response?.data?.error || err?.message || "Failed to create doctor";
      setError(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 560, marginBottom: 20 }}>
      <ErrorBox message={error} />

      {success && <div style={{ color: "green", marginBottom: 8 }}>{success}</div>}

      <div style={{ marginBottom: 10 }}>
        <label style={{ display: "block", fontWeight: 600 }}>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Doctor / Show name"
          style={{ width: "100%", padding: 8, borderRadius: 6 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ display: "block", fontWeight: 600 }}>Specialty</label>
        <input
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          placeholder="Specialty (e.g., Cardiology)"
          style={{ width: "100%", padding: 8, borderRadius: 6 }}
        />
      </div>

      <div>
        <button type="submit" disabled={loading} style={{ padding: "8px 14px", borderRadius: 6 }}>
          {loading ? "Creating..." : "Create"}
        </button>
      </div>
    </form>
  );
}
