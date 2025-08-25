import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // First get the blog post to get its ID
    const { data: post, error: postError } = await supabase
      .from("blog_posts")
      .select("id")
      .eq("slug", params.slug)
      .eq("published", true)
      .single();

    if (postError || !post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // Get images for this post
    const { data: images, error: imagesError } = await supabase
      .from("blog_images")
      .select("*")
      .eq("post_id", post.id)
      .order("order_index", { ascending: true });

    if (imagesError) {
      console.error("Error fetching images:", imagesError);
      return NextResponse.json(
        { error: "Failed to fetch images" },
        { status: 500 }
      );
    }

    return NextResponse.json(images || []);
  } catch (error) {
    console.error("Error in images API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
