"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const techCategories = [
  {
    id: "frontend",
    title: "Frontend",
    accent: "from-blue-500/15 to-cyan-500/15",
    ring: "ring-blue-500/40",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Zustand",
      "React Hook Form",
      "Shadcn/UI",
      "Radix UI",
      "CSS Modules",
    ],
  },
  {
    id: "backend",
    title: "Backend",
    accent: "from-emerald-500/15 to-green-500/15",
    ring: "ring-emerald-500/40",
    items: [
      "Node.js",
      "Express",
      "Next.js API Routes",
      "tRPC",
      "REST",
      "GraphQL",
      "WebSockets",
    ],
  },
  {
    id: "data-auth",
    title: "DB & Auth",
    accent: "from-purple-500/15 to-fuchsia-500/15",
    ring: "ring-purple-500/40",
    items: [
      "PostgreSQL",
      "Supabase",
      "Prisma",
      "Firebase",
      "Auth.js",
      "Row Level Security",
    ],
  },
  {
    id: "devops",
    title: "DevOps",
    accent: "from-orange-500/15 to-amber-500/15",
    ring: "ring-orange-500/40",
    items: [
      "Vercel",
      "Docker",
      "CI/CD",
      "GitHub Actions",
      "NGINX",
      "Cloud Storage",
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function TechStackChart() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-center">Tech Stack</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={techCategories[0].id} className="w-full">
          <div className="flex items-center justify-center">
            <TabsList className="flex w-full max-w-full overflow-x-auto no-scrollbar justify-start sm:justify-center">
              {techCategories.map((c) => (
                <TabsTrigger
                  key={c.id}
                  value={c.id}
                  className="whitespace-nowrap"
                >
                  {c.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {techCategories.map((c) => (
            <TabsContent key={c.id} value={c.id} className="mt-6">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-3 sm:grid-cols-2"
              >
                {c.items.map((tech, idx) => (
                  <motion.div key={tech} variants={itemVariants}>
                    <div
                      className={cn(
                        "group relative rounded-xl border border-border/60 bg-gradient-to-br p-3 transition-shadow",
                        "hover:shadow-lg hover:shadow-black/5",
                        c.accent
                      )}
                    >
                      <div
                        className={cn(
                          "pointer-events-none absolute inset-0 rounded-xl ring-0 transition-all duration-300 group-hover:ring-2",
                          c.ring
                        )}
                      />
                      <div className="relative z-10 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background/70 border border-border/40">
                          <Sparkles className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium leading-none">{tech}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {c.title}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
