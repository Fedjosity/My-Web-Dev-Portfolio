"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

// Mock blog posts - in a real app, these would come from a CMS or markdown files
const blogPosts = [
  {
    id: "1",
    title: "Building Modern Web Apps with Next.js 14",
    excerpt:
      "Exploring the latest features in Next.js 14 and how they improve developer experience and application performance.",
    content: "Full blog post content would go here...",
    date: "2024-01-15",
    readTime: "5 min read",
    tags: ["Next.js", "React", "Web Development"],
    featured: true,
  },
  {
    id: "2",
    title: "The Power of TypeScript in Large Applications",
    excerpt:
      "How TypeScript helps maintain code quality and prevents bugs in large-scale applications.",
    content: "Full blog post content would go here...",
    date: "2024-01-10",
    readTime: "7 min read",
    tags: ["TypeScript", "JavaScript", "Development"],
    featured: false,
  },
  {
    id: "3",
    title: "Optimizing React Performance with Modern Techniques",
    excerpt:
      "Best practices for keeping your React applications fast and responsive.",
    content: "Full blog post content would go here...",
    date: "2024-01-05",
    readTime: "6 min read",
    tags: ["React", "Performance", "Optimization"],
    featured: false,
  },
  {
    id: "4",
    title: "CSS-in-JS vs Tailwind CSS: A Developer's Perspective",
    excerpt:
      "Comparing different styling approaches and their trade-offs in modern web development.",
    content: "Full blog post content would go here...",
    date: "2024-01-01",
    readTime: "4 min read",
    tags: ["CSS", "Tailwind", "Styling"],
    featured: false,
  },
];

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.featured);
  const regularPosts = blogPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Blog & Notes</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Thoughts on web development, programming concepts, and lessons
            learned from building modern applications.
          </p>
        </motion.div>

        {/* Featured Post */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-blue-500/10 to-green-500/10 p-8 flex items-center justify-center">
                  <div className="text-4xl font-bold text-primary">
                    Featured
                  </div>
                </div>
                <div className="md:w-2/3">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(featuredPost.date).toLocaleDateString()}
                      <Clock className="h-4 w-4 ml-2" />
                      {featuredPost.readTime}
                    </div>
                    <CardTitle className="text-2xl mb-2">
                      {featuredPost.title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Array.isArray(featuredPost.tags) &&
                        featuredPost.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">
                      {featuredPost.excerpt}
                    </p>
                    <Button asChild>
                      <Link href={`/blog/${featuredPost.id}`}>
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Regular Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors group">
                  <CardHeader>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString()}
                      <Clock className="h-4 w-4 ml-2" />
                      {post.readTime}
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      <Link href={`/blog/${post.id}`}>{post.title}</Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Array.isArray(post.tags) &&
                        post.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${post.id}`}>
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Coming Soon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center py-12 mt-12"
        >
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm max-w-md mx-auto">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-2">More Coming Soon</h3>
              <p className="text-muted-foreground mb-4">
                I'm constantly writing about new technologies and sharing
                insights from my development journey. Check back regularly for
                new content!
              </p>
              <Button variant="outline" asChild>
                <Link href="/contact">Suggest a Topic</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
