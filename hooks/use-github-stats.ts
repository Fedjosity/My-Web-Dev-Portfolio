import { useState, useCallback, useEffect } from "react";

interface GitHubStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  followers: number;
  contributionsThisYear: number;
  lastUpdated?: string;
}

interface UseGitHubStatsReturn {
  stats: GitHubStats;
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  fetchStats: (isRefresh?: boolean) => Promise<void>;
  lastUpdated: Date | null;
}

export function useGitHubStats(): UseGitHubStatsReturn {
  const [stats, setStats] = useState<GitHubStats>({
    totalRepos: 0,
    totalStars: 0,
    totalForks: 0,
    followers: 0,
    contributionsThisYear: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Add timestamp to prevent caching
      const timestamp = Date.now();
      const res = await fetch(`/api/github/stats?t=${timestamp}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (!res.ok) throw new Error("Failed to load stats");
      const githubStats = await res.json();

      setStats({
        ...githubStats,
        lastUpdated: new Date().toISOString(),
      });

      // Store contribution weeks for the contributions component
      if (typeof window !== "undefined") {
        (window as any).__CONTRIB_WEEKS__ =
          githubStats.contributionsWeeks || [];
      }
    } catch (error) {
      console.error("Error fetching GitHub stats:", error);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    // Set up automatic refresh every 5 minutes
    const interval = setInterval(() => {
      fetchStats(true);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [fetchStats]);

  const lastUpdated = stats.lastUpdated ? new Date(stats.lastUpdated) : null;

  return {
    stats,
    loading,
    refreshing,
    error,
    fetchStats,
    lastUpdated,
  };
}
