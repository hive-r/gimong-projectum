"use client";

import Link from "next/link";
import { Church, MapPin, Users } from "lucide-react";
import SectionHeader from "@/modules/components/sectionHeader";

const cards = [
  {
    href: "/announcements",
    icon: Church,
    title: "Sunday Service",
    description:
      "Join us every Sunday for worship, fellowship, and encouragement. Experience heartfelt praise, inspiring sermons, and a welcoming community of believers.",
  },
  {
    href: "/contact",
    icon: MapPin,
    title: "Where Are We?",
    description:
      "Located in the heart of the community, our church is easy to find and always open to all. Come as you are — we can’t wait to meet you!",
  },
  {
    href: "/about",
    icon: Users,
    title: "Who Are We?",
    description:
      "We are a Christ-centered family dedicated to sharing God’s love, serving others, and growing in faith together through His Word.",
  },
];

export default function WelcomeSection() {
  return (
    <section className="relative py-24 px-6 md:px-12 lg:px-20 bg-linear-to-b from-white via-gray-50 to-teal-50 overflow-hidden">
      {/* Soft Decorative Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-70 pointer-events-none" />

      {/* Section Header */}
      <div className="relative mb-16">
        <SectionHeader
          subtitle="Regardless of who you are, you are welcome here"
          title="Growing Together in Faith and Love"
          align="center"
        />
      </div>

      {/* Cards */}
      <div className="relative grid gap-10 md:grid-cols-3 max-w-7xl mx-auto">
        {cards.map(({ href, icon: Icon, title, description }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col items-center text-center bg-white rounded-none shadow-md border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-10"
          >
            <div className="flex items-center justify-center w-16 h-16 mt-4 rounded-full bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
              <Icon className="h-8 w-8" />
            </div>
            <h3 className="text-3xl uppercase font-bold text-gray-900 mb-4">
              {title}
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              {description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
