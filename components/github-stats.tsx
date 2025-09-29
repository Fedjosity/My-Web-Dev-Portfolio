"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GitHubContributions } from "@/components/github-contributions";
import { GitFork, Star, Users, GitCommit, RefreshCw } from "lucide-react";
import { useGitHubStats } from "@/hooks/use-github-stats";

export function GitHubStats() {
  const { stats, loading, refreshing, error, fetchStats, lastUpdated } =
    useGitHubStats();

  const statItems = [
    { icon: GitCommit, label: "Repositories", value: stats.totalRepos },
    { icon: Star, label: "Stars", value: stats.totalStars },
    { icon: GitFork, label: "Forks", value: stats.totalForks },
    { icon: Users, label: "Followers", value: stats.followers },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-8 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-4 bg-muted rounded mb-4 w-1/3" />
            <div className="h-32 bg-muted rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button and last updated */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">GitHub Statistics</h3>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          {error && <p className="text-sm text-destructive">Error: {error}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <item.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold text-foreground">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    {item.value.toLocaleString()}
                  </motion.span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.label}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GitHubContributions
          username={process.env.NEXT_PUBLIC_GITHUB_USERNAME || "fedjosity"}
          weeks={
            (typeof window !== "undefined" &&
              (window as any).__CONTRIB_WEEKS__) ||
            []
          }
        />
      </motion.div>
    </div>
  );
}
