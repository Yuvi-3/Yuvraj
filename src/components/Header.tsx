"use client";

import {
  Mail,
  Github,
  Linkedin,
  BookOpen,
} from "lucide-react";

const socialLinks = [
  { icon: Mail, href: "mailto:Yuvikvara@gmail.com", label: "Email" },
  { icon: Github, href: "https://github.com/Yuvi-3", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/yuvraj-dutt-74476836b/", label: "LinkedIn" },
  { icon: BookOpen, href: "https://medium.com/@yuvikvara", label: "Medium" },
];

const navItems = [
  "about",
  "blog",
  "experiences",
  "open-source",
  "publications",
  "teaching",
  "talks",
  "grants",
  "cv",
];

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNavigateHome: () => void;
}

export default function Header({
  activeTab,
  onTabChange,
}: HeaderProps) {
  return (
    <header
      className="w-full"
      style={{ borderBottom: "1px solid #eaeaea" }}
    >
      <div
        className="mx-auto px-6 flex items-center justify-between"
        style={{ maxWidth: "680px", height: "48px" }}
      >
        {/* Social Icons - Left (Animation 5: scale on hover) */}
        <div className="flex items-center gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              style={{ color: "#666666" }}
              className="social-icon"
              aria-label={link.label}
            >
              <link.icon size={15} strokeWidth={1.5} />
            </a>
          ))}
        </div>

        {/* Nav Links - Right (Animation 2: underline slide) */}
        <nav className="flex items-center" style={{ gap: "14px" }}>
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              onClick={(e) => {
                e.preventDefault();
                onTabChange(item);
              }}
              className={`nav-link ${activeTab === item ? "nav-active" : ""}`}
              style={{
                fontSize: "14px",
                color: activeTab === item ? "#b833ff" : "#666666",
                fontWeight: activeTab === item ? 500 : 400,
                whiteSpace: "nowrap",
                transition: "color 0.15s ease",
              }}
            >
              {item}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}