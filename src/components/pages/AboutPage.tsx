"use client";

import { useState, useEffect } from "react";
import { fetchNews, NewsItem } from "@/lib/firebase";

interface AboutPageProps {
  onNavigate?: (tab: string) => void;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews()
      .then(setNewsItems)
      .catch((err) => {
        console.error("Failed to load news from Firebase:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleNavClick = (tab: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 24px 64px" }}>
      {/* Name and Subtitle */}
      <div className="stagger-in" style={{ marginBottom: "24px", animationDelay: "0ms" }}>
        <h1
          style={{
            fontSize: "36px",
            fontWeight: 700,
            color: "#333333",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            marginBottom: "4px",
          }}
        >
          Yuvraj Dutt
        </h1>
        <p style={{ fontSize: "16px", fontWeight: 400, color: "#666666" }}>
          quantitative finance · machine learning · open source
        </p>
      </div>

      {/* Bio Section — text LEFT-aligned, image flush RIGHT, ~20px gap */}
      <div className="stagger-in" style={{ display: "flex", gap: "20px", marginBottom: "48px", alignItems: "flex-start", animationDelay: "60ms" }}>
        {/* Bio Text — LEFT aligned */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#333333", marginBottom: "16px" }}>
            I am an aspiring <a href="https://en.wikipedia.org/wiki/Quantitative_finance" target="_blank" rel="noopener noreferrer" className="inline-link"><b>Quantitative Finance</b></a> professional and <a href="https://en.wikipedia.org/wiki/Machine_learning" target="_blank" rel="noopener noreferrer" className="inline-link"><b>Machine Learning</b></a> Engineer with a deep passion for building systems at the intersection of finance, artificial intelligence, and open-source software. My work spans quantitative modeling, algorithmic trading research, deep learning, and systems programming.
          </p>

          <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#333333", marginBottom: "16px" }}>
            I am currently pursuing a <a href="https://iitj.ac.in/Executive-Programs/en/B.Sc-B.S-in-Applied-AI-and-Data-Science" target="_blank" rel="noopener noreferrer" className="inline-link"><b>BS in Artificial Intelligence at IIT Jodhpur</b></a>. Alongside my studies, I actively contribute to open-source projects and work on independent AI and quantitative finance research
            (
            <a
              href="#experiences"
              onClick={handleNavClick("experiences")}
              className="inline-link"
            >
              /experiences
            </a>
            ).
          </p>

          <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#333333", marginBottom: "16px" }}>
            I have interned at <a href="https://skillcrafttech.com/" target="_blank" rel="noopener noreferrer" className="inline-link"><b>SkillCraft Technologies</b></a> and completed a <a href="https://www.kyoto-u.ac.jp" target="_blank" rel="noopener noreferrer" className="inline-link"><b>hybrid apprenticeship at Kyoto University</b></a>. I am also involved with <a href="https://github.com/heygen-com/hyperframes" target="_blank" rel="noopener noreferrer" className="inline-link"><b>Hyperframes</b></a> and open-source AI developer tools
            (
            <a
              href="#open-source"
              onClick={handleNavClick("open-source")}
              className="inline-link"
            >
              /open-source
            </a>
            ).
          </p>

          <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#333333" }}>
            I am currently interested in <a href="https://en.wikipedia.org/wiki/Machine_learning" target="_blank" rel="noopener noreferrer" className="inline-link"><b>Machine Learning Engineering</b></a>
            (Computer Vision, NLP, Edge AI, Systems for ML), <a href="https://en.wikipedia.org/wiki/Quantitative_finance" target="_blank" rel="noopener noreferrer" className="inline-link"><b>Quantitative Finance</b></a>
            (Algorithmic Trading, Derivatives Pricing, Risk Models), and <b>Systems Programming</b>
            (C++, Rust, High-Performance Computing). I advocate for and am extremely passionate about <b>open-source</b> and <b>open-science</b>.
          </p>
        </div>

        {/* Profile Photo — flush RIGHT */}
        <div style={{ flexShrink: 0 }}>
          <div className="about-img-wrap" style={{ width: "170px", height: "210px" }}>
            <img
              src="/profile.jpg"
              alt="Yuvraj Dutt"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                if (target.parentElement) {
                  target.parentElement.innerHTML = `
                    <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
                      <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#bbb" stroke-width="1">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  `;
                }
              }}
            />
          </div>
          <div style={{ marginTop: "8px" }}>
            <p style={{ fontSize: "13px", color: "#666666", lineHeight: 1.4 }}>
              New Delhi, India
            </p>
            <a
              href="mailto:Yuvikvara@gmail.com"
              className="inline-link"
              style={{ fontSize: "13px", lineHeight: 1.4 }}
            >
              Yuvikvara@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* News Section */}
      <section className="stagger-in" style={{ animationDelay: "180ms" }}>
        <h2 style={{ fontSize: "24px", fontWeight: 600, color: "#333333", marginBottom: "16px" }}>
          news
        </h2>
        <div>
          {loading ? (
            <p style={{ fontSize: "16px", color: "#999999" }}>Loading news...</p>
          ) : newsItems.length === 0 ? (
            <p style={{ fontSize: "16px", color: "#999999" }}>
              No news yet.
            </p>
          ) : (
            newsItems.map((item) => (
              <div
                key={item.id}
                style={{ display: "flex", gap: "16px", marginBottom: "12px", lineHeight: 1.7 }}
              >
                <span
                  style={{
                    fontSize: "16px",
                    color: "#333333",
                    minWidth: "100px",
                    flexShrink: 0,
                  }}
                >
                  {item.date}
                </span>
                <p style={{ fontSize: "16px", color: "#333333" }}>
                  {item.content}
                </p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}