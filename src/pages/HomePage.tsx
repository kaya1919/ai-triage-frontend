// src/pages/HomePage.tsx
import ShowsList from "../components/User/ShowsList";

export default function HomePage() {
  return (
  <div className="page-container">
    <h1>Available Shows / Doctors</h1>
    <ShowsList />
  </div>
);
}
