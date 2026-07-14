"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import ScrollProgress from "@/components/scroll-progress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutPage from "@/components/pages/AboutPage";
import BlogPage from "@/components/pages/BlogPage";
import BlogPostPage from "@/components/pages/BlogPostPage";
import ExperiencesPage from "@/components/pages/ExperiencesPage";
import OpenSourcePage from "@/components/pages/OpenSourcePage";
import PublicationsPage from "@/components/pages/PublicationsPage";
import TeachingPage from "@/components/pages/TeachingPage";
import TalksPage from "@/components/pages/TalksPage";
import GrantsPage from "@/components/pages/GrantsPage";
import CvPage from "@/components/pages/CvPage";
import type { BlogPost } from "@/data/blogs";

const LOADING_DURATION = 100; // ms for the loading screen

export default function Home() {
  const [activeTab, setActiveTab] = useState("about");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [blogData, setBlogData] = useState<BlogPost[] | null>(null);

  // Theme
  const [isDark, setIsDark] = useState(false);
  const [themeReady, setThemeReady] = useState(false);

  // Loading screen
  const [showLoading, setShowLoading] = useState(false);
  const [loadingFading, setLoadingFading] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);
  const isTransitioning = useRef(false);

  // Init theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = saved === "dark" || (!saved && prefersDark);
    setIsDark(dark);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    setThemeReady(true);
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (!themeReady) return;
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark, themeReady]);

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev);
  }, []);

  const executeTransition = useCallback(() => {
    if (!pendingAction.current) return;
    pendingAction.current();
    pendingAction.current = null;

    // Keep loading screen visible briefly, then fade out
    setTimeout(() => {
      setLoadingFading(true);
      setTimeout(() => {
        setShowLoading(false);
        setLoadingFading(false);
        isTransitioning.current = false;
      }, 80);
    }, 20);
  }, []);

  const startTransition = useCallback((action: () => void) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    pendingAction.current = action;
    setShowLoading(true);
    setLoadingFading(false);
    window.scrollTo({ top: 0 });
    setTimeout(executeTransition, LOADING_DURATION);
  }, [executeTransition]);

  const handleTabChange = useCallback((tab: string) => {
    startTransition(() => {
      setActiveTab(tab);
      setSelectedPostId(null);
    });
  }, [startTransition]);

  const handleOpenPost = useCallback((postId: string) => {
    startTransition(() => {
      setSelectedPostId(postId);
    });
  }, [startTransition]);

  const handleBackToBlog = useCallback(() => {
    startTransition(() => {
      setSelectedPostId(null);
    });
  }, [startTransition]);

  const handleBlogData = useCallback((posts: BlogPost[]) => {
    setBlogData(posts);
  }, []);

  const renderPage = () => {
    if (activeTab === "blog" && selectedPostId) {
      return <BlogPostPage postId={selectedPostId} onBack={handleBackToBlog} externalBlogData={blogData} />;
    }
    switch (activeTab) {
      case "about": return <AboutPage onNavigate={handleTabChange} />;
      case "blog": return <BlogPage onOpenPost={handleOpenPost} onBlogData={handleBlogData} />;
      case "experiences": return <ExperiencesPage />;
      case "open-source": return <OpenSourcePage />;
      case "publications": return <PublicationsPage />;
      case "teaching": return <TeachingPage />;
      case "talks": return <TalksPage />;
      case "grants": return <GrantsPage />;
      case "cv": return <CvPage />;
      default: return <AboutPage />;
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <ScrollProgress />
      <Header
        activeTab={selectedPostId ? "blog" : activeTab}
        onTabChange={handleTabChange}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1">
        {renderPage()}
      </main>

      <Footer />

      {/* Loading screen overlay */}
      {showLoading && (
        <div className={`loading-screen ${loadingFading ? "fade-out" : ""}`}>
          <span className="loading-logo">Y</span>
        </div>
      )}
    </div>
  );
}