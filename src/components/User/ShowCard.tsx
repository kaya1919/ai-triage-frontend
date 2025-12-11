// src/components/User/ShowCard.tsx
import { Link } from "react-router-dom";
import type { DoctorOrShow } from "../../types";

export default function ShowCard({ show }: { show: DoctorOrShow }) {
  const start = show.start_time ? new Date(show.start_time).toLocaleString() : "N/A";
  return (
    <div style={{
      border: "1px solid #eee",
      padding: 12,
      borderRadius: 8,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10
    }}>
      <div>
        <div style={{ fontWeight: 700 }}>{show.name}</div>
        <div style={{ color: "#555", fontSize: 13 }}>{show.specialty ?? `Start: ${start}`}</div>
        { typeof show.total_seats !== "undefined" && show.total_seats !== null && (
          <div style={{ fontSize: 13, color: "#666" }}>Seats: {show.total_seats}</div>
        )}
      </div>

      <div>
        <Link to={`/booking/${show.id}`}>
          <button style={{ padding: "8px 12px", borderRadius: 6 }}>View / Book</button>
        </Link>
      </div>
    </div>
  );
}
