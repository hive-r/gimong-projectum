"use client";

import Image from "next/image";
import SectionHeader from "@/modules/components/sectionHeader";

const values = [
  {
    title: "Faith",
    description: "We live by faith, trusting God’s Word in all we do.",
    image: "https://images.pexels.com/photos/699498/pexels-photo-699498.jpeg",
  },
  {
    title: "Community",
    description:
      "We grow together in love, encouraging and supporting one another.",
    image: "https://images.pexels.com/photos/745045/pexels-photo-745045.jpeg",
  },
  {
    title: "Service",
    description: "We serve with humility, using our gifts to bless others.",
    image: "https://images.pexels.com/photos/699498/pexels-photo-699498.jpeg",
  },
  {
    title: "Integrity",
    description:
      "We walk in truth and integrity, reflecting Christ in our lives.",
    image: "https://images.pexels.com/photos/1812523/pexels-photo-1812523.jpeg",
  },
];

export default function CoreValues() {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-20">
      {/* Section Header */}
      <SectionHeader subtitle="Core Values" title="What We Stand For" />

      <div className="grid gap-12 max-w-5xl mx-auto">
        {values.map((value, i) => (
          <div
            key={i}
            className={`grid md:grid-cols-2 items-center gap-8 ${
              i % 2 === 1 ? "md:grid-flow-col-dense" : ""
            }`}
          >
            {/* Text */}
            <div className={`${i % 2 === 1 ? "md:col-start-2" : ""}`}>
              <h3 className="text-xl font-bold text-primary">{value.title}</h3>
              <p className="mt-2 text-gray-700 leading-relaxed">
                {value.description}
              </p>
            </div>

            {/* Image */}
            <div className="relative w-full h-56 md:h-64">
              <Image
                src={value.image}
                alt={value.title}
                fill
                className="rounded-xl object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
