"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { BlogPost } from "../../../types/admin-types";

interface BlogPostsListProps {
  posts: BlogPost[];
  onRefresh: () => void;
  onEdit: (post: BlogPost) => void;
}

export default function BlogPostsList({
  posts,
  onRefresh,
  onEdit,
}: BlogPostsListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    setDeletingId(id);
    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);

      if (error) throw error;
      toast.success("Blog post deleted successfully!");
      onRefresh();
    } catch (error: any) {
      console.error("Error deleting blog post:", error);
      toast.error(error.message || "Failed to delete blog post");
    } finally {
      setDeletingId(null);
    }
  };

  const togglePublished = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({ published: !post.published })
        .eq("id", post.id);

      if (error) throw error;
      toast.success(
        `Post ${post.published ? "unpublished" : "published"} successfully!`
      );
      onRefresh();
    } catch (error: any) {
      console.error("Error updating blog post:", error);
      toast.error(error.message || "Failed to update blog post");
    }
  };

  const toggleFeatured = async (post: BlogPost) => {
    try {
      const { error } = await supabase
        .from("blog_posts")
        .update({ featured: !post.featured })
        .eq("id", post.id);

      if (error) throw error;
      toast.success(
        `Post ${post.featured ? "unfeatured" : "featured"} successfully!`
      );
      onRefresh();
    } catch (error: any) {
      console.error("Error updating blog post:", error);
      toast.error(error.message || "Failed to update blog post");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Blog Posts ({posts.length})</h3>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No blog posts found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      <div className="flex gap-1">
                        {post.featured && (
                          <Badge variant="default" className="text-xs">
                            Featured
                          </Badge>
                        )}
                        {post.published ? (
                          <Badge variant="secondary" className="text-xs">
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Draft
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Slug: {post.slug}</span>
                      <span>{post.read_time} min read</span>
                      <span>
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {post.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePublished(post)}
                    >
                      {post.published ? "Unpublish" : "Publish"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFeatured(post)}
                    >
                      {post.featured ? "Unfeature" : "Feature"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(post.id)}
                      disabled={deletingId === post.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
