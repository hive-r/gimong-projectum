"use client";

import { AnnouncementEventStatistics } from "./components/announcementEventStatistics";
import { AnnouncementEventCard } from "./components/card";
import { AnnouncementEventForm } from "./components/form";
import { IsPinnedCard } from "./components/isPinnedCard";
import { AnnouncementEventList } from "./components/listAnnouncementEvent";

export const AnnouncementEventPage: React.FC = () => {
  return (
    <main className="w-full">
      <AnnouncementEventForm />
      <AnnouncementEventCard />
      <IsPinnedCard />
      <AnnouncementEventList />
      <AnnouncementEventStatistics />
    </main>
  );
};
