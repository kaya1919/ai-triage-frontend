// src/components/Admin/ShowsListAdmin.tsx
import { useContext } from "react";
import { ShowsContext } from "../../context/ShowsContext";
import Spinner from "../common/Spinner";
import ErrorBox from "../common/ErrorBox";

export default function ShowsListAdmin() {
  const ctx = useContext(ShowsContext);

  if (!ctx) return <ErrorBox message="ShowsContext not found" />;

  const { shows } = ctx;

  if (shows === null) return <Spinner text="Loading shows..." />;

  if (shows.length === 0)
    return <ErrorBox message="No shows found. Create one above." />;

  return (
    <div style={{ marginTop: 12 }}>
      {shows.map((s) => (
        <div
          key={s.id}
          style={{
            padding: 10,
            border: "1px solid #ddd",
            borderRadius: 6,
            marginBottom: 10,
          }}
        >
          <div><strong>Name:</strong> {s.name}</div>
          <div><strong>Specialty:</strong> {s.specialty ?? "N/A"}</div>
          {s.start_time && (
            <div><strong>Start:</strong> {new Date(s.start_time).toLocaleString()}</div>
          )}
          {typeof s.total_seats !== "undefined" && (
            <div><strong>Total seats:</strong> {s.total_seats}</div>
          )}
        </div>
      ))}
    </div>
  );
}
