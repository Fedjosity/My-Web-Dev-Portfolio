import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    console.log("Debug: Testing blog posts access...");

    // Test 1: Get all posts without any filters
    const { data: allPosts, error: allError } = await supabase
      .from("blog_posts")
      .select("*");

    console.log("Debug: All posts result:", { allPosts, allError });

    // Test 2: Get published posts
    const { data: publishedPosts, error: publishedError } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true);

    console.log("Debug: Published posts result:", {
      publishedPosts,
      publishedError,
    });

    // Test 3: Get unpublished posts
    const { data: unpublishedPosts, error: unpublishedError } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", false);

    console.log("Debug: Unpublished posts result:", {
      unpublishedPosts,
      unpublishedError,
    });

    return NextResponse.json({
      success: true,
      allPosts: {
        count: allPosts?.length || 0,
        data: allPosts,
        error: allError?.message,
      },
      publishedPosts: {
        count: publishedPosts?.length || 0,
        data: publishedPosts,
        error: publishedError?.message,
      },
      unpublishedPosts: {
        count: unpublishedPosts?.length || 0,
        data: unpublishedPosts,
        error: unpublishedError?.message,
      },
    });
  } catch (error: any) {
    console.error("Debug API error:", error);
    return NextResponse.json(
      {
        error: "Debug failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
