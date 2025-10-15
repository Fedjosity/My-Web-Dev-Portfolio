"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExternalLink, Github, Star, GitFork, Calendar } from "lucide-react";
import { getGitHubRepos } from "@/lib/github";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  updated_at: string;
}

interface CustomProject {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  live_link: string | null;
  github_link: string | null;
  image_url: string | null;
  tags: string[];
  created_at: string;
}

export default function ProjectsPage() {
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([]);
  const [customProjects, setCustomProjects] = useState<CustomProject[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<GitHubRepo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updated");
  const [filterTag, setFilterTag] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch GitHub repos
        const repos = await getGitHubRepos();
        setGithubRepos(repos);
        setFilteredRepos(repos);

        // Fetch custom projects from Supabase
        const { data: projects, error } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching custom projects:", error);
        } else {
          setCustomProjects(projects || []);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    let filtered = githubRepos;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (repo) =>
          repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          repo.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by language/tag
    if (filterTag !== "all") {
      filtered = filtered.filter((repo) => repo.language === filterTag);
    }

    // Sort repos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "stars":
          return b.stargazers_count - a.stargazers_count;
        case "forks":
          return b.forks_count - a.forks_count;
        case "name":
          return a.name.localeCompare(b.name);
        case "updated":
        default:
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
      }
    });

    setFilteredRepos(filtered);
  }, [githubRepos, searchTerm, sortBy, filterTag]);

  const allLanguages = Array.from(
    new Set(githubRepos.map((repo) => repo.language).filter(Boolean))
  ).sort();

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded-lg w-1/2 mx-auto" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">My Projects</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A showcase of my work, including both GitHub repositories and custom
            projects. Each project demonstrates different skills and
            technologies.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8 min-h-[60px]"
        >
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:max-w-sm h-10"
          />

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="sm:w-40 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50">
              <SelectItem value="updated">Recently Updated</SelectItem>
              <SelectItem value="stars">Most Stars</SelectItem>
              <SelectItem value="forks">Most Forks</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterTag} onValueChange={setFilterTag}>
            <SelectTrigger className="sm:w-40 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-50">
              <SelectItem value="all">All Languages</SelectItem>
              {allLanguages.map((language) => (
                <SelectItem key={language} value={language!}>
                  {language}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Custom Projects Section */}
        {customProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold mb-6">Featured Projects</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                    {project.image_url && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <Image
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                          width={500}
                          height={500}
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{project.title}</span>
                        <div className="flex gap-2">
                          {project.live_link && (
                            <Button size="sm" variant="ghost" asChild>
                              <a
                                href={project.live_link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {project.github_link && (
                            <Button size="sm" variant="ghost" asChild>
                              <a
                                href={project.github_link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Github className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {Array.isArray(project.tech_stack) &&
                          project.tech_stack.map((tech) => (
                            <Badge key={tech} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(project.tags) &&
                          project.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* GitHub Repositories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6">
            GitHub Repositories ({filteredRepos.length})
          </h2>
          <div className="flex flex-col gap-6">
            {filteredRepos.map((repo, index) => (
              <motion.div
                key={repo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="truncate">{repo.name}</span>
                      <Button size="sm" variant="ghost" asChild>
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {repo.description || "No description available"}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      {repo.stargazers_count > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          {repo.stargazers_count}
                        </div>
                      )}
                      {repo.forks_count > 0 && (
                        <div className="flex items-center gap-1">
                          <GitFork className="h-3 w-3" />
                          {repo.forks_count}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(repo.updated_at).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {repo.language && (
                        <Badge variant="secondary">{repo.language}</Badge>
                      )}
                      {repo.topics.slice(0, 3).map((topic) => (
                        <Badge key={topic} variant="outline">
                          {topic}
                        </Badge>
                      ))}
                      {repo.topics.length > 3 && (
                        <Badge variant="outline">
                          +{repo.topics.length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {filteredRepos.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground text-lg">
              No projects found matching your criteria.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
