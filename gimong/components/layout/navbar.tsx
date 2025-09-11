"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full border-b bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 h-16">
        {/* Logo */}
        <Link href="/" className="flex flex-col justify-center leading-tight">
          <span className="text-sm font-bold leading-none">LA TRINIDAD</span>
          <span className="text-sm font-bold leading-none">COMMUNITY</span>
          <span className="text-sm font-bold leading-none">OF BELIEVERS</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-8">
          <Link
            href="/"
            className="text-gray-700 font-medium hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/pages/about_page"
            className="text-gray-700 font-medium hover:text-primary transition-colors"
          >
            About
          </Link>
          <Link
            href="/pages/announcements_page"
            className="text-gray-700 font-medium hover:text-primary transition-colors"
          >
            Announcements
          </Link>
          <Link
            href="/pages/resources_page"
            className="text-gray-700 font-medium hover:text-primary transition-colors"
          >
            Resources
          </Link>
        </nav>

        {/* Contact Button */}
        <Button asChild className="ml-4">
          <Link href="/pages/contact_page">Contact Us</Link>
        </Button>
      </div>
    </header>
  )
}
