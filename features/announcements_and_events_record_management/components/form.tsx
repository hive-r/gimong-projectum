"use client";

import React from "react";
import { AppWindowIcon, CalendarDaysIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { AnnouncementForm } from "./announcementForm";
import { EventForm } from "./eventForm";

export const AnnouncementEventForm: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Announcements & Events Form
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

          {/* Announcement Form */}
          <TabsContent value="announcement">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">Announcements</CardTitle>
                <CardDescription className="text-lg">
                  Fill out the details for a new announcement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnnouncementForm />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Event Form */}
          <TabsContent value="event">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">Events</CardTitle>
                <CardDescription className="text-lg"> 
                  Fill out the details for a new event.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EventForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
