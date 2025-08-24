import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/hooks/use-theme";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://fedjost-ayomide.vercel.app"), // ensures absolute URLs for OG/twitter
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
    "Portfolio",
    "Frontend",
    "Backend",
  ],
  authors: [
    { name: "Fedjost Ayomide", url: "https://fedjost-ayomide.vercel.app" },
  ],
  creator: "Fedjost Ayomide",
  publisher: "Fedjost Ayomide",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fedjost-ayomide.vercel.app",
    title: "Fedjost Ayomide - Fullstack Web Developer",
    description:
      "Fullstack web developer specializing in React, Next.js, TypeScript, and modern web technologies.",
    siteName: "Fedjost Ayomide Portfolio",
    images: [
      {
        url: "/WhatsApp Image 2025-07-27 at 11.22.45 AM (1).jpeg", // add an image inside /public
        width: 1200,
        height: 630,
        alt: "Fedjost Ayomide Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@fedjosity",
    creator: "@fedjosity",
    title: "Fedjost Ayomide - Fullstack Web Developer",
    description:
      "Fullstack web developer specializing in React, Next.js, TypeScript, and modern web technologies.",
    images: ["/WhatsApp Image 2025-07-27 at 11.22.45 AM (1).jpeg"],
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
  alternates: {
    canonical: "https://fedjost-ayomide.vercel.app",
  },
  verification: {
    google: "your-google-verification-code",
    // other verifications you can add later
    // yandex: "...",
    // bing: "...",
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
        <ThemeProvider defaultTheme="dark" attribute="class">
          <Navigation />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
