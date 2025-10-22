import Link from "next/link";
import { Facebook, Youtube, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative w-full bg-linear-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-8 text-sm text-gray-600">
        {/* Left Text */}
        <p className="text-center md:text-left font-medium text-gray-700">
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-gray-900">
            LA TRINIDAD COMMUNITY OF BELIEVERS
          </span>{" "}
          | <span className="italic">GIMONG</span> — All rights reserved.
        </p>

        {/* Socials + Login */}
        <div className="flex items-center gap-6 mt-4 md:mt-0">
          <a
            href="https://www.facebook.com/ltcbph/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Facebook className="w-5 h-5" />
            <span className="hidden sm:inline">Facebook</span>
          </a>

          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <Youtube className="w-5 h-5" />
            <span className="hidden sm:inline">YouTube</span>
          </a>

          <a
            href="https://mail.google.com/"
            className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors"
          >
            <Mail className="w-5 h-5" />
            <span className="hidden sm:inline">Gmail</span>
          </a>

          <Link
            href="/login"
            className="ml-2 px-4 py-1.5 rounded-full bg-gray-800 text-white text-sm font-medium hover:bg-gray-900 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
