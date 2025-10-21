"use client";

import Hero from "./components/homeHero";
import WelcomeSection from "./components/welcomeSection";
import GospelSection from "./components/gospelSection";
import { IsPinnedCard } from "@/features/announcements_and_events_record_management/components/isPinnedCard";

export default function HomeModule() {
  return (
    <main className="w-full">
      <Hero />
      <WelcomeSection />
      <IsPinnedCard />
      <GospelSection />
    </main>
  );
}
