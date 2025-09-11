import { Hero3D } from "@/components/hero-3d";
import { GitHubStats } from "@/components/github-stats";
import { TechStackChart } from "@/components/tech-stack-chart";
import { Timeline } from "@/components/timeline";
import { Button } from "@/components/ui/button";
import { ArrowDown, Download, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-green-500/5 to-purple-500/5" />

        {/* 3D Background */}
        <div className="absolute inset-0 opacity-30">
          <Hero3D />
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-500 via-green-500 to-blue-500 bg-clip-text text-transparent">
              Fedjost Ayomide
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Fullstack Web Developer
          </p>

          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
            Crafting beautiful, responsive, and user-friendly web applications
            with modern technologies like React, Next.js, and TypeScript.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="group" asChild>
              <Link href="/projects">
                View My Work
                <ArrowDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
              </Link>
            </Button>

            <Button size="lg" variant="outline" className="group" asChild>
              <a href="/Fedjost-Ayomide-Web-Dev-CV.pdf" download>
                <Download className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Download CV
              </a>
            </Button>
          </div>

          <div className="flex justify-center gap-6">
            <Button variant="ghost" size="lg" className="group" asChild>
              <a
                href="https://github.com/fedjosity"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
            </Button>

            <Button variant="ghost" size="lg" className="group" asChild>
              <a
                href="https://www.linkedin.com/in/fedjostayomide"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
            </Button>

            <Button variant="ghost" size="lg" className="group" asChild>
              <Link href="/contact">
                <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </Link>
            </Button>

            <Button variant="ghost" size="lg" className="group" asChild>
              <Link href="https://wa.me/2348167568818">
                <FaWhatsapp className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </section>

      {/* GitHub Stats Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">GitHub Activity</h2>
          <p className="text-muted-foreground">
            Live stats from my GitHub profile
          </p>
        </div>

        <div className="container mx-auto px-4">
          <GitHubStats />
        </div>
      </section>

      {/* Technical Skills Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div>
            <div className="relative group mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-border/50 shadow-2xl mx-auto">
                <Image
                  src="/fonts/Frame.jpeg"
                  alt="Fedjost Ayomide"
                  width={500}
                  height={500}
                  className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                />
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-6">Technical Skills</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              I specialize in modern web technologies and continuously expand my
              skillset to stay current with industry trends.
            </p>
            <Button asChild>
              <Link href="/projects">View Projects</Link>
            </Button>
          </div>

          {/* Right Side: Chart */}
          <TechStackChart />
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <Timeline />
        </div>
      </section>
    </div>
  );
}
