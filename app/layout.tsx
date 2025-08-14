import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/hooks/use-theme";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Fedjost Ayomide - Fullstack Web Developer",
    template: "%s | Fedjost Ayomide",
  },
  description:
    "Fullstack web developer specializing in React, Next.js, TypeScript, and modern web technologies. Building beautiful, responsive, and user-friendly applications.",
  keywords: [
    "Fedjost Ayomide",
    "Fullstack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Web Developer",
  ],
  authors: [{ name: "Fedjost Ayomide" }],
  creator: "Fedjost Ayomide",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fedjost-ayomide.vercel.app",
    title: "Fedjost Ayomide - Fullstack Web Developer",
    description:
      "Fullstack web developer specializing in React, Next.js, TypeScript, and modern web technologies.",
    siteName: "Fedjost Ayomide Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fedjost Ayomide - Fullstack Web Developer",
    description:
      "Fullstack web developer specializing in React, Next.js, TypeScript, and modern web technologies.",
    creator: "@fedjosity",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="dark">
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
