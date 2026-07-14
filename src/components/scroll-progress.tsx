"use client";

import { useEffect, useState } from "react";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.round(scrollPercent));
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Progress bar at very top */}
      <div className="fixed top-0 left-0 w-full z-50" style={{ height: "2px" }}>
        <div
          className="h-full"
          style={{
            width: `${progress}%`,
            background: "#b833ff",
            transition: "width 0.05s linear",
          }}
        />
      </div>
      {/* Percentage text */}
      <div
        className="fixed z-50"
        style={{
          top: "10px",
          right: "20px",
          fontSize: "11px",
          color: "#999999",
          fontFamily: "monospace",
        }}
      >
        {progress}%
      </div>
    </>
  );
}