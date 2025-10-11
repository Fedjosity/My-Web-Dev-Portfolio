"use client";

import { motion } from "framer-motion";
import { Timeline as TimelineUI } from "./ui/timeline";

const timelineData = [
  {
    year: "2021",
    title: "The Foundation Year",
    content:
      "Started my coding journey with HTML, CSS, and vanilla JavaScript. Built my first static websites and learned the fundamentals of web development. Created several personal projects including a portfolio site and interactive calculators. This year taught me the importance of clean, semantic code and responsive design principles.",
    skills: ["HTML", "CSS", "JavaScript"],
  },
  {
    year: "2022",
    title: "Frontend Revolution",
    content:
      "Dove deep into React ecosystem and modern frontend development. Built dynamic single-page applications with state management, component architecture, and API integration. Explored CSS frameworks like Bootstrap and Tailwind CSS. Completed multiple projects including e-commerce interfaces and dashboard applications.",
    skills: ["React", "Bootstrap", "Tailwind CSS", "Redux"],
  },
  {
    year: "2023",
    title: "Full-Stack Transformation",
    content:
      "Expanded into backend development with Node.js and Express. Learned database design and management with both SQL (PostgreSQL) and NoSQL (MongoDB) databases. Built complete full-stack applications with authentication, API design, and deployment strategies. Started contributing to open-source projects.",
    skills: ["Node.js", "Express", "MongoDB", "PostgreSQL", "JWT"],
  },
  {
    year: "2024",
    title: "Modern Development Mastery",
    content:
      "Mastered the modern web development stack with Next.js, TypeScript, and advanced React patterns. Implemented server-side rendering, static site generation, and API routes. Focused on performance optimization, accessibility, and developer experience. Built production-ready applications with modern tooling and best practices.",
    skills: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
  },
  {
    year: "2025",
    title: "Professional Excellence",
    content:
      "Currently building enterprise-grade applications with Supabase, advanced 3D web experiences, and comprehensive DevOps practices. Implementing CI/CD pipelines, containerization with Docker, and cloud deployment strategies. Contributing to the developer community through technical writing and open-source projects.",
    skills: ["Supabase", "Framer Motion", "Three.js", "Docker", "Vercel"],
  },
];

export function Timeline() {
  return (
    <section className="py-20 w-full">
      <TimelineUI data={timelineData} />
    </section>
  );
}
