"use client";

import { useState, useMemo, useEffect } from "react";
import { blogPosts, allTags } from "@/data/blogs";
import type { BlogPost } from "@/data/blogs";
import { fetchBlogs, type BlogItem } from "@/lib/firebase";
import HashtagGraph from "@/components/HashtagGraph";

const POSTS_PER_PAGE = 3;

interface BlogPageProps {
  onOpenPost: (postId: string) => void;
  onBlogData?: (posts: BlogPost[]) => void;
}

export default function BlogPage({ onOpenPost, onBlogData }: BlogPageProps) {
  const [firebaseData, setFirebaseData] = useState<BlogItem[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBlogs().then((data) => {
      if (data.length > 0) setFirebaseData(data);
    });
  }, []);

  // Convert Firebase BlogItem[] to BlogPost[] format
  const firebasePosts: BlogPost[] = useMemo(() => {
    return firebaseData.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      date: item.date,
      readTime: item.readTime,
      tags: item.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      category: item.category,
      content: item.content,
    }));
  }, [firebaseData]);

  // Use firebase data if available, otherwise fall back to static data
  const displayData: BlogPost[] = firebasePosts.length > 0 ? firebasePosts : blogPosts;

  // Derive all unique tags from the active data source
  const activeTags = useMemo(() => {
    const tagSet = new Set<string>();
    displayData.forEach((post) => {
      post.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [displayData]);

  // Notify parent of active data
  useEffect(() => {
    if (onBlogData) {
      onBlogData(displayData);
    }
  }, [displayData, onBlogData]);

  const filteredPosts = useMemo(() => {
    if (!selectedTag) return displayData;
    return displayData.filter((post) => post.tags.includes(selectedTag));
  }, [selectedTag, displayData]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handleTagClick = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 16px 64px" }}>
      {/* Blog Title */}
      <div className="stagger-in" style={{ animationDelay: "0ms" }}>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "var(--accent)",
            marginBottom: "4px",
          }}
        >
          The Obsidian
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "var(--text-secondary)",
            marginBottom: "24px",
          }}
        >
          notes, thoughts, and experiments
        </p>
      </div>

      {/* Hashtag Graph */}
      <div
        className="stagger-in"
        style={{
          animationDelay: "60ms",
          border: "1px solid var(--border-primary)",
          padding: "20px",
          marginBottom: "24px",
          borderRadius: "8px",
        }}
      >
        <HashtagGraph
          tags={activeTags}
          activeTag={selectedTag}
          onTagClick={handleTagClick}
        />
      </div>
      <div style={{ borderTop: "1px solid var(--border-primary)", marginBottom: "24px" }} />

      {/* Selected tag indicator */}
      {selectedTag && (
        <div className="mb-6 flex items-center gap-2">
          <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            Filtered by:
          </span>
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded"
            style={{
              fontSize: "13px",
              color: "var(--accent)",
              backgroundColor: "var(--accent-bg)",
            }}
          >
            #{selectedTag}
            <button
              onClick={() => {
                setSelectedTag(null);
                setCurrentPage(1);
              }}
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "var(--accent)",
                fontSize: "16px",
                lineHeight: 1,
                marginLeft: "4px",
              }}
            >
              &times;
            </button>
          </span>
        </div>
      )}

      {/* Blog Posts */}
      <div className="mb-8">
        {paginatedPosts.length === 0 && (
          <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>
            No posts found for this tag.
          </p>
        )}
        {paginatedPosts.map((post) => (
          <BlogListItem
            key={post.id}
            post={post}
            onOpen={() => onOpenPost(post.id)}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="stagger-in flex items-center justify-center gap-3"
          style={{ animationDelay: "120ms", borderTop: "1px solid var(--border-primary)", paddingTop: "20px" }}
        >
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              fontSize: "14px",
              color: currentPage === 1 ? "var(--text-muted)" : "var(--accent)",
              border: "none",
              background: "none",
              cursor: currentPage === 1 ? "default" : "pointer",
              fontWeight: 400,
            }}
          >
            Newer
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              style={{
                fontSize: "14px",
                color: currentPage === page ? "var(--accent)" : "var(--text-secondary)",
                border: "none",
                background: "none",
                cursor: "pointer",
                fontWeight: currentPage === page ? 600 : 400,
                minWidth: "24px",
                padding: "2px 4px",
              }}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            style={{
              fontSize: "14px",
              color: currentPage === totalPages ? "var(--text-muted)" : "var(--accent)",
              border: "none",
              background: "none",
              cursor: currentPage === totalPages ? "default" : "pointer",
              fontWeight: 400,
            }}
          >
            Older
          </button>
        </div>
      )}
    </div>
  );
}

function BlogListItem({
  post,
  onOpen,
}: {
  post: BlogPost;
  onOpen: () => void;
}) {
  return (
    <div
      className="py-5 hover-card"
      style={{ borderBottom: "1px solid var(--border-secondary)" }}
    >
      <h3
        className="cursor-pointer hover:underline"
        onClick={onOpen}
        style={{
          fontSize: "20px",
          fontWeight: 600,
          color: "var(--text-primary)",
          marginBottom: "6px",
          lineHeight: 1.3,
        }}
      >
        {post.title}
      </h3>
      <p
        style={{
          fontSize: "16px",
          color: "var(--text-primary)",
          lineHeight: 1.7,
          marginBottom: "8px",
        }}
      >
        {post.description}
      </p>
      <div className="flex items-center gap-2 flex-wrap" style={{ fontSize: "13px" }}>
        <span style={{ color: "var(--text-muted)" }}>{post.readTime}</span>
        <span style={{ color: "var(--divider)" }}>&bull;</span>
        <span style={{ color: "var(--text-muted)" }}>{post.date}</span>
        <span style={{ color: "var(--divider)" }}>&bull;</span>
        {post.tags.map((tag) => (
          <span
            key={tag}
            style={{ color: "var(--accent)" }}
          >
            #{tag}
          </span>
        ))}
        <span style={{ color: "var(--divider)" }}>&bull;</span>
        <span style={{ color: "var(--text-muted)" }}>{post.category}</span>
      </div>
    </div>
  );
}
