"use client";

import ProfileCard from "@/modules/about/about_components/common/profileCard";
import SectionHeader from "@/modules/components/sectionHeader";

const elders = [
  {
    imageUrl: "/images/elders/elder1.jpg",
    name: "John Doe",
    role: "Senior Pastor",
  },
  {
    imageUrl: "/images/elders/elder2.jpg",
    name: "Jane Smith",
    role: "Church Elder",
  },
  {
    imageUrl: "/images/elders/elder3.jpg",
    name: "Mark Johnson",
    role: "Worship Leader",
  },
];

export default function EldersList() {
  return (
    <section className="py-16 px-6 md:px-12 lg:px-20 bg-gray-50">
      {/* Section header */}
      <SectionHeader
        subtitle="Church Elders"
        title="Meet Our Elders"
        align="center"
      />

      {/* Elder cards */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {elders.map((elder, i) => (
          <ProfileCard
            key={i}
            imageUrl={elder.imageUrl}
            name={elder.name}
            role={elder.role}
          />
        ))}
      </div>
    </section>
  );
}
