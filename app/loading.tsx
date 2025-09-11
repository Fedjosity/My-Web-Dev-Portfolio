import React from "react";
import { LoaderFive } from "@/components/ui/loader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md opacity-0 animate-fadeIn">
      <LoaderFive text="Loading..." />
    </div>
  );
}
