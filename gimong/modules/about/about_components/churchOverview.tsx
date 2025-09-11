"use client";

import Image from "next/image";
import SectionHeader from "@/modules/components/sectionHeader";

export default function ChurchOverview() {
  return (
    <section className="py-16 px-6 md:px-12 lg:px-20 text-center">
      {/* Reusable Section Header */}
      <SectionHeader
        subtitle="Who We Are"
        title="A Family of Faith, Hope, and Love"
        align="center"
      />

      {/* Description */}
      <p className="mt-4 max-w-3xl mx-auto text-gray-700 leading-relaxed">
        Our church is more than a place of worship—it’s a community where people
        grow in faith, build lasting relationships, and serve others with love.
        Together, we are committed to spreading the message of Jesus Christ and
        making a difference in the world around us.
      </p>

      {/* Images */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div className="relative w-full h-64">
          <Image
            src="https://images.pexels.com/photos/1791624/pexels-photo-1791624.jpeg"
            alt="Worship"
            fill
            className="rounded-xl object-cover"
          />
        </div>
        <div className="relative w-full h-64">
          <Image
            src="https://images.pexels.com/photos/846847/pexels-photo-846847.jpeg"
            alt="Community"
            fill
            className="rounded-xl object-cover"
          />
        </div>
        <div className="relative w-full h-64">
          <Image
            src="https://images.pexels.com/photos/949194/pexels-photo-949194.jpeg"
            alt="Prayer"
            fill
            className="rounded-xl object-cover"
          />
        </div>
      </div>
    </section>
  );
}
