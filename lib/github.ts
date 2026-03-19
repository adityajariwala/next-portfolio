const GITHUB_USERNAME = "adityajariwala";
const CACHE_TTL = 3600; // 1 hour

export interface GitHubStats {
  publicRepos: number;
  totalStars: number;
  languageBreakdown: { language: string; count: number; color: string }[];
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  "C++": "#f34b7d",
  "C#": "#178600",
  Shell: "#89e051",
  "Go Template": "#00ADD8",
};

export interface GitHubEvent {
  type: string;
  created_at: string;
  repo: { name: string };
  payload?: {
    commits?: { message: string }[];
  };
}

export async function fetchGitHubStats(): Promise<GitHubStats> {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
        next: { revalidate: CACHE_TTL },
      }),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`, {
        next: { revalidate: CACHE_TTL },
      }),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      console.error(`GitHub API error: user=${userRes.status} repos=${reposRes.status}`);
      return { publicRepos: 0, totalStars: 0, languageBreakdown: [] };
    }

    const user = await userRes.json();
    const repos = await reposRes.json();

    const totalStars = Array.isArray(repos)
      ? repos.reduce(
          (sum: number, r: { stargazers_count: number }) => sum + (r.stargazers_count ?? 0),
          0
        )
      : 0;

    // Language breakdown
    const langMap: Record<string, number> = {};
    if (Array.isArray(repos)) {
      for (const r of repos) {
        const lang = r.language;
        if (lang) langMap[lang] = (langMap[lang] || 0) + 1;
      }
    }
    const languageBreakdown = Object.entries(langMap)
      .sort((a, b) => b[1] - a[1])
      .map(([language, count]) => ({
        language,
        count,
        color: LANG_COLORS[language] ?? "#888",
      }));

    return { publicRepos: user.public_repos ?? 0, totalStars, languageBreakdown };
  } catch (err) {
    console.error("fetchGitHubStats failed:", err);
    return { publicRepos: 0, totalStars: 0, languageBreakdown: [] };
  }
}

export async function fetchGitHubEvents(): Promise<GitHubEvent[]> {
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=30`, {
      next: { revalidate: CACHE_TTL },
    });
    if (!res.ok) {
      console.error(`GitHub events API error: ${res.status}`);
      return [];
    }
    return res.json();
  } catch (err) {
    console.error("fetchGitHubEvents failed:", err);
    return [];
  }
}

export async function fetchFeaturedRepos(repoNames: string[]) {
  try {
    const repos = await Promise.all(
      repoNames.map(async (name) => {
        try {
          const res = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${name}`, {
            next: { revalidate: CACHE_TTL },
          });
          if (!res.ok) {
            console.error(`GitHub repo API error for "${name}": ${res.status}`);
            return null;
          }
          return res.json();
        } catch (err) {
          console.error(`fetchFeaturedRepos failed for "${name}":`, err);
          return null;
        }
      })
    );
    return repos.filter(Boolean);
  } catch (err) {
    console.error("fetchFeaturedRepos failed:", err);
    return [];
  }
}
