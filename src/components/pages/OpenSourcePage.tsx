"use client";

import { useState, useEffect } from "react";
import { Github, Star, GitFork, ExternalLink } from "lucide-react";

interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string;
  url: string;
  homepage: string;
  language: string;
  stars: number;
  forks: number;
  updatedAt: string;
  topics: string[];
}

interface GitHubData {
  mainProjects: GitHubRepo[];
  personalProjects: GitHubRepo[];
  configRepos: GitHubRepo[];
  githubUsername: string;
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  C: "#555555",
  "C++": "#f34b7d",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Shell: "#89e051",
  Jupyter: "#DA5B0B",
  Dockerfile: "#384d54",
};

function RepoCard({ repo }: { repo: GitHubRepo }) {
  const langColor = LANGUAGE_COLORS[repo.language] || "#999999";
  const dateStr = new Date(repo.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="hover-card"
      style={{
        border: "1px solid #eaeaea",
        borderRadius: "8px",
        padding: "20px",
        marginBottom: "12px",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#d0d0d0";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#eaeaea";
      }}
    >
      {/* Header: name + GitHub link */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "#333333",
            lineHeight: 1.3,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {repo.homepage ? (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#333333", textDecoration: "none" }}
            >
              {repo.name}
            </a>
          ) : (
            <span>{repo.name}</span>
          )}
        </h3>
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#666666", display: "flex", alignItems: "center" }}
          title="View on GitHub"
        >
          <Github size={16} strokeWidth={1.5} />
        </a>
      </div>

      {/* Description */}
      {repo.description && (
        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.6,
            color: "#666666",
            marginBottom: "12px",
          }}
        >
          {repo.description}
        </p>
      )}

      {/* Footer: language, stars, forks, date */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          flexWrap: "wrap",
          fontSize: "13px",
          color: "#999999",
        }}
      >
        {repo.language && (
          <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: langColor,
                display: "inline-block",
              }}
            />
            {repo.language}
          </span>
        )}
        {repo.stars > 0 && (
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <Star size={13} />
            {repo.stars}
          </span>
        )}
        {repo.forks > 0 && (
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <GitFork size={13} />
            {repo.forks}
          </span>
        )}
        <span>Updated {dateStr}</span>
      </div>

      {/* Topics */}
      {repo.topics.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "10px" }}>
          {repo.topics.slice(0, 5).map((topic) => (
            <span
              key={topic}
              style={{
                fontSize: "11px",
                color: "#b833ff",
                backgroundColor: "#f0f0ff",
                padding: "2px 8px",
                borderRadius: "12px",
              }}
            >
              {topic}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: "24px",
        border: "1px dashed #e0e0e0",
        borderRadius: "8px",
        backgroundColor: "#fafafa",
        marginBottom: "32px",
      }}
    >
      <p style={{ fontSize: "14px", color: "#999999" }}>{message}</p>
    </div>
  );
}

export default function OpenSourcePage() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/github")
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 24px 64px" }}>
      <h1
        className="stagger-in"
        style={{
          fontSize: "28px",
          fontWeight: 700,
          color: "#b833ff",
          marginBottom: "4px",
          animationDelay: "0ms",
        }}
      >
        open-source
      </h1>
      <p
        style={{
          fontSize: "16px",
          fontWeight: 400,
          color: "#666666",
          marginBottom: "24px",
        }}
      >
        live repositories, contributions, and projects
      </p>

      {loading && (
        <p style={{ fontSize: "16px", color: "#999999" }}>
          Loading repositories from GitHub...
        </p>
      )}

      {error && (
        <div>
          <p style={{ fontSize: "16px", color: "#999999", marginBottom: "16px" }}>
            Could not load live repositories. Showing static info below.
          </p>
        </div>
      )}

      {data && (
        <>
          {/* GitHub Profile Link */}
          <div className="stagger-in" style={{ marginBottom: "32px", animationDelay: "60ms" }}>
            <a
              href={`https://github.com/${data.githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-link"
              style={{
                fontSize: "16px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Github size={16} />
              {data.githubUsername}
            </a>
          </div>

          {/* Main Projects */}
          <h2
            className="stagger-in"
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#333333",
              marginBottom: "16px",
              animationDelay: "120ms",
            }}
          >
            Main projects
          </h2>
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.7,
              color: "#666666",
              marginBottom: "16px",
            }}
          >
            Projects I am actively developing and maintaining.
          </p>
          {data.mainProjects.length > 0 ? (
            <div className="stagger-in" style={{ marginBottom: "32px", animationDelay: "180ms" }}>
              {data.mainProjects.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          ) : (
            <EmptyState message="No main projects found yet." />
          )}

          {/* Personal Projects */}
          <h2
            className="stagger-in"
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#333333",
              marginBottom: "16px",
              animationDelay: "240ms",
            }}
          >
            Personal projects
          </h2>
          <p
            style={{
              fontSize: "14px",
              lineHeight: 1.7,
              color: "#666666",
              marginBottom: "16px",
            }}
          >
            Experiments, tools, and side projects.
          </p>
          {data.personalProjects.length > 0 ? (
            <div className="stagger-in" style={{ marginBottom: "32px", animationDelay: "300ms" }}>
              {data.personalProjects.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          ) : (
            <EmptyState message="No personal projects yet. They will appear here as I create them." />
          )}

          {/* Config / Misc */}
          {data.configRepos.length > 0 && (
            <>
              <h2
                className="stagger-in"
                style={{
                  fontSize: "24px",
                  fontWeight: 600,
                  color: "#333333",
                  marginBottom: "16px",
                  animationDelay: "360ms",
                }}
              >
                Misc repositories
              </h2>
              <div className="stagger-in" style={{ marginBottom: "32px", animationDelay: "420ms" }}>
                {data.configRepos.map((repo) => (
                  <RepoCard key={repo.id} repo={repo} />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}