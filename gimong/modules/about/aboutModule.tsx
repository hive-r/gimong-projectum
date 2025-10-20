"use client";

import AboutHero from "./about_components/common/aboutHero";
import ChurchOverview from "./about_components/churchOverview";
import VisionMission from "./about_components/visionMission";
import CoreValues from "./about_components/coreValues";
import Location from "./about_components/location";   
import EldersList from "./about_components/elderList";
import TeamList from "./about_components/teamList";

export default function AboutModule() {
  return (
    <main className="w-full">
      <AboutHero />
      <ChurchOverview />
      <VisionMission />
      <CoreValues />
      <Location />
      <EldersList />
      <TeamList />
    </main>
  );
}
