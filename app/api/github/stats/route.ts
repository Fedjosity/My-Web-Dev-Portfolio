import { NextResponse } from "next/server";

const GITHUB_API = "https://api.github.com";

async function fetchGitHub(endpoint: string, token?: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "fedjost-portfolio",
  };
  if (token) headers.Authorization = `token ${token}`;
  const res = await fetch(`${GITHUB_API}${endpoint}`, {
    headers,
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
  return res.json();
}

const QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          weeks { contributionDays { date contributionCount } }
        }
      }
    }
  }
`;

async function fetchGraphQLWeeks(username: string, token?: string) {
  if (!token) return null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": "fedjost-portfolio",
  };
  headers.Authorization = `Bearer ${token}`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers,
    body: JSON.stringify({ query: QUERY, variables: { login: username } }),
    cache: "no-store",
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.errors) return null;
  const weeksRaw =
    body?.data?.user?.contributionsCollection?.contributionCalendar?.weeks ||
    [];
  return weeksRaw.map((w: any) =>
    w.contributionDays.map((d: any) => ({
      date: d.date as string,
      count: d.contributionCount as number,
      level: Math.max(
        0,
        Math.min(4, Math.floor((d.contributionCount || 0) / 3))
      ),
    }))
  );
}

function toWeeksFromDateMap(dateToCount: Record<string, number>) {
  const dates = Object.keys(dateToCount).sort();
  const weeks: { date: string; count: number; level: number }[][] = [];
  for (let i = 0; i < dates.length; i += 7) {
    const chunk = dates.slice(i, i + 7);
    const week = chunk.map((d) => {
      const count = dateToCount[d] || 0;
      return {
        date: d,
        count,
        level: Math.max(0, Math.min(4, Math.floor(count / 3))),
      };
    });
    weeks.push(week);
  }
  return weeks;
}

async function fetchFallbackWeeks(username: string) {
  try {
    const url = `https://github-contributions-api.deno.dev/${encodeURIComponent(
      username
    )}.json`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("deno api failed");
    const data = await res.json();
    const days: { date: string; count: number }[] = data?.contributions || [];
    const weeks: { date: string; count: number; level: number }[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      const week = days.slice(i, i + 7).map((d) => ({
        date: d.date,
        count: d.count,
        level: Math.max(0, Math.min(4, Math.floor((d.count || 0) / 3))),
      }));
      if (week.length) weeks.push(week);
    }
    return weeks;
  } catch {
    try {
      const url = `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(
        username
      )}?y=last`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("jogruber api failed");
      const data = await res.json();
      const contributions: Record<string, number> = data?.contributions || {};
      return toWeeksFromDateMap(contributions);
    } catch {
      return [];
    }
  }
}

export async function GET() {
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "fedjosity";
  const token = process.env.GITHUB_TOKEN;
  try {
    const [user, repos, weeks] = await Promise.all([
      fetchGitHub(`/users/${username}`, token),
      fetchGitHub(`/users/${username}/repos?sort=updated&per_page=100`, token),
      (async () =>
        (await fetchGraphQLWeeks(username, token)) ??
        (await fetchFallbackWeeks(username)))(),
    ]);

    const totalStars = repos.reduce(
      (acc: number, r: any) => acc + (r.stargazers_count || 0),
      0
    );
    const totalForks = repos.reduce(
      (acc: number, r: any) => acc + (r.forks_count || 0),
      0
    );

    const contributionsThisYear = (weeks as any[][])
      .flat()
      .reduce((acc, d) => acc + (d.count || 0), 0);

    const response = NextResponse.json({
      totalRepos: user?.public_repos || 0,
      totalStars,
      totalForks,
      followers: user?.followers || 0,
      contributionsWeeks: weeks,
      contributionsThisYear,
      lastUpdated: new Date().toISOString(),
    });

    // Set cache headers to prevent caching
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (e: any) {
    const response = NextResponse.json(
      { error: e.message, contributionsWeeks: [], contributionsThisYear: 0 },
      { status: 200 }
    );

    // Set cache headers even for error responses
    response.headers.set(
      "Cache-Control",
      "no-cache, no-store, must-revalidate"
    );
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  }
}
