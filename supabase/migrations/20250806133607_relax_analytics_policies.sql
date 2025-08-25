-- Relax analytics RLS policies to allow public reads without auth sessions

-- Page views: allow anyone to SELECT
CREATE POLICY "Anyone can view page views"
  ON page_views
  FOR SELECT
  TO anon
  USING (true);

-- Blog post views: allow anyone to SELECT
CREATE POLICY "Anyone can view blog post views"
  ON blog_post_views
  FOR SELECT
  TO anon
  USING (true);

-- Sessions: allow anyone to SELECT (only metadata; no PII stored)
CREATE POLICY "Anyone can view sessions"
  ON sessions
  FOR SELECT
  TO anon
  USING (true);
