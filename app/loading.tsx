"use client";
import React from "react";

export default function GlobalLoader() {
  const cells = Array.from({ length: 9 });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-md">
      <div
        className="flex flex-wrap"
        style={
          {
            "--cell-size": "32px", // reduced size
            "--cell-spacing": "0.5px", // tighter spacing
            "--cells": 3,
            "--total-size":
              "calc(var(--cells) * (var(--cell-size) + 2 * var(--cell-spacing)))",
          } as React.CSSProperties
        }
      >
        {cells.map((_, i) => (
          <div
            key={i}
            className="m-[var(--cell-spacing)] h-[var(--cell-size)] w-[var(--cell-size)] rounded bg-transparent animate-ripple"
            style={{
              animationDelay: `${i * 100}ms`,
              ["--cell-color" as any]: [
                "#00FF87",
                "#0CFD95",
                "#17FBA2",
                "#23F9B2",
                "#30F7C3",
                "#3DF5D4",
                "#45F4DE",
                "#53F1F0",
                "#60EFFF",
              ][i],
            }}
          />
        ))}
      </div>
    </div>
  );
}
