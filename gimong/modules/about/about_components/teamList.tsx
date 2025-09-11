"use client";

import ProfileCard from "@/modules/about/about_components/common/profileCard";
import SectionHeader from "@/modules/components/sectionHeader";

const team = [
  {
    imageUrl: "/images/team/member1.jpg",
    name: "Sarah Williams",
    role: "Children’s Ministry Leader",
  },
  {
    imageUrl: "/images/team/member2.jpg",
    name: "David Brown",
    role: "Youth Pastor",
  },
  {
    imageUrl: "/images/team/member3.jpg",
    name: "Emily Davis",
    role: "Choir Director",
  },
  {
    imageUrl: "/images/team/member4.jpg",
    name: "Michael Lee",
    role: "Outreach Coordinator",
  },
  {
    imageUrl: "/images/team/member5.jpg",
    name: "Rachel Green",
    role: "Hospitality Ministry",
  },
  {
    imageUrl: "/images/team/member6.jpg",
    name: "James Wilson",
    role: "Technical Director",
  },
];

export default function TeamList() {
  return (
    <section className="py-16 px-6 md:px-12 lg:px-20">
      {/* Section header */}
      <SectionHeader
        subtitle="Our Team"
        title="Meet the Ministry Team"
        align="center"
      />

      {/* Team cards */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {team.map((member, i) => (
          <ProfileCard
            key={i}
            imageUrl={member.imageUrl}
            name={member.name}
            role={member.role}
          />
        ))}
      </div>
    </section>
  );
}
