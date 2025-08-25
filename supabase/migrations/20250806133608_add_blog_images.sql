/*
  # Add Blog Images Support

  Create blog_images table for managing multiple images per blog post:
    - `id` (uuid, primary key)
    - `post_id` (uuid, foreign key to blog_posts)
    - `image_url` (text, the uploaded image URL)
    - `alt_text` (text, accessibility description)
    - `caption` (text, optional caption)
    - `order` (integer, for ordering images)
    - `created_at` (timestamp)
*/

-- Create blog_images table
CREATE TABLE IF NOT EXISTS blog_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  caption text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE blog_images ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_images table
-- Public can view images for published posts
CREATE POLICY "Anyone can view blog images for published posts"
  ON blog_images
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM blog_posts 
      WHERE blog_posts.id = blog_images.post_id 
      AND blog_posts.published = true
    )
  );

-- Anyone can insert images (for admin)
CREATE POLICY "Anyone can insert blog images"
  ON blog_images
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Anyone can update images (for admin)
CREATE POLICY "Anyone can update blog images"
  ON blog_images
  FOR UPDATE
  TO anon, authenticated
  USING (true);

-- Anyone can delete images (for admin)
CREATE POLICY "Anyone can delete blog images"
  ON blog_images
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_blog_images_post_id ON blog_images(post_id);
CREATE INDEX idx_blog_images_order ON blog_images(order_index);
