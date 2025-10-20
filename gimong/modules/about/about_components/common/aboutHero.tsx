"use client";

import Hero from "@/modules/components/hero";

export default function AboutHero() {
  return (
    <Hero
      title="About Us"
      subtitle="Learn more about our church"
      imageUrl="https://images.pexels.com/photos/212324/pexels-photo-212324.jpeg"
      height="h-[50vh]"
      overlayOpacity="bg-black/50"
      align="center"
    />
  );
}
