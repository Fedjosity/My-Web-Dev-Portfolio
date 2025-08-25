-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policy to allow public access to blog images
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

-- Create storage policy to allow anyone to upload images (for admin)
CREATE POLICY "Anyone can upload images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'blog-images');

-- Create storage policy to allow anyone to update images (for admin)
CREATE POLICY "Anyone can update images" ON storage.objects
FOR UPDATE USING (bucket_id = 'blog-images');

-- Create storage policy to allow anyone to delete images (for admin)
CREATE POLICY "Anyone can delete images" ON storage.objects
FOR DELETE USING (bucket_id = 'blog-images');
