import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchGitHubStats, fetchGitHubEvents, fetchFeaturedRepos } from "@/lib/github";

// Mock global fetch
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("fetchGitHubStats", () => {
  it("returns repo count and total stars", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ public_repos: 24 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            { stargazers_count: 5 },
            { stargazers_count: 3 },
            { stargazers_count: 10 },
          ]),
      });

    const stats = await fetchGitHubStats();
    expect(stats).toEqual({ publicRepos: 24, totalStars: 18 });
  });

  it("returns defaults on API error", async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: false, status: 403 })
      .mockResolvedValueOnce({ ok: false, status: 403 });

    const stats = await fetchGitHubStats();
    expect(stats).toEqual({ publicRepos: 0, totalStars: 0 });
  });

  it("returns defaults on network failure", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    const stats = await fetchGitHubStats();
    expect(stats).toEqual({ publicRepos: 0, totalStars: 0 });
  });
});

describe("fetchGitHubEvents", () => {
  it("returns events array", async () => {
    const events = [{ type: "PushEvent", created_at: "2026-03-19", repo: { name: "test/repo" } }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(events),
    });

    const result = await fetchGitHubEvents();
    expect(result).toEqual(events);
  });

  it("returns empty array on error", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

    const result = await fetchGitHubEvents();
    expect(result).toEqual([]);
  });

  it("returns empty array on network failure", async () => {
    mockFetch.mockRejectedValue(new Error("timeout"));

    const result = await fetchGitHubEvents();
    expect(result).toEqual([]);
  });
});

describe("fetchFeaturedRepos", () => {
  it("returns repo data for valid repos", async () => {
    const repo = { name: "my-repo", description: "A repo", stargazers_count: 5 };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(repo),
    });

    const result = await fetchFeaturedRepos(["my-repo"]);
    expect(result).toEqual([repo]);
  });

  it("filters out repos that 404", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ name: "good-repo" }),
      })
      .mockResolvedValueOnce({ ok: false, status: 404 });

    const result = await fetchFeaturedRepos(["good-repo", "missing-repo"]);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("good-repo");
  });

  it("returns empty array when all repos fail", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404 });

    const result = await fetchFeaturedRepos(["a", "b"]);
    expect(result).toEqual([]);
  });
});
