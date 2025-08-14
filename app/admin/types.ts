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

export type NewProjectInput = {
  title: string;
  description: string;
  tech_stack: string;
  live_link: string;
  github_link: string;
  image_url: string;
  tags: string;
};
