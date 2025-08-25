import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d"; // 7d, 30d, 90d, all

    // Calculate date range
    let dateFilter = "";
    if (period !== "all") {
      const days = parseInt(period.replace("d", ""));
      const date = new Date();
      date.setDate(date.getDate() - days);
      dateFilter = `created_at >= '${date.toISOString()}'`;
    }

    // Calculate date range
    const days = period === "all" ? 0 : parseInt(period.replace("d", ""));
    const startDate =
      days > 0
        ? new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
        : null;

    // Get total page views
    const { data: pageViews, error: pageViewsError } = await supabase
      .from("page_views")
      .select("id")
      .gte("created_at", startDate || "1970-01-01");

    if (pageViewsError) throw pageViewsError;

    // Get total blog post views
    const { data: blogViews, error: blogViewsError } = await supabase
      .from("blog_post_views")
      .select("id")
      .gte("created_at", startDate || "1970-01-01");

    if (blogViewsError) throw blogViewsError;

    // Get unique visitors (sessions)
    const { data: sessions, error: sessionsError } = await supabase
      .from("sessions")
      .select("id")
      .gte("first_visit", startDate || "1970-01-01");

    if (sessionsError) throw sessionsError;

    // Get top pages
    const { data: topPages, error: topPagesError } = await supabase
      .from("page_views")
      .select("page_path, page_title")
      .gte("created_at", startDate || "1970-01-01");

    if (topPagesError) throw topPagesError;

    // Get top blog posts
    const { data: topBlogPosts, error: topBlogPostsError } = await supabase
      .from("blog_post_views")
      .select("post_slug, post_title")
      .gte("created_at", startDate || "1970-01-01");

    if (topBlogPostsError) throw topBlogPostsError;

    // Calculate page view counts
    const pageViewCounts =
      topPages?.reduce((acc: any, page) => {
        acc[page.page_path] = (acc[page.page_path] || 0) + 1;
        return acc;
      }, {}) || {};

    // Calculate blog post view counts
    const blogPostViewCounts =
      topBlogPosts?.reduce((acc: any, post) => {
        acc[post.post_slug] = (acc[post.post_slug] || 0) + 1;
        return acc;
      }, {}) || {};

    // Get top 5 pages
    const top5Pages = Object.entries(pageViewCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([path, count]) => ({
        path,
        count,
        title: topPages?.find((p) => p.page_path === path)?.page_title || path,
      }));

    // Get top 5 blog posts
    const top5BlogPosts = Object.entries(blogPostViewCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)
      .map(([slug, count]) => ({
        slug,
        count,
        title:
          topBlogPosts?.find((p) => p.post_slug === slug)?.post_title || slug,
      }));

    // Get daily stats for the last 7 days
    const dailyStats = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      // Count page views for this date
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const { data: dayPageViews } = await supabase
        .from("page_views")
        .select("id")
        .gte("created_at", dayStart.toISOString())
        .lte("created_at", dayEnd.toISOString());

      const { data: dayBlogViews } = await supabase
        .from("blog_post_views")
        .select("id")
        .gte("created_at", dayStart.toISOString())
        .lte("created_at", dayEnd.toISOString());

      dailyStats.push({
        date: dateStr,
        pageViews: dayPageViews?.length || 0,
        blogViews: dayBlogViews?.length || 0,
      });
    }

    return NextResponse.json({
      totalPageViews: pageViews?.length || 0,
      totalBlogViews: blogViews?.length || 0,
      uniqueVisitors: sessions?.length || 0,
      topPages: top5Pages,
      topBlogPosts: top5BlogPosts,
      dailyStats,
      period,
    });
  } catch (error) {
    console.error("Error fetching analytics stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
