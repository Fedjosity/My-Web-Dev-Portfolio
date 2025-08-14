"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { BlogPost, NewBlogPostInput } from "../../../types/admin-types";

interface AddBlogPostFormProps {
  onSuccess: () => void;
  editingPost?: BlogPost | null;
}

export default function AddBlogPostForm({
  onSuccess,
  editingPost,
}: AddBlogPostFormProps) {
  const [formData, setFormData] = useState<NewBlogPostInput>({
    title: editingPost?.title || "",
    slug: editingPost?.slug || "",
    excerpt: editingPost?.excerpt || "",
    content: editingPost?.content || "",
    tags: editingPost?.tags.join(", ") || "",
    featured: editingPost?.featured || false,
    published: editingPost?.published || false,
    read_time: editingPost?.read_time || 5,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const blogData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        tags: tagsArray,
        featured: formData.featured,
        published: formData.published,
        read_time: formData.read_time,
      };

      if (editingPost) {
        // Update existing post
        const { error } = await supabase
          .from("blog_posts")
          .update(blogData)
          .eq("id", editingPost.id);

        if (error) throw error;
        toast.success("Blog post updated successfully!");
      } else {
        // Create new post
        const { error } = await supabase.from("blog_posts").insert([blogData]);

        if (error) throw error;
        toast.success("Blog post created successfully!");
      }

      // Reset form
      if (!editingPost) {
        setFormData({
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          tags: "",
          featured: false,
          published: false,
          read_time: 5,
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error("Error saving blog post:", error);

      // Handle duplicate slug error specifically
      if (error.code === "23505" && error.message.includes("slug")) {
        toast.error(
          "A blog post with this slug already exists. Please use a different slug or generate a new one."
        );
      } else {
        toast.error(error.message || "Failed to save blog post");
      }
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = () => {
    const baseSlug = formData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Add timestamp to make it unique
    const timestamp = Date.now().toString().slice(-6);
    const uniqueSlug = `${baseSlug}-${timestamp}`;

    setFormData({ ...formData, slug: uniqueSlug });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editingPost ? "Edit Blog Post" : "Add New Blog Post"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                placeholder="Enter blog post title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                  placeholder="blog-post-slug"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateSlug}
                  className="whitespace-nowrap"
                >
                  Generate
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) =>
                setFormData({ ...formData, excerpt: e.target.value })
              }
              required
              placeholder="Brief description of the blog post"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
              placeholder="Write your blog post content here..."
              rows={10}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                placeholder="tag1, tag2, tag3"
              />
              <p className="text-xs text-muted-foreground">
                Separate tags with commas
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="read_time">Read Time (minutes)</Label>
              <Input
                id="read_time"
                type="number"
                min="1"
                value={formData.read_time}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    read_time: parseInt(e.target.value) || 5,
                  })
                }
                placeholder="5"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, featured: checked })
                }
              />
              <Label htmlFor="featured">Featured Post</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={formData.published}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, published: checked })
                }
              />
              <Label htmlFor="published">Published</Label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading
                ? "Saving..."
                : editingPost
                ? "Update Post"
                : "Create Post"}
            </Button>
            {editingPost && (
              <Button
                type="button"
                variant="outline"
                onClick={() => onSuccess()}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
