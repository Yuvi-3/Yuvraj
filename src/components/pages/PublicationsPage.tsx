"use client";

import { useState, useEffect } from "react";
import { fetchPublications, type PublicationItem } from "@/lib/firebase";

interface DisplayPublication {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: string;
  abstract: string;
  pdfUrl: string;
}

const staticPublications: DisplayPublication[] = [
  {
    id: "static-1",
    title: "Deep Learning Approaches for Financial Time Series Prediction: A Comparative Study",
    authors: "Dutt, Yuvraj",
    venue: "In Preparation",
    year: "2026",
    abstract: "",
    pdfUrl: "",
  },
  {
    id: "static-2",
    title: "Algorithmic Trading Strategy Optimization Using Reinforcement Learning",
    authors: "Dutt, Yuvraj",
    venue: "In Preparation",
    year: "2026",
    abstract: "",
    pdfUrl: "",
  },
  {
    id: "static-3",
    title: "ApproxLab: An Open-Source Framework for Approximate Computing in Scientific Applications",
    authors: "Dutt, Yuvraj, and contributors",
    venue: "Journal of Open Source Software (Planned)",
    year: "2026",
    abstract: "",
    pdfUrl: "",
  },
];

export default function PublicationsPage() {
  const [firebaseData, setFirebaseData] = useState<PublicationItem[]>([]);
  const [showAbstract, setShowAbstract] = useState<string | null>(null);

  useEffect(() => {
    fetchPublications().then((data) => {
      if (data.length > 0) setFirebaseData(data);
    });
  }, []);

  const displayData: DisplayPublication[] =
    firebaseData.length > 0
      ? firebaseData.map((item) => ({
          id: item.id,
          title: item.title,
          authors: item.authors,
          venue: item.venue,
          year: item.year,
          abstract: item.abstract,
          pdfUrl: item.pdfUrl,
        }))
      : staticPublications;

  const selectedPub = showAbstract
    ? displayData.find((p) => p.id === showAbstract)
    : null;

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 24px 64px" }}>
      <div className="stagger-in" style={{ animationDelay: "0ms" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--accent)", marginBottom: "4px" }}>
          publications
        </h1>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "24px" }}>
          research papers, technical write-ups, and future publications in ML, quantitative finance, and AI ...
        </p>
      </div>

      <ol style={{ paddingLeft: "20px", margin: 0 }}>
        {displayData.map((pub, idx) => (
          <li
            key={pub.id}
            className="stagger-in"
            style={{
              animationDelay: `${(idx + 1) * 60}ms`,
              marginBottom: "20px",
              paddingBottom: "16px",
              borderBottom: idx < displayData.length - 1 ? "1px solid var(--border-secondary)" : "none",
              lineHeight: 1.7,
            }}
          >
            <p style={{ fontSize: "16px", color: "var(--text-primary)", fontWeight: 500, marginBottom: "4px" }}>
              {pub.title}
            </p>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "4px" }}>
              {pub.authors}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              {pub.venue && (
                <span style={{ fontSize: "13px", color: "var(--text-muted)", fontStyle: "italic" }}>
                  {pub.venue}
                </span>
              )}
              {pub.venue && <span style={{ color: "var(--divider)" }}>·</span>}
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{pub.year}</span>
              {pub.abstract && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAbstract(pub.id);
                  }}
                  style={{ fontSize: "12px", color: "var(--accent)", border: "1px solid var(--border-tertiary)", borderRadius: "3px", padding: "1px 6px", background: "none", cursor: "pointer" }}
                >
                  ABS
                </button>
              )}
              {pub.pdfUrl && (
                <a
                  href={pub.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: "12px", color: "var(--accent)", border: "1px solid var(--border-tertiary)", borderRadius: "3px", padding: "1px 6px", textDecoration: "none" }}
                >
                  HTML
                </a>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div style={{ marginTop: "32px", padding: "24px", backgroundColor: "var(--bg-secondary)", borderRadius: "8px", border: "1px dashed var(--border-tertiary)" }}>
        <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--text-secondary)" }}>
          <b style={{ color: "var(--text-primary)" }}>Note:</b> More publications are in progress. I am actively working on research in machine learning for finance, quantitative trading systems, and AI developer tools. Check back for updates or follow my blog for research notes and pre-prints.
        </p>
      </div>

      {/* Abstract Modal */}
      {selectedPub && (
        <div
          onClick={() => setShowAbstract(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "var(--modal-overlay)",
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "600px",
              width: "100%",
              backgroundColor: "var(--bg-primary)",
              padding: "32px",
              borderRadius: "8px",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginBottom: "16px",
                lineHeight: 1.4,
              }}
            >
              {selectedPub.title}
            </h3>
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.7,
                color: "var(--text-primary)",
                marginBottom: "24px",
              }}
            >
              {selectedPub.abstract}
            </p>
            <button
              onClick={() => setShowAbstract(null)}
              style={{
                fontSize: "14px",
                color: "var(--accent)",
                border: "1px solid var(--border-tertiary)",
                borderRadius: "4px",
                padding: "6px 16px",
                background: "none",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}