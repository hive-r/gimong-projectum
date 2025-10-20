"use client";

import React, { useEffect, useState } from "react";
import { AppWindowIcon, CalendarDaysIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { listenToAnnouncements, listenToEvents } from "../service";
import { AnnouncementRecord } from "../types/announcement";
import { EventRecord } from "../types/event";
import { AnnouncementCard } from "./announcementCard";
import { EventCard } from "./eventCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export const AnnouncementEventCard: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);

  // 🔹 Real-time announcements
  useEffect(() => {
    const unsubscribe = listenToAnnouncements(setAnnouncements);
    return () => unsubscribe();
  }, []);

  // 🔹 Real-time events
  useEffect(() => {
    const unsubscribe = listenToEvents(setEvents);
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Announcements & Events Cards
      </h1>

      <div className="flex w-full max-w-5xl mx-auto flex-col gap-6">
        <Tabs defaultValue="announcement" className="w-full">
          {/* Tab Headers */}
          <TabsList className="grid w-full grid-cols-2 bg-primary">
            <TabsTrigger value="announcement" className="flex items-center gap-2 text-gray-700">
              <AppWindowIcon className="h-4 w-4" />
              Announcement
            </TabsTrigger>
            <TabsTrigger value="event" className="flex items-center gap-2 text-gray-700">
              <CalendarDaysIcon className="h-4 w-4" />
              Event
            </TabsTrigger>
          </TabsList>

          {/* Announcements */}
          <TabsContent value="announcement">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">Announcements</CardTitle>
                <CardDescription className="text-lg">Available announcements.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {announcements.filter((a) => !a.isArchived).length > 0 ? (
                    announcements
                      .filter((a) => !a.isArchived) // 👈 filter here
                      .map((a) => (
                        <AnnouncementCard key={a.id} announcement={a} />
                      ))
                  ) : (
                    <p className="text-center text-gray-500 mt-4">
                      No announcements yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events */}
          <TabsContent value="event">
            <Card>
              <CardHeader>
                <CardTitle>Events</CardTitle>
                <CardDescription>Available events.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {events.filter((e) => !e.isArchived).length > 0 ? (
                    events
                      .filter((e) => !e.isArchived) // 👈 filter here
                      .map((e) => <EventCard key={e.id} event={e} />)
                  ) : (
                    <p className="text-center text-gray-500 mt-4">
                      No events yet.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
