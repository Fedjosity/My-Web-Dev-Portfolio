import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    console.log("Testing Supabase connection...");
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log(
      "Supabase Key exists:",
      !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    // Test basic connection
    const { data, error } = await supabase
      .from("blog_posts")
      .select("count")
      .limit(1);

    console.log("Test query result:", { data, error });

    if (error) {
      return NextResponse.json(
        {
          error: "Supabase connection failed",
          details: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }

    // Try to get all posts without any filters
    const { data: allPosts, error: postsError } = await supabase
      .from("blog_posts")
      .select("*");

    console.log("All posts query result:", { allPosts, postsError });

    return NextResponse.json({
      success: true,
      connection: "OK",
      totalPosts: allPosts?.length || 0,
      posts: allPosts || [],
      error: postsError?.message,
    });
  } catch (error: any) {
    console.error("Test API error:", error);
    return NextResponse.json(
      {
        error: "Test failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
