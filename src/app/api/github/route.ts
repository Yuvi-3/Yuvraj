import { NextResponse } from "next/server";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
  fork: boolean;
}

export async function GET() {
  try {
    const res = await fetch(
      "https://api.github.com/users/Yuvi-3/repos?sort=updated&per_page=100&type=owner",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "YuvrajDutt-Portfolio",
        },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch repos" },
        { status: res.status }
      );
    }

    const repos: GitHubRepo[] = await res.json();

    // Filter out forks
    const ownRepos = repos.filter((r) => !r.fork);

    // Categorize
    const mainProjectSlugs = [
      "halcyresearch",
      "rotarion",
      "quant-tool",
      "quant-tools",
    ];

    const mainProjects = ownRepos.filter((r) =>
      mainProjectSlugs.some(
        (slug) => r.name.toLowerCase().includes(slug)
      )
    );

    const personalProjects = ownRepos.filter(
      (r) =>
        !mainProjectSlugs.some((slug) =>
          r.name.toLowerCase().includes(slug)
        ) && !r.name.toLowerCase().includes("config")
    );

    const configRepos = ownRepos.filter((r) =>
      r.name.toLowerCase().includes("config")
    );

    const serializeRepo = (r: GitHubRepo) => ({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      description: r.description || "",
      url: r.html_url,
      homepage: r.homepage || "",
      language: r.language || "",
      stars: r.stargazers_count,
      forks: r.forks_count,
      updatedAt: r.updated_at,
      topics: r.topics || [],
    });

    return NextResponse.json({
      mainProjects: mainProjects.map(serializeRepo),
      personalProjects: personalProjects.map(serializeRepo),
      configRepos: configRepos.map(serializeRepo),
      githubUsername: "Yuvi-3",
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}