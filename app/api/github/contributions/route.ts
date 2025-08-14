import { NextResponse } from "next/server";

const QUERY = `
  query($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              color
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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username =
    searchParams.get("username") ||
    process.env.NEXT_PUBLIC_GITHUB_USERNAME ||
    "fedjosity";

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ weeks: [] }, { status: 200 });
  }

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
    body: JSON.stringify({ query: QUERY, variables: { login: username } }),
    // Avoid Next.js caching for dynamic data
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "GitHub GraphQL error" },
      { status: 500 }
    );
  }

  const json = await res.json();
  const weeksRaw =
    json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks ||
    [];

  const weeks = weeksRaw.map((w: any) =>
    w.contributionDays.map((d: any) => ({
      date: d.date,
      count: d.contributionCount,
      // normalize to 0..4 levels
      level: Math.max(0, Math.min(4, Math.floor(d.contributionCount / 3))),
    }))
  );

  return NextResponse.json({ weeks });
}
