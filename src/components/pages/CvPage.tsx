export default function CvPage() {
  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 24px 64px" }}>
      <h1 className="stagger-in" style={{ animationDelay: "0ms", fontSize: "28px", fontWeight: 700, color: "#b833ff", marginBottom: "4px" }}>
        cv
      </h1>

      <div className="stagger-in" style={{
        animationDelay: "60ms",
        padding: "40px",
        border: "2px dashed #e0e0e0",
        borderRadius: "8px",
        textAlign: "center",
        backgroundColor: "#fafafa",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px", color: "#cccccc" }}>📄</div>
        <p style={{ fontSize: "16px", color: "#666666", marginBottom: "8px", fontWeight: 500 }}>
          Download my CV
        </p>
        <p style={{ fontSize: "14px", color: "#999999", marginBottom: "24px" }}>
          A comprehensive PDF with all my academic and professional details.
        </p>
        <a
          href="#"
          style={{
            display: "inline-block",
            padding: "10px 28px",
            backgroundColor: "#b833ff",
            color: "#ffffff",
            borderRadius: "6px",
            fontSize: "15px",
            fontWeight: 500,
            textDecoration: "none",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundColor = "#a028e0"; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = "#b833ff"; }}
        >
          Download PDF
        </a>
      </div>

      <div style={{ marginTop: "32px" }}>
        <p style={{ fontSize: "14px", color: "#666666" }}>
          <b style={{ color: "#666666" }}>Note:</b> For the most up-to-date information, please refer to the individual sections of this website (experiences, publications, teaching, talks, grants). The CV PDF may not always reflect the very latest updates.
        </p>
      </div>
    </div>
  );
}