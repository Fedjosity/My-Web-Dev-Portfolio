"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { NewProjectInput } from "../../../types/admin-types";

type Props = {
  onAdded: () => void;
};

export default function AddProjectForm({ onAdded }: Props) {
  const [loading, setLoading] = useState(false);
  const [newProject, setNewProject] = useState<NewProjectInput>({
    title: "",
    description: "",
    tech_stack: "",
    live_link: "",
    github_link: "",
    image_url: "",
    tags: "",
  });

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("projects").insert([
        {
          title: newProject.title,
          description: newProject.description,
          tech_stack: newProject.tech_stack.split(",").map((s) => s.trim()),
          tags: newProject.tags.split(",").map((s) => s.trim()),
          live_link: newProject.live_link || null,
          github_link: newProject.github_link || null,
          image_url: newProject.image_url || null,
        },
      ]);
      if (error) throw error;
      toast.success("Project added successfully!");
      setNewProject({
        title: "",
        description: "",
        tech_stack: "",
        live_link: "",
        github_link: "",
        image_url: "",
        tags: "",
      });
      onAdded();
    } catch (err) {
      console.error("Error adding project:", err);
      toast.error("Failed to add project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Project</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAddProject} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newProject.title}
                onChange={(e) =>
                  setNewProject({ ...newProject, title: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tech_stack">Tech Stack (comma separated)</Label>
              <Input
                id="tech_stack"
                value={newProject.tech_stack}
                onChange={(e) =>
                  setNewProject({ ...newProject, tech_stack: e.target.value })
                }
                placeholder="React, Next.js, TypeScript"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newProject.description}
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              rows={3}
              required
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="live_link">Live Link (optional)</Label>
              <Input
                id="live_link"
                type="url"
                value={newProject.live_link}
                onChange={(e) =>
                  setNewProject({ ...newProject, live_link: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github_link">GitHub Link (optional)</Label>
              <Input
                id="github_link"
                type="url"
                value={newProject.github_link}
                onChange={(e) =>
                  setNewProject({ ...newProject, github_link: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL (optional)</Label>
              <Input
                id="image_url"
                type="url"
                value={newProject.image_url}
                onChange={(e) =>
                  setNewProject({ ...newProject, image_url: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={newProject.tags}
              onChange={(e) =>
                setNewProject({ ...newProject, tags: e.target.value })
              }
              placeholder="Fullstack, Web App, Clone"
              required
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Project"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
