const grants = [
  {
    title: "Founder — HalcyResearch",
    org: "HalcyResearch",
  },
];

export default function GrantsPage() {
  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 16px 64px" }}>
      <div className="stagger-in" style={{ animationDelay: "0ms" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--accent)", marginBottom: "4px" }}>
          grants & awards
        </h1>
        <p style={{ fontSize: "16px", fontWeight: 400, color: "var(--text-secondary)", marginBottom: "24px" }}>
          recognitions, contributions, open-source work, achievements, ...
        </p>
      </div>

      <ul style={{ paddingLeft: "18px", margin: 0 }}>
        {grants.map((grant, idx) => (
          <li
            key={idx}
            className="stagger-in"
            style={{
              animationDelay: `${(idx + 1) * 60}ms`,
              fontSize: "16px",
              lineHeight: 1.7,
              color: "var(--text-primary)",
              marginBottom: "16px",
            }}
          >
            <span style={{ fontWeight: 500 }}>{grant.title}</span>
            <br />
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{grant.org}</span>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "32px", padding: "24px", backgroundColor: "var(--bg-secondary)", borderRadius: "8px", border: "1px dashed var(--border-tertiary)" }}>
        <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--text-secondary)" }}>
          <b style={{ color: "var(--text-primary)" }}>Growing:</b> This section will be updated as I continue my academic and professional journey. I am actively working towards research grants, hackathon participations, and academic recognitions in the fields of quantitative finance and machine learning.
        </p>
      </div>
    </div>
  );
}