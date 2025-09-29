"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Day = {
  date: string;
  count: number;
  level: number;
};

export function GitHubContributions({
  username,
  weeks: weeksProp = [] as Day[][],
}: {
  username: string;
  weeks?: Day[][];
}) {
  const [weeks, setWeeks] = useState<Day[][]>(weeksProp);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContrib = async () => {
      try {
        if (weeksProp && weeksProp.length > 0) {
          setWeeks(weeksProp);
          return;
        }

        // Add timestamp to prevent caching
        const timestamp = Date.now();
        const res = await fetch(
          `/api/github/contributions?username=${encodeURIComponent(
            username
          )}&t=${timestamp}`,
          {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache, no-store, must-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch contributions");
        const data = await res.json();
        setWeeks(data.weeks);
      } catch (e: any) {
        setError(e.message || "Error fetching contributions");
      }
    };
    fetchContrib();
  }, [username, weeksProp]);

  const showError = error && weeks.length === 0;

  // Calculate total contributions
  const totalContributions = weeks.reduce(
    (total, week) =>
      total + week.reduce((weekTotal, day) => weekTotal + day.count, 0),
    0
  );

  // Get contribution level colors (similar to GitHub's)
  const getContributionColor = (level: number) => {
    switch (level) {
      case 0:
        return "hsl(var(--muted))";
      case 1:
        return "hsl(var(--primary) / 0.15)";
      case 2:
        return "hsl(var(--primary) / 0.35)";
      case 3:
        return "hsl(var(--primary) / 0.55)";
      case 4:
        return "hsl(var(--primary) / 0.75)";
      default:
        return "hsl(var(--muted))";
    }
  };

  // Format date for tooltip
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
          Contribution Activity
        </CardTitle>
        {totalContributions > 0 && (
          <p className="text-sm text-muted-foreground">
            {totalContributions.toLocaleString()} contributions in the last year
          </p>
        )}
      </CardHeader>
      <CardContent className="p-6">
        <div className="">
          {showError && (
            <p className="text-xs text-destructive mb-3">
              {error}. Showing nothing because both GitHub and fallback failed.
            </p>
          )}

          <TooltipProvider>
            <div className="flex overflow-x-auto items-end gap-1">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((day, di) => (
                    <Tooltip key={`${wi}-${di}`}>
                      <TooltipTrigger asChild>
                        <div
                          className="w-3 h-3 rounded-sm border border-border/20 transition-all duration-200 hover:scale-110 hover:border-border/40 cursor-pointer"
                          style={{
                            backgroundColor: getContributionColor(day.level),
                          }}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs">
                        <div className="text-center">
                          <div className="font-medium">
                            {day.count} contribution{day.count !== 1 ? "s" : ""}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(day.date)}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              ))}
            </div>
          </TooltipProvider>

          {/* Legend */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/20">
            <span className="text-xs text-muted-foreground">Less</span>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className="w-3 h-3 rounded-sm border border-border/20"
                  style={{
                    backgroundColor: getContributionColor(level),
                  }}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
