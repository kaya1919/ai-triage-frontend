// src/components/Admin/CreateShowForm.tsx
import { useState, useContext } from "react";
import ErrorBox from "../common/ErrorBox";
import { createShow } from "../../api/api";
import { ShowsContext } from "../../context/ShowsContext";

export default function CreateShowForm() {
  const ctx = useContext(ShowsContext);
  const refreshShows = ctx?.refreshShows;

  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      await createShow({ name, specialty });

      setSuccess("Show created successfully!");
      setName("");
      setSpecialty("");

      if (refreshShows) {
        await refreshShows();  // 🔥 IMPORTANT
      }

    } catch (err) {
      console.error(err);
      setError("Failed to create show");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <ErrorBox message={error} />}
      {success && <div style={{ color: "green" }}>{success}</div>}

      <div>
        <label>Name:</label><br />
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Specialty:</label><br />
        <input value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
      </div>

      <button type="submit" style={{ marginTop: 10 }}>
        Create
      </button>
    </form>
  );
}
