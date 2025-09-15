"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Linkedin, ArrowUpRight } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export function Footer() {
  const year = new Date().getFullYear();

  const links = [
    { href: "https://github.com/fedjosity", label: "GitHub", icon: Github },
    {
      href: "https://www.linkedin.com/in/fedjostayomide",
      label: "LinkedIn",
      icon: Linkedin,
    },
    {
      href: "https://wa.me/2348167568818",
      label: "WhatsApp",
      icon: FaWhatsapp,
    },
  ];

  return (
    <footer className="relative mt-24">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="container mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="grid gap-8 md:grid-cols-2 items-center"
        >
          <div>
            <motion.h3
              className="text-2xl font-bold mb-2"
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Let’s build something great
            </motion.h3>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              I craft modern, accessible web experiences. Get in touch to
              collaborate.
            </motion.p>
          </div>

          <div className="flex flex-wrap gap-3 md:justify-end">
            {links.map((l, i) => (
              <motion.a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  l.href.startsWith("http") ? "noopener noreferrer" : undefined
                }
                className="group inline-flex items-center gap-2 rounded-full border border-primary/30 px-4 py-2 text-sm hover:border-primary hover:bg-primary/10 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
              >
                <l.icon className="h-4 w-4 text-primary" />
                <span>{l.label}</span>
                <ArrowUpRight className="h-4 w-4 opacity-0 -translate-y-0.5 -translate-x-0.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        <div className="mt-10 flex items-center justify-between text-sm text-muted-foreground">
          <span>© {year} Fedjost Ayomide</span>
        </div>
      </div>
    </footer>
  );
}
