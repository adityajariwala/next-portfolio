import { NextResponse } from "next/server";

const GITHUB_API_URL = "https://api.github.com/users/adityajariwala/repos?sort=updated&per_page=12";

// Cache the response in memory for 1 hour
let cachedData: unknown = null;
let cacheTimestamp = 0;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour

export async function GET() {
  const now = Date.now();

  if (cachedData && now - cacheTimestamp < CACHE_DURATION_MS) {
    return NextResponse.json(cachedData);
  }

  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "adityajariwala-portfolio",
      },
    });

    if (!response.ok) {
      // If we have stale cache, serve it rather than erroring
      if (cachedData) {
        return NextResponse.json(cachedData);
      }
      return NextResponse.json(
        { error: "Failed to fetch repositories" },
        { status: response.status }
      );
    }

    const data = await response.json();
    cachedData = data;
    cacheTimestamp = now;

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Error fetching GitHub repos:", error);
    if (cachedData) {
      return NextResponse.json(cachedData);
    }
    return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 });
  }
}
