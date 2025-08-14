/*
  # Fix Blog Posts RLS Policies

  The current RLS policies might be too restrictive. This migration
  updates the policies to ensure proper access to blog posts.
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view published blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Anyone can insert blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Anyone can update blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Anyone can delete blog posts" ON blog_posts;

-- Create more permissive policies for testing
-- Allow anyone to view all posts (for admin panel)
CREATE POLICY "Anyone can view all blog posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anyone to insert posts
CREATE POLICY "Anyone can insert blog posts"
  ON blog_posts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to update posts
CREATE POLICY "Anyone can update blog posts"
  ON blog_posts
  FOR UPDATE
  TO anon, authenticated
  USING (true);

-- Allow anyone to delete posts
CREATE POLICY "Anyone can delete blog posts"
  ON blog_posts
  FOR DELETE
  TO anon, authenticated
  USING (true);
