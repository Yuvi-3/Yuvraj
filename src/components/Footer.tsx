export default function Footer() {
  return (
    <footer
      className="w-full mt-auto"
      style={{ borderTop: "1px solid var(--border-primary)" }}
    >
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "24px" }}>
        <p
          className="text-center"
          style={{ fontSize: "13px", color: "var(--text-muted)" }}
        >
          &copy; Copyright 2026 Yuvraj Dutt. Built with Next.js, TypeScript, and Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}