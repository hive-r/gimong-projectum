"use client";

import React, { useEffect, useState, useMemo } from "react";
import { AppWindowIcon, CalendarDaysIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { listenToAnnouncements, listenToEvents } from "../service";
import { AnnouncementRecord } from "../types/announcement";
import { EventRecord } from "../types/event";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, addDays, isWithinInterval, parseISO, startOfMonth, endOfMonth } from "date-fns";

export const AnnouncementEventStatistics: React.FC = () => {
  const [announcements, setAnnouncements] = useState<AnnouncementRecord[]>([]);
  const [events, setEvents] = useState<EventRecord[]>([]);

  // Fetch data
  useEffect(() => {
    const unsubA = listenToAnnouncements(setAnnouncements);
    const unsubE = listenToEvents(setEvents);
    return () => {
      unsubA();
      unsubE();
    };
  }, []);

  // Filter active records
  const activeAnnouncements = useMemo(
    () => announcements.filter((a) => !a.isArchived),
    [announcements]
  );
  const activeEvents = useMemo(() => events.filter((e) => !e.isArchived), [events]);

  const totalAnnouncements = activeAnnouncements.length;
  const totalEvents = activeEvents.length;

  const themeColor = "hsl(180, 61%, 20%)";
  const themeColor1 = "hsl(178, 69%, 22%)";

  // Stable today object
  const today = useMemo(() => new Date(), []);

  // Upcoming 8 days
  const upcomingDays = useMemo(() => Array.from({ length: 8 }, (_, i) => addDays(today, i)), [today]);

  // Upcoming 8 days data
  const upcomingData = useMemo(() => {
    return upcomingDays.map((day) => {
      const dayStart = new Date(day.setHours(0, 0, 0, 0));
      const dayEnd = new Date(dayStart);
      dayEnd.setHours(23, 59, 59, 999);

      const announcementCount = activeAnnouncements.filter((a) => {
        const dateCreated = a.dateCreated ? parseISO(a.dateCreated) : new Date(0);
        return isWithinInterval(dateCreated, { start: dayStart, end: dayEnd });
      }).length;

      const eventCount = activeEvents.filter((e) => {
        const startDate = e.startDate ? parseISO(e.startDate) : new Date(0);
        return isWithinInterval(startDate, { start: dayStart, end: dayEnd });
      }).length;

      return {
        name: format(dayStart, "MMM d"),
        Announcements: announcementCount,
        Events: eventCount,
      };
    });
  }, [activeAnnouncements, activeEvents, upcomingDays]);

  // Weekly events data for current month
  const weeklyData = useMemo(() => {
    const startMonth = startOfMonth(today);
    const endMonth = endOfMonth(today);
    const weeksCount = Math.ceil((endMonth.getDate() + startMonth.getDay()) / 7);

    const weekData = Array.from({ length: weeksCount }, (_, i) => ({
      week: `Week ${i + 1}`,
      Events: 0,
    }));

    activeEvents.forEach((event) => {
      if (!event.startDate) return;
      const date = parseISO(event.startDate);
      if (date < startMonth || date > endMonth) return;

      const weekNumber = Math.ceil((date.getDate() + startMonth.getDay()) / 7);
      weekData[weekNumber - 1].Events += 1;
    });

    return weekData;
  }, [activeEvents, today]);

  const monthName = format(today, "MMMM yyyy");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center uppercase" style={{ color: themeColor }}>
        Announcement & Event Statistics
      </h1>

      {/* Summary Cards */}
      <div className="flex w-full max-w-5xl mx-auto flex-col gap-6 md:flex-row">
        <Card className="flex-1 rounded-none border-t-4" style={{ borderColor: themeColor }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <AppWindowIcon className="h-8 w-8" color={themeColor} />
              Total Announcements
            </CardTitle>
            <CardDescription className="text-lg">Number of active announcements.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-6xl font-bold" style={{ color: themeColor }}>
              {totalAnnouncements}
            </p>
            <p className="text-gray-500">
              {totalAnnouncements} announcement{totalAnnouncements !== 1 && "s"}
            </p>
          </CardContent>
        </Card>

        <Card className="flex-1 rounded-none border-t-4" style={{ borderColor: themeColor }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <CalendarDaysIcon className="h-8 w-8" color={themeColor} />
              Total Events
            </CardTitle>
            <CardDescription className="text-lg">Number of active events.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-6xl font-bold" style={{ color: themeColor }}>
              {totalEvents}
            </p>
            <p className="text-gray-500">
              {totalEvents} event{totalEvents !== 1 && "s"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming 8 Days Chart */}
      <Card className="mt-8 max-w-5xl rounded-none mx-auto border-t-4" style={{ borderColor: themeColor }}>
        <CardHeader>
          <CardTitle style={{ color: themeColor }} className="text-3xl">
            Upcoming 8 Days Overview
          </CardTitle>
          <CardDescription className="text-lg">
            Combined count of announcements and events for the next 8 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={upcomingData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Announcements" fill={themeColor1} radius={[6, 6, 0, 0]} />
              <Bar dataKey="Events" fill={themeColor} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Weekly Line Chart */}
      <Card className="mt-8 max-w-5xl rounded-none mx-auto border-t-4" style={{ borderColor: themeColor }}>
        <CardHeader>
          <CardTitle style={{ color: themeColor }} className="text-3xl">
            Upcoming Events — {monthName}
          </CardTitle>
          <CardDescription className="text-lg">
            Total number of events for each week of {monthName}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={weeklyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis dataKey="week" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Events" stroke={themeColor} strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
