"use client";

import { AnnouncementCard } from "./announcementCard";
import { EventRecord } from "@/features/announcements_record_management/types";

interface AnnouncementsListProps {
  announcements: EventRecord[];
}

export function AnnouncementsList({ announcements }: AnnouncementsListProps) {
  if (!announcements.length) {
    return (
      <p className="text-center text-gray-500 text-sm">
        No announcements available.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {announcements.map((announcement) => (
        <AnnouncementCard key={announcement.id} announcement={announcement} />
      ))}
    </div>
  );
}
