"use client";

import { usePageViewTracking } from "@/hooks/use-analytics";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  // Track page views
  usePageViewTracking();

  return <>{children}</>;
}
