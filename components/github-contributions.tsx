"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

type Day = {
  date: string;
  count: number;
  level: number;
};

export function GitHubContributions({ username }: { username: string }) {
  const [weeks, setWeeks] = useState<Day[][]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContrib = async () => {
      try {
        const res = await fetch(
          `/api/github/contributions?username=${encodeURIComponent(username)}`
        );
        if (!res.ok) throw new Error("Failed to fetch contributions");
        const data = await res.json();
        setWeeks(data.weeks);
      } catch (e: any) {
        setError(e.message || "Error fetching contributions");
      }
    };
    fetchContrib();
  }, [username]);

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="overflow-x-auto">
          <div
            className="grid"
            style={{ gridTemplateColumns: `repeat(${weeks.length}, 12px)` }}
          >
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1 mr-1">
                {week.map((day, di) => (
                  <div
                    key={`${wi}-${di}`}
                    title={`${day.count} contributions on ${day.date}`}
                    className="w-3 h-3 rounded-sm"
                    style={{
                      backgroundColor:
                        day.level === 0
                          ? "hsl(var(--muted))"
                          : `hsl(var(--primary) / ${0.25 + day.level * 0.18})`,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
