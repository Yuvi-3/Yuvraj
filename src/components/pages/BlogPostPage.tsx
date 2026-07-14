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
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 24px 64px" }}>
        <p style={{ color: "#999999" }}>Post not found.</p>
      </div>
    );
  }

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeContent = "";
    let codeLang = "";
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
              color: "#333333",
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
      // Code block toggle
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <pre
              key={`code-${idx}`}
              style={{
                backgroundColor: "#f8f8f8",
                border: "1px solid #eaeaea",
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
          codeLang = line.slice(3).trim();
        }
        return;
      }

      if (inCodeBlock) {
        codeContent += line + "\n";
        return;
      }

      // Heading
      if (line.startsWith("## ")) {
        flushList();
        elements.push(
          <h2
            key={`h2-${idx}`}
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#333333",
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
              color: "#333333",
              marginTop: "24px",
              marginBottom: "10px",
            }}
          >
            {line.slice(4)}
          </h3>
        );
        return;
      }

      // List items
      if (line.startsWith("- ")) {
        if (!inList) inList = true;
        listItems.push(
          line.slice(2).replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        );
        return;
      }

      // Numbered list
      if (/^\d+\.\s/.test(line)) {
        if (!inList) inList = true;
        listItems.push(
          line.replace(/^\d+\.\s/, "").replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
        );
        return;
      }

      // Empty line
      if (line.trim() === "") {
        flushList();
        return;
      }

      // Regular paragraph
      flushList();
      elements.push(
        <p
          key={`p-${idx}`}
          style={{
            fontSize: "16px",
            lineHeight: 1.7,
            color: "#333333",
            marginBottom: "16px",
          }}
          dangerouslySetInnerHTML={{
            __html: line
              .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
              .replace(
                /`([^`]+)`/g,
                '<code style="background:#f4f4f4;padding:2px 5px;border-radius:3px;font-size:13px;">$1</code>'
              )
              .replace(
                /&ldquo;/g,
                "\u201c"
              )
              .replace(/&rdquo;/g, "\u201d")
              .replace(
                /&lsquo;/g,
                "\u2018"
              )
              .replace(/&rsquo;/g, "\u2019")
              .replace(
                /&mdash;/g,
                "\u2014"
              ),
          }}
        />
      );
    });

    flushList();
    return elements;
  };

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 24px 64px" }}>
      {/* Back link */}
      <button
        onClick={onBack}
        style={{
          fontSize: "14px",
          color: "#b833ff",
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

      {/* Post Title */}
      <h1
        style={{
          fontSize: "30px",
          fontWeight: 700,
          color: "#333333",
          lineHeight: 1.2,
          marginBottom: "12px",
        }}
      >
        {post.title}
      </h1>

      {/* Meta */}
      <div
        className="flex items-center gap-2 flex-wrap mb-8"
        style={{ fontSize: "13px" }}
      >
        <span style={{ color: "#999999" }}>{post.readTime}</span>
        <span style={{ color: "#dddddd" }}>&bull;</span>
        <span style={{ color: "#999999" }}>{post.date}</span>
        <span style={{ color: "#dddddd" }}>&bull;</span>
        {post.tags.map((tag) => (
          <span key={tag} style={{ color: "#b833ff" }}>
            #{tag}
          </span>
        ))}
        <span style={{ color: "#dddddd" }}>&bull;</span>
        <span style={{ color: "#999999" }}>{post.category}</span>
      </div>

      {/* Divider */}
      <div
        style={{
          borderTop: "1px solid #eaeaea",
          marginBottom: "32px",
        }}
      />

      {/* Content */}
      <article>{renderContent(post.content)}</article>
    </div>
  );
}