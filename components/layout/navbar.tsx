"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "HOME" },
    { href: "/about", label: "ABOUT" },
    { href: "/announcements", label: "ANNOUNCEMENTS" },
    { href: "/resources", label: "RESOURCES" },
    { href: "/finance", label: "FINANCE" },
  ];

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-all duration-500 ${
        scrolled ? "bg-gray-950/95 shadow-md backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 md:px-20 py-3 h-18">
        {/* Logo + Nav Links */}
        <div className="flex items-center">
          <Link href="/" className="flex flex-col justify-center leading-tight">
            <span className="text-sm font-bold text-white leading-none">
              LA TRINIDAD
            </span>
            <span className="text-sm font-bold text-white leading-none">
              COMMUNITY
            </span>
            <span className="text-sm font-bold text-white leading-none">
              OF BELIEVERS
            </span>
          </Link>

          {/* Divider (hidden on mobile) */}
          <div className="hidden md:block mx-8 md:mx-16 h-12 border-l border-gray-500/60" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 text-md">
            {navLinks.map(({ href, label }) => {
              const isActive =
                href === "/" ? pathname === href : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  className={`relative font-medium transition-all duration-300 ${
                    isActive
                      ? "text-primary"
                      : "text-gray-300 hover:text-primary"
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary rounded-full transition-all duration-300" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Contact Button (Desktop only) */}
        <div className="hidden md:block">
          <Button
            asChild
            className="ml-4 bg-primary hover:bg-primary/90 text-white rounded-full px-5 py-2"
          >
            <Link href="/contact">CONTACT US</Link>
          </Button>
        </div>

        {/* Hamburger Menu (Mobile only) */}
        <button
          className="md:hidden text-white ml-4"
          onClick={toggleMenu}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-950/95 backdrop-blur-md border-t border-gray-800">
          <nav className="flex flex-col items-center gap-6 py-6">
            {navLinks.map(({ href, label }) => {
              const isActive =
                href === "/" ? pathname === href : pathname.startsWith(href);

              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-lg font-medium transition-all duration-300 ${
                    isActive
                      ? "text-primary"
                      : "text-gray-300 hover:text-primary"
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2 mt-2"
            >
              <Link href="/contact" onClick={() => setMenuOpen(false)}>
                CONTACT US
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
