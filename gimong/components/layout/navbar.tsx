"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full transition-colors duration-500 ${scrolled ? "bg-gray-950 shadow-md" : "bg-transparent"
        }`}
    >
      <div className="container mx-auto flex items-center justify-between px-20 py-3 h-18">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex flex-col justify-center leading-tight">
            <span className="text-sm font-bold leading-none text-white">LA TRINIDAD</span>
            <span className="text-sm font-bold leading-none text-white">COMMUNITY</span>
            <span className="text-sm font-bold leading-none text-white">OF BELIEVERS</span>
          </Link>

          <div className="mx-16 h-16 border-l border-gray-500/60" />

          {/* Nav Links */}
          <nav className="hidden md:flex gap-10 text-md">
            {[
              { href: "/", label: "HOME" },
              { href: "/about", label: "ABOUT" },
              { href: "/announcements", label: "ANNOUNCEMENTS" },
              { href: "/resources", label: "RESOURCES" },
              { href: "/finance", label: "FINANCE"}
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-gray-300 font-medium hover:text-primary transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact Button */}
        <Button asChild className="ml-4 bg-primary hover:bg-primary/90 text-white">
          <Link href="/contact">CONTACT US</Link>
        </Button>
      </div>
    </header>
  )
}