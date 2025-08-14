"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { GitHubContributions } from "@/components/github-contributions";
import { GitFork, Star, Users, GitCommit } from "lucide-react";
import { getGitHubStats } from "@/lib/github";

interface GitHubStats {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  followers: number;
  contributionsThisYear: number;
}

export function GitHubStats() {
  const [stats, setStats] = useState<GitHubStats>({
    totalRepos: 0,
    totalStars: 0,
    totalForks: 0,
    followers: 0,
    contributionsThisYear: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const githubStats = await getGitHubStats();
        setStats(githubStats);
      } catch (error) {
        console.error("Error fetching GitHub stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statItems = [
    { icon: GitCommit, label: "Repositories", value: stats.totalRepos },
    { icon: Star, label: "Stars", value: stats.totalStars },
    { icon: GitFork, label: "Forks", value: stats.totalForks },
    { icon: Users, label: "Followers", value: stats.followers },
  ];

  if (loading) {
    return (
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
    );
  }

  return (
    <div className="space-y-6">
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
                    {item.value}
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
      <GitHubContributions
        username={process.env.NEXT_PUBLIC_GITHUB_USERNAME || "fedjosity"}
      />
    </div>
  );
}
