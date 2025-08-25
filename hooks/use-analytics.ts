import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface AnalyticsData {
  pagePath: string;
  pageTitle?: string;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  sessionId?: string;
}

interface BlogAnalyticsData extends AnalyticsData {
  postId?: string;
  postSlug: string;
  postTitle?: string;
  timeSpentSeconds?: number;
}

// Generate a unique session ID
const generateSessionId = (): string => {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    localStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
};

// Get client information
const getClientInfo = () => {
  if (typeof window === "undefined") return {};

  return {
    userAgent: navigator.userAgent,
    referrer: document.referrer,
    sessionId: generateSessionId(),
  };
};

export const usePageViewTracking = () => {
  const pathname = usePathname();
  const lastPathRef = useRef<string>("");

  useEffect(() => {
    if (pathname && pathname !== lastPathRef.current) {
      lastPathRef.current = pathname;

      const clientInfo = getClientInfo();
      const analyticsData: AnalyticsData = {
        pagePath: pathname,
        pageTitle: document.title,
        ...clientInfo,
      };

      // Track page view
      fetch("/api/analytics/page-view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(analyticsData),
      }).catch(console.error);
    }
  }, [pathname]);
};

export const useBlogPostTracking = (
  postSlug: string,
  postId?: string,
  postTitle?: string
) => {
  const startTimeRef = useRef<number>(Date.now());
  const isTrackingRef = useRef<boolean>(false);

  useEffect(() => {
    if (!postSlug || isTrackingRef.current) return;

    isTrackingRef.current = true;
    startTimeRef.current = Date.now();

    const clientInfo = getClientInfo();
    const analyticsData: BlogAnalyticsData = {
      pagePath: `/blog/${postSlug}`,
      pageTitle: postTitle,
      postId,
      postSlug,
      postTitle,
      ...clientInfo,
    };

    fetch("/api/analytics/blog-view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(analyticsData),
    }).catch(console.error);

    const handleBeforeUnload = () => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);

      if (timeSpent > 0) {
        fetch("/api/analytics/blog-view", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...analyticsData,
            timeSpentSeconds: timeSpent,
          }),
        }).catch(console.error);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [postSlug, postId, postTitle]);
};
