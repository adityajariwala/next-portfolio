const GITHUB_USERNAME = "adityajariwala";
const CACHE_TTL = 3600; // 1 hour

export interface GitHubStats {
  publicRepos: number;
  totalStars: number;
}

export interface GitHubEvent {
  type: string;
  created_at: string;
  repo: { name: string };
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
      return { publicRepos: 0, totalStars: 0 };
    }

    const user = await userRes.json();
    const repos = await reposRes.json();

    const totalStars = Array.isArray(repos)
      ? repos.reduce(
          (sum: number, r: { stargazers_count: number }) => sum + (r.stargazers_count ?? 0),
          0
        )
      : 0;

    return { publicRepos: user.public_repos ?? 0, totalStars };
  } catch (err) {
    console.error("fetchGitHubStats failed:", err);
    return { publicRepos: 0, totalStars: 0 };
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
