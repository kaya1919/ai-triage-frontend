// src/components/Layout/Header.tsx
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand">
          <img src="/vite.svg" alt="Hospital Logo" className="logo" />
          <div>
            <div className="brand-title">AI Triage Hospital</div>
            <div className="brand-sub">Patient Priority & Booking System</div>
          </div>
        </div>

        <nav className="nav">
          <Link to="/">Home</Link>
          {/* removed Triage link as requested */}
          <Link to="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
