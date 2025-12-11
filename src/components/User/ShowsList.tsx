// src/components/User/ShowsList.tsx
import { useContext, useState } from "react";
import { ShowsContext } from "../../context/ShowsContext";
import Spinner from "../common/Spinner";
import ErrorBox from "../common/ErrorBox";
import ShowCard from "./ShowCard";

export default function ShowsList() {
  const ctx = useContext(ShowsContext);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!ctx) return <div>Error: ShowsContext missing</div>;

  const { shows, refreshShows } = ctx;

  // loading state
  if (shows === null) return <Spinner text="Loading shows..." />;

  // empty state
  if (shows.length === 0)
    return (
      <div>
        <p>No shows available.</p>
        <button onClick={() => refreshShows().catch((e) => setLocalError(String(e)))}>
          Retry
        </button>
        <ErrorBox message={localError} />
      </div>
    );

  return (
    <div>
      <button
        onClick={() => refreshShows().catch((e) => setLocalError(String(e)))}
        style={{ marginBottom: 10 }}
      >
        Refresh
      </button>
      <ErrorBox message={localError} />

      {shows.map((s) => (
        <ShowCard key={s.id} show={s} />
      ))}
    </div>
  );
}
