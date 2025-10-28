"use client";

import React, { useEffect, useState } from "react";
import { AppWindowIcon, CalendarDaysIcon } from "lucide-react";
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
import SectionHeader from "@/modules/components/sectionHeader";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Image from "next/image";

export const AnnouncementEventCardPublic: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);

  const [selectedRecord, setSelectedRecord] = useState<EventRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<"view" | "edit">("view");

  // 🔹 Real-time listeners
  useEffect(() => {
    const unsubscribe = listenToAnnouncements(setAnnouncements);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = listenToEvents(setEvents);
    return () => unsubscribe();
  }, []);

  // 🔹 Open dialog when user clicks on an event card
  const handleViewEvent = (event: EventRecord) => {
    setSelectedRecord(event);
    setMode("view");
    setDialogOpen(true);
  };

  return (
    <section id="announcements" className="relative py-20 px-6 md:px-12 bg-linear-to-b from-white via-gray-50 to-gray-100 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none"></div>

      {/* Section Header */}
      <div className="relative mb-4 text-center">
        <SectionHeader
          subtitle="Stay Connected"
          title="Announcements & Upcoming Events"
          align="center"
        />
        <p className="text-gray-600 max-w-3xl mx-auto mt-4 leading-relaxed text-lg">
          Discover the latest updates, gatherings, and church happenings. We invite you to stay involved — 
          from uplifting worship services to meaningful community events that strengthen our faith together.
        </p>
      </div>

      <div className="space-y-20 max-w-6xl mx-auto relative z-10">
        {/* Announcements Section */}
        <Card className="overflow-hidden border-0 shadow-xl rounded-none bg-white/90 backdrop-blur-sm transition-transform hover:scale-[1.01] hover:shadow-2xl">
          <CardHeader className="text-center py-10 bg-linear-to-r from-primary/10 to-primary/5 border-b border-gray-200">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <AppWindowIcon className="h-10 w-10 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold uppercase tracking-wide text-gray-900">
              Latest Announcements
            </CardTitle>
            <CardDescription className="mt-2 text-gray-600 text-base">
              Important news, messages, and church-wide updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {announcements.filter((a) => !a.isArchived).length > 0 ? (
                announcements
                  .filter((a) => !a.isArchived)
                  .map((a) => <AnnouncementCard key={a.id} announcement={a} />)
              ) : (
                <p className="text-center text-gray-500 mt-6">
                  There are no announcements at the moment. Please check back soon.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Events Section */}
        <Card className="overflow-hidden border-0 shadow-xl rounded-none bg-white/90 backdrop-blur-sm transition-transform hover:scale-[1.01] hover:shadow-2xl">
          <CardHeader className="text-center py-10 bg-linear-to-r from-primary/10 to-primary/5 border-b border-gray-200">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <CalendarDaysIcon className="h-10 w-10 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold uppercase tracking-wide text-gray-900">
              Upcoming Events
            </CardTitle>
            <CardDescription className="mt-2 text-gray-600 text-base">
              Join us in our upcoming services, ministries, and gatherings.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {events.filter((e) => !e.isArchived).length > 0 ? (
                events
                  .filter((e) => !e.isArchived)
                  .map((e) => (
                    <div key={e.id} onClick={() => handleViewEvent(e)}>
                      <EventCard event={e} />
                    </div>
                  ))
              ) : (
                <p className="text-center text-gray-500 mt-6">
                  No events scheduled right now. Stay tuned for upcoming gatherings!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog for viewing selected event */}
      {selectedRecord && selectedRecord?.type === "event" && (
        <Dialog open={dialogOpen && mode === "view"} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>View Event</DialogTitle>
              <DialogDescription>Here are the details of the selected event.</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch h-full">
              <div className="w-full h-[350px] flex justify-center items-center">
                {selectedRecord.imageUrl ? (
                  <Image
                    src={selectedRecord.imageUrl}
                    alt="Event"
                    width={700}
                    height={350}
                    className="w-full h-full object-cover rounded-md shadow-md"
                    priority={true}
                  />
                ) : (
                  <div className="w-full h-[350px] flex items-center justify-center border border-dashed text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="h-full">
                <EventCard event={selectedRecord as EventRecord} />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </section>
  );
};
