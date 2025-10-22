"use client";

import React, { useEffect, useState, useMemo } from "react";
import { CalendarDaysIcon, AppWindowIcon } from "lucide-react";
import { listenToAnnouncements, listenToEvents } from "../service";
import { AnnouncementRecord } from "../types/announcement";
import { EventRecord } from "../types/event";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { computeEventStatus } from "../utils/computeEventStatus";
import Image from "next/image";

export const IsPinnedCard: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);

  useEffect(() => {
    const unsubscribeAnnouncements = listenToAnnouncements(setAnnouncements);
    const unsubscribeEvents = listenToEvents(setEvents);
    return () => {
      unsubscribeAnnouncements();
      unsubscribeEvents();
    };
  }, []);

  const pinnedRecord = useMemo(() => {
    const pinnedAnnouncement = announcements.find((a) => a.isPinned);
    const pinnedEvent = events.find((e) => e.isPinned);
    if (pinnedEvent) return pinnedEvent;
    if (pinnedAnnouncement) return pinnedAnnouncement;
    return null;
  }, [announcements, events]);

  if (!pinnedRecord) {
    return (
      <div className="flex justify-center items-center w-full my-6">
        <Card className="w-full max-w-3xl text-center hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-gray-500">
            No pinned announcement or event.
          </CardContent>
        </Card>
      </div>
    );
  }

  // 🔹 Event
  if (pinnedRecord.type === "event") {
    const status = computeEventStatus(
      pinnedRecord.startDate,
      pinnedRecord.startTime,
      pinnedRecord.endDate,
      pinnedRecord.endTime
    );

    return (
      <div className="flex justify-center items-center w-full my-6">
        <Card className="w-full max-w-7xl overflow-hidden shadow-md rounded-none">
          <CardContent className="flex flex-col justify-center items-center p-6 text-center gap-2 group">
            {/* Status */}
            <div className="text-xl text-primary uppercase">{status}</div>

            {/* Title */}
            <CardTitle className="text-5xl uppercase group-hover:text-primary transition-colors duration-300">
              {pinnedRecord.title}
            </CardTitle>

            {/* Date/Time */}
            <CardDescription className="text-lg flex items-center gap-2 justify-center">
              <CalendarDaysIcon className="h-6 w-6" />
              {new Date(pinnedRecord.startDate).toLocaleDateString()}{" "}
              {pinnedRecord.startTime ? `at ${pinnedRecord.startTime}` : ""}
            </CardDescription>

            {/* Description */}
            <CardDescription className="text-lg max-w-3xl text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
              {pinnedRecord.description}
            </CardDescription>

            {/* Image with zoom on hover */}
            <div className="w-full max-h-[550px] aspect-video overflow-hidden rounded-md relative">
              {pinnedRecord.imageUrl ? (
                <div className="overflow-hidden rounded-md relative">
                  <Image
                    src={pinnedRecord.imageUrl}
                    alt={pinnedRecord.title}
                    width={1600}
                    height={900}
                    className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                    priority={true}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center border border-dashed text-gray-400">
                  No Image
                </div>
              )}
            </div>

          </CardContent>
        </Card>
      </div>
    );
  }

  // 🔹 Announcement
  if (pinnedRecord.type === "announcement") {
    return (
      <div className="flex justify-center items-center w-full my-6">
        <Card className="w-full max-w-7xl overflow-hidden shadow-md rounded-none transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
          <CardContent className="flex flex-col justify-center items-center p-6 text-center gap-3 group">
            {/* Status */}
            <div className="text-xl text-primary uppercase">ANNOUNCEMENT</div>

            {/* Title */}
            <CardTitle className="text-7xl flex items-center gap-2 justify-center uppercase transition-colors duration-300 group-hover:text-primary">
              <AppWindowIcon className="h-6 w-6 text-gray-500" />
              {pinnedRecord.title}
            </CardTitle>

            {/* Description */}
            <CardDescription className="text-lg max-w-3xl text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
              {pinnedRecord.description}
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};
