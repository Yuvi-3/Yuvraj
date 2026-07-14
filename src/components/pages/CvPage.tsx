export default function CvPage() {
  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 16px 64px" }}>
      <h1 className="stagger-in" style={{ animationDelay: "0ms", fontSize: "28px", fontWeight: 700, color: "var(--accent)", marginBottom: "4px" }}>
        cv
      </h1>

      <div className="stagger-in" style={{
        animationDelay: "60ms",
        padding: "40px 24px",
        border: "2px dashed var(--border-tertiary)",
        borderRadius: "8px",
        textAlign: "center",
        backgroundColor: "var(--bg-secondary)",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px", color: "var(--text-muted)" }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "8px", fontWeight: 500 }}>
          Download my CV
        </p>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "24px" }}>
          A comprehensive PDF with all my academic and professional details.
        </p>
        <a
          href="#"
          style={{
            display: "inline-block",
            padding: "10px 28px",
            backgroundColor: "var(--accent)",
            color: "#ffffff",
            borderRadius: "6px",
            fontSize: "15px",
            fontWeight: 500,
            textDecoration: "none",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundColor = "var(--accent-hover)"; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = "var(--accent)"; }}
        >
          Download PDF
        </a>
      </div>

      <div style={{ marginTop: "32px" }}>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
          <b style={{ color: "var(--text-secondary)" }}>Note:</b> For the most up-to-date information, please refer to the individual sections of this website (experiences, publications, teaching, talks, grants). The CV PDF may not always reflect the very latest updates.
        </p>
      </div>
    </div>
  );
}