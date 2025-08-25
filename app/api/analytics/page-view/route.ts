import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pagePath, pageTitle, userAgent, ipAddress, referrer, sessionId } =
      body;

    // Validate required fields
    if (!pagePath) {
      return NextResponse.json(
        { error: "Page path is required" },
        { status: 400 }
      );
    }

    // Insert page view
    const { error } = await supabase.from("page_views").insert([
      {
        page_path: pagePath,
        page_title: pageTitle || null,
        user_agent: userAgent || null,
        ip_address: ipAddress || null,
        referrer: referrer || null,
        session_id: sessionId || null,
      },
    ]);

    if (error) {
      console.error("Error inserting page view:", error);
      return NextResponse.json(
        { error: "Failed to track page view" },
        { status: 500 }
      );
    }

    // Update or create session
    if (sessionId) {
      const { data: existingSession } = await supabase
        .from("sessions")
        .select("id")
        .eq("session_id", sessionId)
        .single();

      if (existingSession) {
        // Update existing session
        await supabase
          .from("sessions")
          .update({ last_visit: new Date().toISOString() })
          .eq("session_id", sessionId);
      } else {
        // Create new session
        await supabase.from("sessions").insert([
          {
            session_id: sessionId,
            user_agent: userAgent || null,
            ip_address: ipAddress || null,
          },
        ]);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in page view tracking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
