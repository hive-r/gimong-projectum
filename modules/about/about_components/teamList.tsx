"use client";

import ProfileCard from "@/modules/about/about_components/common/profileCard";
import SectionHeader from "@/modules/components/sectionHeader";

const team = [
  {
    imageUrl: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg", 
    name: "Chairman: Robert P.",
    role: "Praise and Worhip Ministry",
  },
  {
    imageUrl: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg", 
    name: "Chairman: Iverson S.",
    role: "Media Ministry",
  },
  {
    imageUrl: "https://images.pexels.com/photos/1647116/pexels-photo-1647116.jpeg",
    name: "Chairman: Shane S.",
    role: "Finance Ministry",
  },
  {
    imageUrl: "https://images.pexels.com/photos/3184613/pexels-photo-3184613.jpeg", 
    name: "Chairman: Jeannette P.",
    role: "Sunday School Ministry",
  },
  {
    imageUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg", 
    name: "Chairman: Frenilyn C.",
    role: "Visitation Ministry",
  },
  {
    imageUrl: "https://images.pexels.com/photos/5926382/pexels-photo-5926382.jpeg", 
    name: "Chairman: Johnelle A.",
    role: "Maintenance Ministry",
  },
];

export default function TeamList() {
  return (
    <section className="py-20 px-6 md:px-12 lg:px-20 bg-linear-to-b from-teal-50 via-white to-teal-50">
      <SectionHeader
        subtitle="Our Team"
        title="Meet the Ministry Team"
        align="center"
      />

      <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
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
