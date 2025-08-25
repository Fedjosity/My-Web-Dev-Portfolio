"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const techStack = [
  { name: "React/Next.js", level: 95, color: "#61dafb" },
  { name: "TypeScript", level: 90, color: "#3178c6" },
  { name: "Tailwind CSS", level: 92, color: "#38bdf8" },
  { name: "Node.js", level: 85, color: "#339933" },
  { name: "Supabase", level: 80, color: "#3776ab" },
  { name: "Dev Ops", level: 48, color: "#336791" },
  { name: "Firebase", level: 76, color: "#61dafb" },
];

export function TechStackChart() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-center">Tech Stack Proficiency</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {techStack.map((tech, index) => (
          <div key={tech.name} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{tech.name}</span>
              <span className="text-muted-foreground">{tech.level}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: tech.color }}
                initial={{ width: 0 }}
                animate={{ width: `${tech.level}%` }}
                transition={{
                  delay: index * 0.1,
                  duration: 1,
                  ease: "easeOut",
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
