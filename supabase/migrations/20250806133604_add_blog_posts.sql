/*
  # Add Blog Posts Table

  Create `blog_posts` table for managing blog content:
    - `id` (uuid, primary key)
    - `title` (text)
    - `slug` (text, unique)
    - `excerpt` (text)
    - `content` (text)
    - `tags` (text array)
    - `featured` (boolean)
    - `published` (boolean)
    - `read_time` (integer, minutes)
    - `created_at` (timestamp)
    - `updated_at` (timestamp)
*/

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  featured boolean DEFAULT false,
  published boolean DEFAULT false,
  read_time integer DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_posts table
-- Public can view published posts
CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Admin can manage all posts (insert, update, delete)
CREATE POLICY "Anyone can insert blog posts"
  ON blog_posts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can update blog posts"
  ON blog_posts
  FOR UPDATE
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can delete blog posts"
  ON blog_posts
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_blog_posts_updated_at 
    BEFORE UPDATE ON blog_posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);
