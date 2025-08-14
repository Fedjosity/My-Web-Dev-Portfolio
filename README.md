# Fedjost Ayomide - Developer Portfolio

A modern, responsive developer portfolio built with Next.js 14, featuring 3D elements, GitHub integration, and a hidden admin panel.

## Features

- **Modern Design**: Sleek, minimalist design with dark/light mode support
- **3D Elements**: Interactive 3D visuals using Three.js and React Three Fiber
- **GitHub Integration**: Real-time repository syncing and statistics
- **Supabase Backend**: Contact form handling and project management
- **Admin Panel**: Hidden admin interface at `/admin` (password: 2004)
- **Responsive**: Fully responsive design for all devices
- **Animations**: Smooth animations using Framer Motion
- **SEO Optimized**: Dynamic metadata and Open Graph tags

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **UI Components**: ShadCN UI
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Animations**: Framer Motion
- **Database**: Supabase
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Pages

1. **Home** - Hero section with 3D elements, GitHub stats, tech stack, and timeline
2. **Projects** - GitHub repositories and custom projects with filtering
3. **Blog** - Development articles and notes
4. **Contact** - Contact form with Supabase integration
5. **Admin** - Hidden admin panel for project management

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# GitHub API
NEXT_PUBLIC_GITHUB_USERNAME=fedjosity
GITHUB_TOKEN=your_github_token_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Admin
ADMIN_PASSWORD=2004
```

## Database Setup

1. Create a new Supabase project
2. Run the migration file in `supabase/migrations/create_portfolio_tables.sql`
3. Update your environment variables with your Supabase credentials

## Installation & Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Admin Panel

Access the admin panel at `/admin` with password "2004" to:
- Add custom projects
- View contact form submissions
- Manage portfolio content
- View analytics

## Deployment

The app is configured for static export and can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

## License

MIT License - feel free to use this as a template for your own portfolio!