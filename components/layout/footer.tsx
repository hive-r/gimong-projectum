"use client";

import { useState } from "react";
import Link from "next/link";
import { Facebook, Youtube, Mail, MapPin, X } from "lucide-react";

export default function Footer() {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  return (
    <footer className="relative w-full bg-linear-to-br from-gray-50 via-gray-100 to-gray-200 border-t border-gray-300 text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1 — Church Info */}
          <div className="space-y-5">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-snug">
              La Trinidad <br />
              <span className="text-teal-700">Community of Believers</span>
            </h2>
            <p className="text-base text-gray-600 leading-relaxed max-w-sm">
              A Christ-centered family growing in faith, hope, and love. Join us
              as we serve God and our community together.
            </p>

            {/* Address */}
            <a
              href="https://www.google.com/maps/place/LTCB+Center,+Palmaville,+La+Trinidad,+Benguet"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 text-gray-700 hover:text-teal-700 transition-all"
            >
              <div className="flex items-center justify-center w-9 h-9 bg-white rounded-full shadow-sm group-hover:shadow-md transition">
                <MapPin className="w-5 h-5 text-gray-800 group-hover:text-teal-700" />
              </div>
              <span className="max-w-xs text-sm sm:text-base leading-relaxed group-hover:underline underline-offset-4">
                LTCB Center, Palmaville Subdivision, La Trinidad, Benguet
              </span>
            </a>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-5 uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-3 text-base">
              {[
                { href: "/about", label: "About Us" },
                { href: "/announcements", label: "Announcements" },
                { href: "/resources", label: "Resources" },
                { href: "/contact", label: "Contact Us" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center gap-2 text-gray-700 hover:text-teal-700 transition-all"
                  >
                    <div className="w-1 h-1 rounded-full bg-gray-400 group-hover:bg-teal-600 transition" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Connect With Us */}
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-5 uppercase tracking-wide">
              Connect With Us
            </h3>
            <div className="flex flex-col gap-4 text-base">
              {[
                {
                  href: "https://www.facebook.com/ltcbph/",
                  icon: Facebook,
                  label: "Facebook",
                  hover: "hover:text-blue-600 hover:bg-blue-100",
                },
                {
                  href: "https://youtube.com",
                  icon: Youtube,
                  label: "YouTube",
                  hover: "hover:text-red-600 hover:bg-red-100",
                },
                {
                  href: "mailto:contact.gimong@gmail.com",
                  icon: Mail,
                  label: "contact.gimong@gmail.com",
                  hover: "hover:text-yellow-600 hover:bg-rose-100",
                },
              ].map(({ href, icon: Icon, label, hover }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 p-2 rounded-lg text-gray-700 transition-all duration-300 ${hover}`}
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{label}</span>
                </a>
              ))}

              <Link
                href="/login"
                className="inline-block mt-3 px-6 py-2.5 rounded-full bg-teal-700 text-white font-medium text-sm sm:text-base hover:bg-teal-800 shadow-md hover:shadow-lg transition-all"
              >
                Login
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-14 mb-6 h-px bg-linear-to-r from-transparent via-gray-300 to-transparent" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left text-sm text-gray-600 gap-2">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-gray-900">
              La Trinidad Community of Believers
            </span>{" "}
            | <span className="italic text-teal-700">GIMONG</span>
          </p>
          <p className="text-xs sm:text-sm">
            Built with Love for His Glory |{" "}
            <button
              onClick={() => setIsPrivacyOpen(true)}
              className="hover:text-teal-700 underline underline-offset-4"
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 sm:p-8 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsPrivacyOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h2>

            <div className="text-gray-700 text-sm sm:text-base leading-relaxed space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <p>
                We value your privacy. This website collects minimal data to
                ensure your best experience. Information such as contact forms
                or submissions are securely stored and never shared without your
                consent.
              </p>
              <p>
                By using this website, you consent to our privacy practices,
                which include basic analytics, user interaction improvements,
                and protection of all provided data.
              </p>
              <p>
                For any data-related inquiries, please contact us at{" "}
                <a
                  href="mailto:contact.gimong@gmail.com"
                  className="text-teal-600 hover:underline"
                >
                  contact.gimong@gmail.com
                </a>
                .
              </p>
              <p>
                Last updated: <strong>October 2025</strong>
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsPrivacyOpen(false)}
                className="px-5 py-2 rounded-full bg-teal-700 text-white font-medium hover:bg-teal-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
