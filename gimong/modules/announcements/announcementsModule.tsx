"use client";

import { IsPinnedCard } from "@/features/announcements_and_events_record_management/components/isPinnedCard";
import AnnouncementsHero from "./announcements_components/announcementsHero";
import { AnnouncementEventCardPublic } from "@/features/announcements_and_events_record_management/components/cardPublic";

export default function AboutModule() {
  return (
    <main className="w-full">
        <AnnouncementsHero />
        <IsPinnedCard />
        <AnnouncementEventCardPublic />
    </main>
  );
}
