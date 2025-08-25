import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hammer, Wrench, Home, Mail } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-muted/30" />

      <Card className="max-w-2xl w-full border-primary/20">
        <CardContent className="p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Hammer className="h-6 w-6 text-primary" />
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 hidden sm:flex items-center justify-center">
              <Wrench className="h-6 w-6 text-primary" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Oops! This page doesn’t exist.
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            The page you’re looking for couldn’t be found. In the meantime, you
            can go back home, explore projects, or get in touch with me.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/projects">View Projects</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">
                <Mail className="mr-2 h-4 w-4" />
                Contact
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
