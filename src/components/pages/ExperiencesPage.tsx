"use client";

import { useState, useEffect, useMemo } from "react";
import {
  tldrText,
  education,
  work,
  otherWork,
} from "@/data/experiences";
import { fetchExperiences, type ExperienceItem } from "@/lib/firebase";

function NestedBullet({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <li style={{ fontSize: "16px", lineHeight: 1.7, color: "#333333", marginBottom: "6px" }}>
      {lines.map((line, i) => {
        const isSubItem = line.startsWith("  - ") || line.startsWith("    - ");
        const trimmed = line.replace(/^[\s-]+/, "");
        if (i === 0) {
          return <span key={i}>{line}</span>;
        }
        return (
          <div key={i} style={{ paddingLeft: isSubItem ? "20px" : "0", marginTop: "2px" }}>
            {trimmed}
          </div>
        );
      })}
    </li>
  );
}

export default function ExperiencesPage() {
  const [firebaseData, setFirebaseData] = useState<ExperienceItem[]>([]);
  const useFirebase = useMemo(() => firebaseData.length > 0, [firebaseData]);

  useEffect(() => {
    fetchExperiences().then((data) => {
      if (data.length > 0) setFirebaseData(data);
    });
  }, []);

  if (useFirebase) {
    const grouped: Record<string, ExperienceItem[]> = {
      education: [],
      work: [],
      other: [],
    };
    firebaseData.forEach((item) => {
      if (grouped[item.type]) {
        grouped[item.type].push(item);
      } else {
        grouped.other.push(item);
      }
    });

    const sections: { key: string; title: string; items: ExperienceItem[] }[] = [
      { key: "education", title: "Education", items: grouped.education },
      { key: "work", title: "Work", items: grouped.work },
      { key: "other", title: "Other work", items: grouped.other },
    ].filter((s) => s.items.length > 0);

    return (
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 24px 64px" }}>
        <div className="stagger-in" style={{ animationDelay: "0ms" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#b833ff",
              marginBottom: "4px",
            }}
          >
            experiences
          </h1>
          <p
            style={{
              fontSize: "16px",
              lineHeight: 1.7,
              color: "#333333",
              marginBottom: "28px",
            }}
          >
            {tldrText}
          </p>
        </div>

        {sections.map((section, si) => (
          <div key={section.key}>
            <h2
              className="stagger-in"
              style={{
                fontSize: "24px",
                fontWeight: 600,
                color: "#333333",
                marginBottom: "16px",
                paddingBottom: "6px",
                animationDelay: `${(si + 1) * 60}ms`,
                ...(si === 0
                  ? { borderBottom: "1px solid #eaeaea" }
                  : { borderTop: "1px solid #eaeaea", paddingTop: "12px" }),
              }}
            >
              {section.title}
            </h2>
            {section.items.map((item, itemIdx) => (
              <div key={item.id} className="stagger-in" style={{ marginBottom: "28px", animationDelay: `${(si + 1) * 60 + (itemIdx + 1) * 60}ms` }}>
                <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#333333", marginBottom: "2px" }}>
                  <a href={item.institutionLink} className="inline-link">
                    {item.institution}
                  </a>
                </h3>
                {item.degree && (
                  <p style={{ fontSize: "16px", color: "#333333", marginBottom: "3px" }}>
                    {item.degree}
                  </p>
                )}
                <p style={{ fontSize: "13px", color: "#999999", marginBottom: "10px" }}>
                  {item.dateRange} | {item.location}
                </p>
                {item.details && (
                  <div
                    style={{ fontSize: "16px", lineHeight: 1.7, color: "#333333" }}
                    dangerouslySetInnerHTML={{ __html: item.details }}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Static fallback
  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 24px 64px" }}>
      <div className="stagger-in" style={{ animationDelay: "0ms" }}>
        {/* Page Title */}
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#b833ff",
            marginBottom: "4px",
          }}
        >
          experiences
        </h1>

        {/* TL;DR */}
        <p
          style={{
            fontSize: "16px",
            lineHeight: 1.7,
            color: "#333333",
            marginBottom: "28px",
          }}
        >
          {tldrText}
        </p>
      </div>

      {/* Education */}
      <h2
        className="stagger-in"
        style={{
          fontSize: "24px",
          fontWeight: 600,
          color: "#333333",
          marginBottom: "16px",
          paddingBottom: "6px",
          borderBottom: "1px solid #eaeaea",
          animationDelay: "60ms",
        }}
      >
        Education
      </h2>
      {education.map((edu, idx) => (
        <div
          key={idx}
          className="stagger-in"
          style={{ marginBottom: "28px", animationDelay: `${60 + (idx + 1) * 60}ms` }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#333333", marginBottom: "2px" }}>
            <a href={edu.institutionLink} className="inline-link">
              {edu.institution}
            </a>
          </h3>
          <p style={{ fontSize: "16px", color: "#333333", marginBottom: "3px" }}>
            {edu.degree}
          </p>
          <p style={{ fontSize: "13px", color: "#999999", marginBottom: "10px" }}>
            {edu.dateRange} | {edu.location}
          </p>
          <ul style={{ paddingLeft: "18px", margin: 0, listStyleType: "disc" }}>
            {edu.details.map((detail, di) => (
              <NestedBullet key={di} text={detail} />
            ))}
          </ul>
        </div>
      ))}

      {/* Work */}
      <h2
        className="stagger-in"
        style={{
          fontSize: "24px",
          fontWeight: 600,
          color: "#333333",
          marginBottom: "16px",
          paddingBottom: "6px",
          borderTop: "1px solid #eaeaea",
          paddingTop: "12px",
          animationDelay: "120ms",
        }}
      >
        Work
      </h2>
      {work.map((job, idx) => (
        <div
          key={idx}
          className="stagger-in"
          style={{ marginBottom: "28px", animationDelay: `${120 + (idx + 1) * 60}ms` }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#333333", marginBottom: "2px" }}>
            <a href={job.companyLink} className="inline-link">
              {job.company}
            </a>
          </h3>
          <p style={{ fontSize: "16px", color: "#333333", marginBottom: "2px" }}>
            {job.role}
          </p>
          {job.supervisor && (
            <p style={{ fontSize: "13px", color: "#666666", marginBottom: "2px" }}>
              {job.supervisor}
            </p>
          )}
          <p style={{ fontSize: "13px", color: "#999999", marginBottom: "8px" }}>
            {job.dateRange} | {job.location}
          </p>
          {job.description && (
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.7,
                color: "#333333",
                marginBottom: "8px",
                fontStyle: "italic",
              }}
            >
              {job.description}
            </p>
          )}
          {job.bullets.length > 0 && (
            <ul style={{ paddingLeft: "18px", margin: 0, listStyleType: "disc" }}>
              {job.bullets.map((bullet, bi) => (
                <li
                  key={bi}
                  style={{
                    fontSize: "16px",
                    lineHeight: 1.7,
                    color: "#333333",
                    marginBottom: "6px",
                  }}
                >
                  {bullet}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {/* Other work */}
      <h2
        className="stagger-in"
        style={{
          fontSize: "24px",
          fontWeight: 600,
          color: "#333333",
          marginBottom: "16px",
          paddingBottom: "6px",
          borderTop: "1px solid #eaeaea",
          paddingTop: "12px",
          animationDelay: "180ms",
        }}
      >
        Other work
      </h2>
      {otherWork.map((job, idx) => (
        <div
          key={idx}
          className="stagger-in"
          style={{ marginBottom: "28px", animationDelay: `${180 + (idx + 1) * 60}ms` }}
        >
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#333333", marginBottom: "2px" }}>
            <a href={job.companyLink} className="inline-link">
              {job.company}
            </a>
          </h3>
          <p style={{ fontSize: "16px", color: "#333333", marginBottom: "2px" }}>
            {job.role}
          </p>
          {job.supervisor && (
            <p style={{ fontSize: "13px", color: "#666666", marginBottom: "2px" }}>
              {job.supervisor}
            </p>
          )}
          <p style={{ fontSize: "13px", color: "#999999", marginBottom: "8px" }}>
            {job.dateRange} | {job.location}
          </p>
          {job.description && (
            <p
              style={{
                fontSize: "16px",
                lineHeight: 1.7,
                color: "#333333",
                marginBottom: "8px",
                fontStyle: "italic",
              }}
            >
              {job.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}