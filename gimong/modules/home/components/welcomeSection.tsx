"use client";

import Link from "next/link";
import { Church, MapPin, Users } from "lucide-react";
import SectionHeader from "@/modules/components/sectionHeader";

export default function WelcomeSection() {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-20 text-center">
      {/* Section Header */}
      <SectionHeader
        subtitle="Regardless of who you are, you are welcome here"
        title="Growing Together in Faith and Love"
        align="center"
      />

      {/* Cards */}
      <div className="mt-12 grid gap-8 md:grid-cols-3">
        <Link
          href="/sunday-service"
          className="group block rounded-xl border bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
            <Church className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Sunday Service</h3>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed border-b pb-3">
            Join us every Sunday to worship, learn, and grow together as a family of believers.
          </p>
        </Link>

        <Link
          href="/location"
          className="group block rounded-xl border bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
            <MapPin className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Where are we?</h3>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed border-b pb-3">
            Find our church location and directions so you can easily join us in fellowship.
          </p>
        </Link>

        <Link
          href="/about"
          className="group block rounded-xl border bg-white p-6 sm:p-8 shadow-sm hover:shadow-md transition-all text-left"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Who are we?</h3>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed border-b pb-3">
            Learn more about our mission, vision, and the community that makes us who we are.
          </p>
        </Link>
      </div>
    </section>
  );
}
