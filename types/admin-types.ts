export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  live_link: string | null;
  github_link: string | null;
  image_url: string | null;
  tags: string[];
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  read_time: number;
  created_at: string;
  updated_at: string;
}

export interface BlogImage {
  id: string;
  post_id: string;
  image_url: string;
  alt_text: string;
  caption?: string;
  order_index: number;
  created_at: string;
}

export type NewProjectInput = {
  title: string;
  description: string;
  tech_stack: string;
  live_link: string;
  github_link: string;
  image_url: string;
  tags: string;
};

export type NewBlogPostInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string;
  featured: boolean;
  published: boolean;
  read_time: number;
};
