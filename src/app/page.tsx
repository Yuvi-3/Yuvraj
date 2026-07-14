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

const FADE_DURATION = 180; // ms per half (out + in = ~360ms total)

export default function Home() {
  const [activeTab, setActiveTab] = useState("about");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [blogData, setBlogData] = useState<BlogPost[] | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [visible, setVisible] = useState(true);
  const pendingTab = useRef<string | null>(null);

  useEffect(() => {
    if (!transitioning) return;
    // Phase 1: content faded out → swap tab → fade in
    const timer = setTimeout(() => {
      if (pendingTab.current) {
        setActiveTab(pendingTab.current);
        setSelectedPostId(null);
        pendingTab.current = null;
      }
      // Fade in
      setVisible(true);
      setTransitioning(false);
    }, FADE_DURATION);
    return () => clearTimeout(timer);
  }, [transitioning]);

  const handleTabChange = useCallback((tab: string) => {
    if (tab === activeTab && !selectedPostId) return;
    if (transitioning) return;
    pendingTab.current = tab;
    // Fade out
    setVisible(false);
    setTransitioning(true);
    window.scrollTo({ top: 0 });
  }, [activeTab, selectedPostId, transitioning]);

  const handleOpenPost = useCallback((postId: string) => {
    if (transitioning) return;
    pendingTab.current = null; // no tab change, just post open
    setVisible(false);
    setTransitioning(true);
    // Will set post after fade-out via a separate effect
    const timer = setTimeout(() => {
      setSelectedPostId(postId);
      setVisible(true);
      setTransitioning(false);
      window.scrollTo({ top: 0 });
    }, FADE_DURATION);
    // Store cleanup ref isn't needed since this is a one-shot
    return () => clearTimeout(timer);
  }, [transitioning]);

  const handleBackToBlog = useCallback(() => {
    if (transitioning) return;
    setVisible(false);
    setTransitioning(true);
    const timer = setTimeout(() => {
      setSelectedPostId(null);
      setVisible(true);
      setTransitioning(false);
      window.scrollTo({ top: 0 });
    }, FADE_DURATION);
    return () => clearTimeout(timer);
  }, [transitioning]);

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
      style={{ backgroundColor: "#ffffff" }}
    >
      <ScrollProgress />
      <Header
        activeTab={selectedPostId ? "blog" : activeTab}
        onTabChange={handleTabChange}
      />

      <main className="flex-1" style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: `opacity ${FADE_DURATION}ms ease, transform ${FADE_DURATION}ms ease`,
      }}>
        {renderPage()}
      </main>

      <Footer />
    </div>
  );
}