import { NextResponse } from "next/server";

const QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              contributionCount
              date
              weekday
            }
          }
        }
      }
    }
  }
`;

async function fetchGraphQL(username: string, token?: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "User-Agent": "fedjost-portfolio",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers,
    body: JSON.stringify({ query: QUERY, variables: { login: username } }),
    cache: "no-store",
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.errors) {
    const message = body?.errors?.[0]?.message || `status ${res.status}`;
    throw new Error(`GitHub GraphQL: ${message}`);
  }
  return body;
}

async function fetchFallback(username: string) {
  // Public fallback API: https://github-contributions-api.deno.dev/<user>.json
  const url = `https://github-contributions-api.deno.dev/${encodeURIComponent(
    username
  )}.json`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fallback API error ${res.status}`);
  const data = await res.json();
  // data.contributions is an array of { date, count } for a range
  // Convert to weeks (arrays of 7 days)
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
  return { weeks };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username =
    searchParams.get("username") ||
    process.env.NEXT_PUBLIC_GITHUB_USERNAME ||
    "fedjosity";

  try {
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      const json = await fetchGraphQL(username, token);
      const weeksRaw =
        json?.data?.user?.contributionsCollection?.contributionCalendar
          ?.weeks || [];
      const weeks = weeksRaw.map((w: any) =>
        w.contributionDays.map((d: any) => ({
          date: d.date,
          count: d.contributionCount,
          level: Math.max(
            0,
            Math.min(4, Math.floor((d.contributionCount || 0) / 3))
          ),
        }))
      );
      return NextResponse.json({ weeks });
    }

    const data = await fetchFallback(username);
    return NextResponse.json(data);
  } catch (err: any) {
    // Last-resort graceful response: never hard-fail in UI
    return NextResponse.json(
      { weeks: [], error: String(err) },
      { status: 200 }
    );
  }
}
