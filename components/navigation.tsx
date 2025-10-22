"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

const navItems = [
  { name: "Home", link: "/" },
  { name: "Projects", link: "/projects" },
  { name: "Blog", link: "/blog" },
  { name: "Contact", link: "/contact" },
];

export function Navigation() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <Link
            href="/"
            className="text-xl font-bold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent"
          >
            &lt;/&gt;
          </Link>

          <NavItems
            items={navItems.map((item) => ({
              name: item.name,
              link: item.link,
            }))}
            onItemClick={() => setIsMobileMenuOpen(false)}
            className="space-x-2"
          />

          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <Link
              href="/"
              className="text-lg font-bold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent"
            >
              &lt;/&gt;
            </Link>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`relative block px-3 py-2 rounded-md ${
                  pathname === item.link
                    ? "text-primary bg-primary/10"
                    : "text-neutral-600 dark:text-neutral-300 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex w-full items-center justify-between mx-4">
              <h1>Theme Toggle</h1>
              <ThemeToggle />
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
