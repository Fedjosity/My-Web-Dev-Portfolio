"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  year: string;
  title: string;
  content: string;
  skills: string[];
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  // Fallback for mobile - ensure timeline is always visible
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="w-full bg-white dark:bg-neutral-950 font-sans "
      ref={containerRef}
    >
      <div className=" py-20 px-4 md:px-32 ">
        <h2 className="text-2xl md:text-4xl mb-4 text-black dark:text-white max-w-4xl">
          My Journey
        </h2>
        <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base ">
          From curious beginner to fullstack developer - here&apos;s how
          I&apos;ve grown over the years
        </p>
      </div>

      <div ref={ref} className="relative w-full max-w-7xl mx-auto pb-20 px-4">
        {data.map((item, index) => (
          <div
            key={index}
            className={`flex justify-start pt-10 md:pt-40 md:gap-10 ${
              isVisible ? "opacity-100" : "opacity-0"
            } transition-opacity duration-500`}
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-4 md:left-4 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700" />
              </div>
              <div className="hidden md:block md:pl-20">
                <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  {item.year}
                </div>
                <h3 className="text-xl md:text-5xl font-bold text-neutral-500 dark:text-neutral-500">
                  {item.title}
                </h3>
              </div>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <div className="md:hidden block mb-4">
                <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  {item.year}
                </div>
                <h3 className="text-2xl font-bold text-neutral-500 dark:text-neutral-500">
                  {item.title}
                </h3>
              </div>
              <div className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base mb-4 leading-relaxed">
                {item.content}
              </div>
              <div className="flex flex-wrap gap-2">
                {item.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full border border-green-200 dark:border-green-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute left-9 md:left-9 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: isVisible ? heightTransform : height,
              opacity: isVisible ? opacityTransform : 1,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-blue-500 via-green-500  to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
