"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  return (
    <header className="w-full border-b bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          GIMONG
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-gray-700 hover:text-gray-900">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-gray-900">
            About
          </Link>
          <Link href="/announcements" className="text-gray-700 hover:text-gray-900">
            Announcements
          </Link>
          <Link href="/resources" className="text-gray-700 hover:text-gray-900">
            Resources
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-gray-900">
            Contact
          </Link>
        </nav>

        {/* CTA Button */}
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </header>
  )
}
