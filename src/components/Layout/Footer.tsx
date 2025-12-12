// src/components/Layout/Footer.tsx

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div>© {new Date().getFullYear()} AI Triage Hospital</div>
        <div className="footer-right">
          Contact: +91 98765 43210 · support@aitriage.local
        </div>
      </div>
    </footer>
  );
}
