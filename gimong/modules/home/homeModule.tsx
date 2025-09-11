"use client";

import Hero from "./components/homeHero";
import WelcomeSection from "./components/welcomeSection";
import GospelSection from "./components/gospelSection";

export default function HomeModule() {
  return (
    <main className="w-full">
      <Hero />
      <WelcomeSection />
      <GospelSection />
    </main>
  );
}
