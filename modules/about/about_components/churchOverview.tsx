"use client";

import Image from "next/image";
import SectionHeader from "@/modules/components/sectionHeader";

export default function ChurchOverview() {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-20 text-center bg-linear-to-b from-white to-teal-50">
      {/* Section Header */}
      <SectionHeader
        subtitle="Who We Are"
        title="A Family of Faith, Hope, and Love"
        align="center"
      />

      {/* Description */}
      <p className="mt-6 max-w-4xl mx-auto text-gray-700 text-lg md:text-xl leading-relaxed">
        We are a Christ-centered community dedicated to living out the gospel in
        every part of our lives. Here, you’ll find people from all walks of life
        growing together in{" "}
        <span className="font-semibold text-primary">faith</span>,{" "}
        <span className="font-semibold text-primary">hope</span>, and{" "}
        <span className="font-semibold text-primary">love</span> — encouraging
        one another, serving our community, and sharing the message of Jesus
        with the world.
      </p>

      {/* Images Row */}
      <div className="mt-16 flex flex-col md:flex-row justify-center items-center gap-4 max-w-5xl mx-auto">
        {/* Image 1 */}
        <div className="group relative w-full md:w-1/3 h-64 md:h-94 overflow-hidden shadow-sm hover:shadow-md transition-all">
          <Image
            src="https://images.pexels.com/photos/3633711/pexels-photo-3633711.jpeg"
            alt="Worship"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg font-semibold drop-shadow-lg">
            Worship Together
          </p>
        </div>

        {/* Image 2 (Taller, Centered Vertically) */}
        <div className="group relative w-full md:w-1/3 h-80 md:h-112 overflow-hidden shadow-md hover:shadow-lg transition-all flex items-center justify-center">
          <Image
            src="https://images.pexels.com/photos/1848731/pexels-photo-1848731.jpeg"
            alt="Community"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg font-semibold drop-shadow-lg">
            Build Relationships
          </p>
        </div>

        {/* Image 3 */}
        <div className="group relative w-full md:w-1/3 h-64 md:h-94 overflow-hidden shadow-sm hover:shadow-md transition-all">
          <Image
            src="https://images.pexels.com/photos/1771218/pexels-photo-1771218.jpeg"
            alt="Prayer"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg font-semibold drop-shadow-lg">
            Pray Together
          </p>
        </div>
      </div>
    </section>
  );
}
