"use client";

import { useState, useEffect, useMemo } from "react";
import { fetchTalks, type TalkItem } from "@/lib/firebase";

export default function TalksPage() {
  const [firebaseData, setFirebaseData] = useState<TalkItem[]>([]);
  const useFirebase = useMemo(() => firebaseData.length > 0, [firebaseData]);

  useEffect(() => {
    fetchTalks().then((data) => {
      if (data.length > 0) setFirebaseData(data);
    });
  }, []);

  if (useFirebase) {
    return (
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 24px 64px" }}>
        <div className="stagger-in" style={{ animationDelay: "0ms" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#b833ff", marginBottom: "4px" }}>
            talks
          </h1>
          <p style={{ fontSize: "16px", color: "#666666", marginBottom: "24px" }}>
            talks, workshops, presentations, ... (past, upcoming, and planned)
          </p>
        </div>

        <ul className="stagger-in" style={{ animationDelay: "60ms", paddingLeft: "18px", margin: 0 }}>
          {firebaseData.map((talk) => (
            <li
              key={talk.id}
              style={{
                fontSize: "16px",
                lineHeight: 1.7,
                color: "#333333",
                marginBottom: "10px",
              }}
            >
              <span style={{ fontWeight: 500 }}>{talk.title}</span>
              {talk.invited && (
                <span style={{ fontSize: "13px", color: "#b833ff", marginLeft: "6px" }}>[invited]</span>
              )}
              {talk.videoUrl && (
                <a href={talk.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-link" style={{ fontSize: "13px", marginLeft: "6px" }}>video</a>
              )}
              <br />
              <span style={{ fontSize: "13px", color: "#999999" }}>{talk.venue}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // No static fallback — empty until admin adds data
  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 24px 64px" }}>
      <div className="stagger-in" style={{ animationDelay: "0ms" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#b833ff", marginBottom: "4px" }}>
          talks
        </h1>
        <p style={{ fontSize: "16px", color: "#666666", marginBottom: "24px" }}>
          talks, workshops, presentations, ... (past, upcoming, and planned)
        </p>
      </div>

      <div className="stagger-in" style={{ animationDelay: "60ms", padding: "24px", backgroundColor: "#fafafa", borderRadius: "8px", border: "1px dashed #e0e0e0" }}>
        <p style={{ fontSize: "14px", lineHeight: 1.7, color: "#999999" }}>
          No talks listed yet.
        </p>
      </div>
    </div>
  );
}