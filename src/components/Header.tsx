"use client";

import { useState } from "react";
import {
  Mail,
  Github,
  Linkedin,
  BookOpen,
  Sun,
  Moon,
  Menu,
  X,
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
  isDark: boolean;
  onToggleTheme: () => void;
}

export default function Header({
  activeTab,
  onTabChange,
  isDark,
  onToggleTheme,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: string) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className="w-full"
      style={{ borderBottom: "1px solid var(--border-primary)" }}
    >
      <div
        className="mx-auto flex items-center justify-between"
        style={{ maxWidth: "680px", height: "48px", padding: "0 24px" }}
      >
        {/* Left: Social icons + Theme toggle */}
        <div className="flex items-center gap-2">
          {/* Social Icons — hidden on mobile */}
          <div className="hidden sm:flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{ color: "var(--text-secondary)" }}
                className="social-icon"
                aria-label={link.label}
              >
                <link.icon size={15} strokeWidth={1.5} />
              </a>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className="theme-toggle"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <Sun size={16} strokeWidth={1.5} />
            ) : (
              <Moon size={16} strokeWidth={1.5} />
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden theme-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={18} strokeWidth={1.5} />
            ) : (
              <Menu size={18} strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden sm:flex items-center" style={{ gap: "14px" }}>
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(item);
              }}
              className={`nav-link ${activeTab === item ? "nav-active" : ""}`}
              style={{
                fontSize: "14px",
                color: activeTab === item ? "var(--accent)" : "var(--text-secondary)",
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

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          className="sm:hidden mobile-menu"
          style={{
            borderTop: "1px solid var(--border-primary)",
            background: "var(--bg-primary)",
          }}
        >
          <div style={{ maxWidth: "680px", margin: "0 auto", padding: "12px 24px 16px" }}>
            {/* Mobile social icons row */}
            <div className="flex items-center gap-4" style={{ marginBottom: "12px" }}>
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{ color: "var(--text-secondary)" }}
                  className="social-icon"
                  aria-label={link.label}
                >
                  <link.icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>

            {/* Mobile nav links */}
            <nav className="flex flex-col" style={{ gap: "2px" }}>
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(item);
                  }}
                  style={{
                    fontSize: "15px",
                    color: activeTab === item ? "var(--accent)" : "var(--text-secondary)",
                    fontWeight: activeTab === item ? 500 : 400,
                    padding: "8px 0",
                    borderBottom: "1px solid var(--border-secondary)",
                    textDecoration: "none",
                    transition: "color 0.15s ease",
                  }}
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}