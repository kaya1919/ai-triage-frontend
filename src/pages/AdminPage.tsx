// src/pages/AdminPage.tsx
import CreateShowForm from "../components/Admin/CreateShowForm";
import ShowsListAdmin from "../components/Admin/ShowsListAdmin";
import Spinner from "../components/common/Spinner";
import ErrorBox from "../components/common/ErrorBox";
import { useContext } from "react";
import { ShowsContext } from "../context/ShowsContext";

export default function AdminPage() {
  const ctx = useContext(ShowsContext);
  const shows = ctx?.shows ?? null;

  return (
    <div className="page-container">
      <h1>Admin Dashboard</h1>

      <h2>Create New Show / Doctor / Trip</h2>
      <CreateShowForm />

      <h2 style={{ marginTop: 20 }}>Existing Shows</h2>

      {shows === null ? (
        <Spinner text="Loading shows..." />
      ) : shows.length === 0 ? (
        <ErrorBox message="No shows found." />
      ) : (
        <ShowsListAdmin />
      )}
    </div>
  );
}
