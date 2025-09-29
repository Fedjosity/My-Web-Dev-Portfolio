"use client";

import { Hero3D } from "@/components/hero-3d";
import { GitHubStats } from "@/components/github-stats";
import { TechStackChart } from "@/components/tech-stack-chart";
import { Timeline } from "@/components/timeline";
import { Button } from "@/components/ui/button";
import { ArrowDown, Download, Github, Linkedin, Mail } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FaWhatsapp } from "react-icons/fa";
import { motion, Variants } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

// Reusable variants
const sectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const childVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export default function Home() {
  const greetings = useMemo(
    () => [
      "Hi",
      "Hola",
      "Bonjour",
      "Hallo",
      "Ciao",
      "Olá",
      "Namaste",
      "Konnichiwa",
      "Salaam",
      "Sannu",
    ],
    []
  );

  const [greetIndex, setGreetIndex] = useState(0);
  const [display, setDisplay] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [holding, setHolding] = useState(false);

  useEffect(() => {
    const current = greetings[greetIndex % greetings.length];
    const isComplete = display === current;
    const isEmpty = display === "";

    let stepDelay = 90;
    if (!deleting && isComplete && holding) stepDelay = 3000; // hold full word
    if (deleting) stepDelay = 45; // delete faster

    const t = setTimeout(() => {
      if (!deleting) {
        // if finished typing current word
        if (display === current) {
          if (!holding) {
            setHolding(true); // start hold period
          } else {
            setHolding(false);
            setDeleting(true); // end hold, start deleting
          }
          return;
        }
        // typing next character
        const next = current.slice(0, display.length + 1);
        setDisplay(next);
      } else {
        // deleting
        const next = current.slice(0, display.length - 1);
        setDisplay(next);
        if (next === "") {
          setDeleting(false);
          setGreetIndex((i) => (i + 1) % greetings.length);
        }
      }
    }, stepDelay);

    return () => clearTimeout(t);
  }, [display, deleting, greetIndex, greetings, holding]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-green-500/5 to-purple-500/5" />

        {/* 3D Background */}
        <div className="absolute inset-0 opacity-30">
          <Hero3D />
        </div>

        <motion.div
          className="relative z-10 container mx-auto px-4 text-center"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            variants={childVariants}
          >
            <span className="bg-gradient-to-r from-blue-500 via-green-500 to-blue-500 bg-clip-text text-transparent">{display}</span>
            <span className="ml-1 inline-block w-[1ch] animate-pulse">|</span>
            <span className="">, I’m</span>{" "}
            <span className=" bg-clip-text ">
              Fedjost Ayomide
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground mb-8"
            variants={childVariants}
          >
            I build web things end‑to‑end—fast, accessible, and a little bit fun.
          </motion.p>

          <motion.p
            className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto"
            variants={childVariants}
          >
            Right now I’m shipping delightful experiences with Next.js, TypeScript, and a splash of 3D. If you like crisp UI and clean DX, we’ll get along.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            variants={childVariants}
          >
            <Button size="lg" className="group" asChild>
              <Link href="/projects">
                View My Work
                <ArrowDown className="ml-2 h-4 w-4 group-hover:translate-y-1 transition-transform" />
              </Link>
            </Button>

            <Button size="lg" variant="outline" className="group" asChild>
              <a href="fonts/Fedjost Ayomide Web Dev CV (2).pdf" download>
                <Download className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Download CV
              </a>
            </Button>
          </motion.div>

          <motion.div
            className="flex justify-center gap-6"
            variants={childVariants}
          >
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
          </motion.div>
        </motion.div>
      </section>

      {/* GitHub Stats Section */}
      <motion.section
        className="py-20 bg-muted/20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <motion.div
          className="container mx-auto px-4 text-center mb-12"
          variants={childVariants}
        >
          <h2 className="text-3xl font-bold mb-4">GitHub Activity</h2>
          <p className="text-muted-foreground">
            Live stats from my GitHub profile
          </p>
        </motion.div>

        <motion.div className="container mx-auto px-4" variants={childVariants}>
          <GitHubStats />
        </motion.div>
      </motion.section>

      {/* Technical Skills Section */}
      <motion.section
        className="py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <div className="container mx-auto px-4 flex flex-col md:flex-row gap-12 items-center">
          {/* Left Side */}
          <motion.div variants={childVariants}>
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

            <h2 className="text-3xl font-bold mb-6">Full‑Stack Tech Stack</h2>
            <p className="text-muted-foreground mb-8 text-lg">
            I specialize in modern web technologies and continuously expand my
            skillset to stay current with industry trends.
            </p>
            <Button asChild>
              <Link href="/projects">View Projects</Link>
            </Button>
          </motion.div>

          {/* Right Side: Chart */}
          <motion.div variants={childVariants} className="px-4">
            <TechStackChart />
          </motion.div>
      </div>
      </motion.section>

      

      {/* Timeline Section */}
      <motion.section
        className="py-20 bg-muted/20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <motion.div className="container mx-auto px-4" variants={childVariants}>
          <Timeline />
        </motion.div>
      </motion.section>
    </div>
  );
}
