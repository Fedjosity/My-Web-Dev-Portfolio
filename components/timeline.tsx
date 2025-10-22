"use client";

import { motion } from "framer-motion";
import { Timeline as TimelineUI } from "./ui/timeline";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const timeline = [
  {
    year: "2021",
    title: "Started Programming Journey",
    description: "Began learning HTML, CSS, and JavaScript fundamentals",
    skills: ["HTML", "CSS", "JavaScript"],
  },
  {
    year: "2022",
    title: "Frontend Frameworks",
    description:
      "Discovered React and started building interactive web applications",
    skills: ["React", "Tailwind CSS", "Redux"],
  },
  {
    year: "2023",
    title: "Full Stack Development",
    description: "Learned backend technologies and database management",
    skills: ["Node.js", "Express", "MongoDB", "PostgreSQL", "JWT"],
  },
  {
    year: "2024",
    title: "Modern Stack Mastery",
    description:
      "Specialized in Next.js, TypeScript, and modern development practices",
    skills: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    title: "Professional Growth",
    description:
      "Building production-ready applications and expanding expertise",
    skills: ["Supabase", "Framer Motion", "Three.js", "Docker", "Vercel"],
  },
];

export function Timeline() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">My Journey</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From curious beginner to fullstack developer - here&apos;s how
            I&apos;ve grown over the years
          </p>
        </motion.div>

        <div className="space-y-8">
          {timeline.map((item, index) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className={`flex flex-col md:flex-row ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } items-center gap-8`}
            >
              <div className="flex-1 max-w-lg">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold text-primary">
                        {item.year}
                      </div>
                      <CardTitle>{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {item.description}
                    </p>
                    <motion.div
                      className="flex flex-wrap gap-2"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={{
                        hidden: {},
                        visible: {
                          transition: { staggerChildren: 0.05 },
                        },
                      }}
                    >
                      {item.skills.map((skill) => (
                        <motion.div
                          key={skill}
                          variants={{
                            hidden: { opacity: 0, y: 6 },
                            visible: { opacity: 1, y: 0 },
                          }}
                        >
                          <Badge variant="secondary">{skill}</Badge>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>
              </div>

              <div className="hidden md:flex items-center justify-center">
                <div className="w-4 h-4 bg-primary rounded-full relative shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75" />
                </div>
              </div>

              <div className="flex-1 max-w-lg md:block hidden" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
