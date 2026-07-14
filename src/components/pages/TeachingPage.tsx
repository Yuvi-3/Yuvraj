"use client";

import { useState, useEffect, useMemo } from "react";
import { fetchTeaching, type TeachingItem } from "@/lib/firebase";

interface StaticTeachingEntry {
  org: string;
  role: string | null;
  date: string;
  location: string;
  bullets: string[];
}

const staticTeachingEntries: StaticTeachingEntry[] = [
  {
    org: "Open Source Community",
    role: "Technical Content Creator",
    date: "2024 - Present",
    location: "Remote",
    bullets: [
      "Creating programming tutorials and technical documentation focused on Python, C++, and machine learning.",
      "Writing educational blog posts on AI, quantitative finance, and software engineering best practices.",
      "Building and maintaining educational repositories with hands-on coding exercises and projects.",
    ],
  },
  {
    org: "Peer Learning & Mentorship",
    role: null,
    date: "2023 - Present",
    location: "Remote",
    bullets: [
      "Mentoring peers and junior developers in programming, data structures, algorithms, and machine learning fundamentals.",
      "Conducting study groups on quantitative finance topics including stochastic calculus and options pricing theory.",
      "Helping beginners get started with open-source contribution through guided workshops and pair programming sessions.",
    ],
  },
];

export default function TeachingPage() {
  const [firebaseData, setFirebaseData] = useState<TeachingItem[]>([]);
  const useFirebase = useMemo(() => firebaseData.length > 0, [firebaseData]);

  useEffect(() => {
    fetchTeaching().then((data) => {
      if (data.length > 0) setFirebaseData(data);
    });
  }, []);

  if (useFirebase) {
    return (
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 24px 64px" }}>
        <div className="stagger-in" style={{ animationDelay: "0ms" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--accent)", marginBottom: "4px" }}>
            teaching
          </h1>
          <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "24px" }}>
            tutorials, documentation, mentoring, educational resources, ...
          </p>
        </div>

        <p style={{ fontSize: "16px", lineHeight: 1.7, color: "var(--text-primary)", marginBottom: "28px" }}>
          I am passionate about sharing knowledge and helping others learn. This includes creating educational content, mentoring aspiring developers, and contributing to open-source educational resources. For my open-source work, please see{" "}
          <a href="#" onClick={(e) => { e.preventDefault(); }} className="inline-link">/opensource</a>.
        </p>

        {firebaseData.map((item, idx) => (
          <div key={item.id} className="stagger-in" style={{ animationDelay: `${(idx + 1) * 60}ms`, marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid var(--border-secondary)" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>
              <a href={item.orgLink} className="inline-link">{item.orgName}</a>
            </h3>
            {item.role && (
              <p style={{ fontSize: "16px", color: "var(--text-primary)", marginBottom: "2px" }}>{item.role}</p>
            )}
            <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>
              {item.date} | {item.location}
            </p>
            {item.bullets && (
              <div
                style={{ fontSize: "16px", lineHeight: 1.7, color: "var(--text-primary)" }}
                dangerouslySetInnerHTML={{ __html: item.bullets }}
              />
            )}
          </div>
        ))}

        <div style={{ marginTop: "16px", padding: "24px", backgroundColor: "var(--bg-secondary)", borderRadius: "8px", border: "1px dashed var(--border-tertiary)" }}>
          <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--text-secondary)" }}>
            <b style={{ color: "var(--text-primary)" }}>Coming soon:</b> I am working on structured learning material for quantitative finance and AI, including interactive notebooks, video tutorials, and comprehensive developer guides. Stay tuned for updates on the blog.
          </p>
        </div>
      </div>
    );
  }

  // Static fallback
  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 24px 64px" }}>
      <div className="stagger-in" style={{ animationDelay: "0ms" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--accent)", marginBottom: "4px" }}>
          teaching
        </h1>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "24px" }}>
          tutorials, documentation, mentoring, educational resources, ...
        </p>
      </div>

      <p style={{ fontSize: "16px", lineHeight: 1.7, color: "var(--text-primary)", marginBottom: "28px" }}>
        I am passionate about sharing knowledge and helping others learn. This includes creating educational content, mentoring aspiring developers, and contributing to open-source educational resources. For my open-source work, please see{" "}
        <a href="#" onClick={(e) => { e.preventDefault(); }} className="inline-link">/opensource</a>.
      </p>

      {staticTeachingEntries.map((entry, idx) => (
        <div key={idx} className="stagger-in" style={{ animationDelay: `${(idx + 1) * 60}ms`, marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid var(--border-secondary)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>
            <a href="#" className="inline-link">{entry.org}</a>
          </h3>
          {entry.role && (
            <p style={{ fontSize: "16px", color: "var(--text-primary)", marginBottom: "2px" }}>{entry.role}</p>
          )}
          <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>
            {entry.date} | {entry.location}
          </p>
          <ul style={{ paddingLeft: "18px", margin: 0, listStyleType: "disc" }}>
            {entry.bullets.map((b, bi) => (
              <li key={bi} style={{ fontSize: "16px", lineHeight: 1.7, color: "var(--text-primary)", marginBottom: "6px" }}>
                {b}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div style={{ marginTop: "16px", padding: "24px", backgroundColor: "var(--bg-secondary)", borderRadius: "8px", border: "1px dashed var(--border-tertiary)" }}>
        <p style={{ fontSize: "14px", lineHeight: 1.7, color: "var(--text-secondary)" }}>
          <b style={{ color: "var(--text-primary)" }}>Coming soon:</b> I am working on structured learning material for quantitative finance and AI, including interactive notebooks, video tutorials, and comprehensive developer guides. Stay tuned for updates on the blog.
        </p>
      </div>
    </div>
  );
}