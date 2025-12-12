// src/components/Layout/Hero.tsx
export default function Hero() {
  return (
    <section className="hero" style={{ padding: "14px 0" }}>
      <div className="container hero-inner" style={{ alignItems: "center" }}>
        {/* small, unobtrusive banner — removed big hero visual and CTAs */}
        <div className="hero-copy" style={{ margin: 0 }}>
          {/* optionally keep a tiny subtitle or remove completely */}
        </div>
      </div>
    </section>
  );
}
