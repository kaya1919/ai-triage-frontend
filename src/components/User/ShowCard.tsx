// src/components/User/ShowCard.tsx
import { Link } from "react-router-dom";
import type { DoctorOrShow } from "../../types";

export default function ShowCard({ show }: { show: DoctorOrShow }) {
  const start = show.start_time
    ? new Date(show.start_time).toLocaleString()
    : "N/A";

  return (
    <div className="show-card">
      <div className="meta">
        <div className="title">{show.name}</div>

        <div className="muted">
          {show.specialty ?? `Start: ${start}`}
        </div>

        {typeof show.total_seats !== "undefined" &&
          show.total_seats !== null && (
            <div className="muted">Seats: {show.total_seats}</div>
          )}
      </div>

      <div>
        <Link to={`/booking/${show.id}`}>
          <button className="btn-sm">View / Book</button>
        </Link>
      </div>
    </div>
  );
}
