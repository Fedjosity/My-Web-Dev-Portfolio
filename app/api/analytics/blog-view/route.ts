import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      postId,
      postSlug,
      postTitle,
      userAgent,
      ipAddress,
      referrer,
      sessionId,
      timeSpentSeconds,
    } = body;

    // Validate required fields
    if (!postSlug) {
      return NextResponse.json(
        { error: "Post slug is required" },
        { status: 400 }
      );
    }

    // Insert blog post view
    const { error } = await supabase.from("blog_post_views").insert([
      {
        post_id: postId || null,
        post_slug: postSlug,
        post_title: postTitle || null,
        user_agent: userAgent || null,
        ip_address: ipAddress || null,
        referrer: referrer || null,
        session_id: sessionId || null,
        time_spent_seconds: timeSpentSeconds || 0,
      },
    ]);

    if (error) {
      console.error("Error inserting blog post view:", error);
      return NextResponse.json(
        { error: "Failed to track blog post view" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in blog post view tracking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
