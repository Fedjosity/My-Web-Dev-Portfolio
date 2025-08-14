"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddProjectForm from "./AddProjectForm";
import ProjectsList from "./ProjectsList";
import ContactsList from "./ContactsList";
import AddBlogPostForm from "./AddBlogPostForm";
import BlogPostsList from "./BlogPostsList";
import type { Contact, Project, BlogPost } from "../../../types/admin-types";

type Props = {
  projects: Project[];
  contacts: Contact[];
  blogPosts: BlogPost[];
  onRefresh: () => void;
};

export default function TabsContainer({
  projects,
  contacts,
  blogPosts,
  onRefresh,
}: Props) {
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setShowBlogForm(true);
  };

  const handleBlogSuccess = () => {
    setShowBlogForm(false);
    setEditingPost(null);
    onRefresh();
  };

  return (
    <Tabs defaultValue="projects" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="blog">Blog Posts</TabsTrigger>
        <TabsTrigger value="contacts">Contacts</TabsTrigger>
      </TabsList>

      <TabsContent value="projects" className="space-y-6">
        <AddProjectForm onAdded={onRefresh} />
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Custom Projects</h2>
          <ProjectsList projects={projects} onChanged={onRefresh} />
        </div>
      </TabsContent>

      <TabsContent value="blog" className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Blog Posts</h2>
          <Button
            onClick={() => setShowBlogForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Post
          </Button>
        </div>

        {showBlogForm && (
          <AddBlogPostForm
            onSuccess={handleBlogSuccess}
            editingPost={editingPost}
          />
        )}

        <BlogPostsList
          posts={blogPosts}
          onRefresh={onRefresh}
          onEdit={handleEditPost}
        />
      </TabsContent>

      <TabsContent value="contacts" className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Contact Messages</h2>
          <ContactsList contacts={contacts} onChanged={onRefresh} />
        </div>
      </TabsContent>
    </Tabs>
  );
}
