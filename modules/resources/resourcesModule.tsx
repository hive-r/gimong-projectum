"use client";

import { SermonDevotionalCardPublic } from "@/features/inventory_management/components/cardPublic";
import ResourcesHero from "./resources_components/resourcesHero";
import { IsDisplayCard } from "@/features/livestream_management/components/isDisplayed";

export default function ResourcesModule() {
  return (
    <main className="w-full">
        <ResourcesHero />
        <IsDisplayCard />   
        <SermonDevotionalCardPublic />
    </main>
  );
}
