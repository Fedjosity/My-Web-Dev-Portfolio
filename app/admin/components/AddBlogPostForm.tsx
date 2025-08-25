"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus, Eye, Edit3, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { formatBlogContent } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";
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
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load existing images when editing
  useEffect(() => {
    if (editingPost?.id) {
      const loadExistingImages = async () => {
        try {
          const response = await fetch(
            `/api/blog/posts/${editingPost.slug}/images`
          );
          if (response.ok) {
            const imagesData = await response.json();
            setImages(
              imagesData.map((img: any) => ({
                id: img.id,
                url: img.image_url,
                altText: img.alt_text,
                caption: img.caption || "",
                order: img.order_index,
              }))
            );
          }
        } catch (error) {
          console.error("Error loading existing images:", error);
        }
      };
      loadExistingImages();
    }
  }, [editingPost]);

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

      let postId: string;

      if (editingPost) {
        // Update existing post
        const { data: updateData, error } = await supabase
          .from("blog_posts")
          .update(blogData)
          .eq("id", editingPost.id)
          .select()
          .single();

        if (error) throw error;
        postId = editingPost.id;
        toast.success("Blog post updated successfully!");
      } else {
        // Create new post
        const { data: insertData, error } = await supabase
          .from("blog_posts")
          .insert([blogData])
          .select()
          .single();

        if (error) throw error;
        postId = insertData.id;
        toast.success("Blog post created successfully!");
      }

      // Save images if any
      if (images.length > 0 && postId) {
        // Delete existing images first (for updates)
        if (editingPost) {
          await supabase.from("blog_images").delete().eq("post_id", postId);
        }

        const uploadedImages = images.filter((img) => img.url);
        if (uploadedImages.length > 0) {
          const imageData = uploadedImages.map((img, index) => ({
            post_id: postId,
            image_url: img.url,
            alt_text: img.altText,
            caption: img.caption,
            order_index: index,
          }));

          const { error: imageError } = await supabase
            .from("blog_images")
            .insert(imageData);

          if (imageError) {
            console.error("Error saving images:", imageError);
            toast.error("Blog post saved but images failed to save");
          } else {
            toast.success("Blog post and images saved successfully!");
          }
        }
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
            <Tabs defaultValue="write" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="write" className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4" />
                  Write
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </TabsTrigger>
              </TabsList>
              <TabsContent value="write" className="space-y-2">
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  required
                  placeholder="Write your blog post content here...

# Main Heading
## Sub Heading
### Section Heading

**Bold text** and *italic text*

- List item 1
- List item 2

```javascript
console.log('Code block');
```

[Link text](https://example.com)"
                  rows={15}
                />
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    <strong>Formatting Guide:</strong>
                  </p>
                  <p>• Use # ## ### for headings</p>
                  <p>• Use **text** for bold and *text* for italic</p>
                  <p>• Use - for bullet lists</p>
                  <p>• Use ``` for code blocks</p>
                  <p>• Use `code` for inline code</p>
                  <p>• Use [text](url) for links</p>
                  <p>• Use double line breaks for paragraphs</p>
                </div>
              </TabsContent>
              <TabsContent value="preview">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div
                      className="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-code:text-primary prose-pre:bg-muted prose-pre:text-foreground"
                      dangerouslySetInnerHTML={{
                        __html: formatBlogContent(formData.content),
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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

          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Blog Images
            </Label>
            <ImageUpload
              images={images}
              onImagesChange={setImages}
              maxImages={10}
            />
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
