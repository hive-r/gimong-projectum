"use client";

import ProfileCard from "@/modules/about/about_components/common/profileCard";
import SectionHeader from "@/modules/components/sectionHeader";

const elders = [
  {
    imageUrl: "https://images.pexels.com/photos/819530/pexels-photo-819530.jpeg", 
    name: "John Doe",
    role: "Senior Pastor",
  },
  {
    imageUrl: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg", 
    name: "Jane Smith",
    role: "Church Elder",
  },
  {
    imageUrl: "https://images.pexels.com/photos/3756774/pexels-photo-3756774.jpeg", 
    name: "Mark Johnson",
    role: "Worship Leader",
  },
];

export default function EldersList() {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-20 bg-linear-to-b from-white via-teal-50 to-white">
      <SectionHeader
        subtitle="Church Elders"
        title="Meet Our Elders"
        align="center"
      />

      <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
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
