"use client";

import Hero from "@/modules/components/hero";

export default function AboutHero() {
  return (
    <Hero
      title="About Us"
      subtitle="Learn more about our church"
      imageUrl="https://fra.cloud.appwrite.io/v1/storage/buckets/68ee4f3700317e582588/files/68f87f530014d33cd750/view?project=68ee4e2700281ded4a2b&mode=admin"
      height="h-[50vh]"
      overlayOpacity="bg-black/15"
      align="center"
    />
  );
}
