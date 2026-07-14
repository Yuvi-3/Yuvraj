"use client";

import { blogPosts, type BlogPost } from "@/data/blogs";
import { useMemo } from "react";

interface BlogPostPageProps {
  postId: string;
  onBack: () => void;
  externalBlogData?: BlogPost[] | null;
}

export default function BlogPostPage({ postId, onBack, externalBlogData }: BlogPostPageProps) {
  const allPosts = externalBlogData && externalBlogData.length > 0 ? externalBlogData : blogPosts;
  const post = useMemo(
    () => allPosts.find((p) => p.id === postId),
    [postId, allPosts]
  );

  if (!post) {
    return (
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 16px 64px" }}>
        <p style={{ color: "var(--text-muted)" }}>Post not found.</p>
      </div>
    );
  }

  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent = "";
    let listItems: string[] = [];
    let inList = false;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul
            key={`list-${elements.length}`}
            style={{
              paddingLeft: "24px",
              marginBottom: "16px",
              color: "var(--text-primary)",
            }}
          >
            {listItems.map((item, i) => (
              <li
                key={i}
                style={{
                  fontSize: "16px",
                  lineHeight: 1.7,
                  marginBottom: "6px",
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
      inList = false;
    };

    lines.forEach((line, idx) => {
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <pre
              key={`code-${idx}`}
              style={{
                backgroundColor: "var(--code-bg)",
                border: "1px solid var(--border-primary)",
                borderRadius: "6px",
                padding: "16px",
                overflowX: "auto",
                marginBottom: "16px",
                fontSize: "13px",
                lineHeight: "1.5",
              }}
            >
              <code>{codeContent.trim()}</code>
            </pre>
          );
          codeContent = "";
          inCodeBlock = false;
        } else {
          flushList();
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent += line + "\n";
        return;
      }

      if (line.startsWith("## ")) {
        flushList();
        elements.push(
          <h2
            key={`h2-${idx}`}
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginTop: "32px",
              marginBottom: "12px",
            }}
          >
            {line.slice(3)}
          </h2>
        );
        return;
      }

      if (line.startsWith("### ")) {
        flushList();
        elements.push(
          <h3
            key={`h3-${idx}`}
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginTop: "24px",
              marginBottom: "10px",
            }}
          >
            {line.slice(4)}
          </h3>
        );
        return;
      }

      if (line.startsWith("- ")) {
        if (!inList) inList = true;
        listItems.push(
          line.slice(2).replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        );
        return;
      }

      if (/^\d+\.\s/.test(line)) {
        if (!inList) inList = true;
        listItems.push(
          line.replace(/^\d+\.\s/, "").replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        );
        return;
      }

      if (line.trim() === "") {
        flushList();
        return;
      }

      flushList();
      elements.push(
        <p
          key={`p-${idx}`}
          style={{
            fontSize: "16px",
            lineHeight: 1.7,
            color: "var(--text-primary)",
            marginBottom: "16px",
          }}
          dangerouslySetInnerHTML={{
            __html: line
              .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
              .replace(
                /`([^`]+)`/g,
                '<code style="background:var(--code-bg);padding:2px 5px;border-radius:3px;font-size:13px;">$1</code>'
              )
              .replace(/&ldquo;/g, "\u201c")
              .replace(/&rdquo;/g, "\u201d")
              .replace(/&lsquo;/g, "\u2018")
              .replace(/&rsquo;/g, "\u2019")
              .replace(/&mdash;/g, "\u2014"),
          }}
        />
      );
    });

    flushList();
    return elements;
  };

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 16px 64px" }}>
      <button
        onClick={onBack}
        style={{
          fontSize: "14px",
          color: "var(--accent)",
          border: "none",
          background: "none",
          cursor: "pointer",
          padding: 0,
          marginBottom: "24px",
          display: "inline-block",
        }}
      >
        &larr; Back to blog
      </button>

      <h1
        style={{
          fontSize: "clamp(24px, 5vw, 30px)",
          fontWeight: 700,
          color: "var(--text-primary)",
          lineHeight: 1.2,
          marginBottom: "12px",
        }}
      >
        {post.title}
      </h1>

      <div
        className="flex items-center gap-2 flex-wrap mb-8"
        style={{ fontSize: "13px" }}
      >
        <span style={{ color: "var(--text-muted)" }}>{post.readTime}</span>
        <span style={{ color: "var(--divider)" }}>&bull;</span>
        <span style={{ color: "var(--text-muted)" }}>{post.date}</span>
        <span style={{ color: "var(--divider)" }}>&bull;</span>
        {post.tags.map((tag) => (
          <span key={tag} style={{ color: "var(--accent)" }}>
            #{tag}
          </span>
        ))}
        <span style={{ color: "var(--divider)" }}>&bull;</span>
        <span style={{ color: "var(--text-muted)" }}>{post.category}</span>
      </div>

      <div
        style={{
          borderTop: "1px solid var(--border-primary)",
          marginBottom: "32px",
        }}
      />

      <article>{renderContent(post.content)}</article>
    </div>
  );
}