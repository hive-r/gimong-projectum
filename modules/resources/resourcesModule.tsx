"use client";

import { SermonDevotionalCardPublic } from "@/features/inventory_management/components/cardPublic";
import ResourcesHero from "./resources_components/resourcesHero";

export default function ResourcesModule() {
  return (
    <main className="w-full">
        <ResourcesHero />
        <SermonDevotionalCardPublic />
    </main>
  );
}
