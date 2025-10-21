"use client";

import React from "react";
import { CalendarDaysIcon, ClockIcon, MapPinIcon } from "lucide-react";
import { EventRecord } from "../types/event";

interface EventCardProps {
  event: EventRecord;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const startDate = formatDate(event.startDate);
  const endDate = event.endDate ? formatDate(event.endDate) : null;

  return (
    <div className="relative group block p-8 rounded-none bg-white border-b-4 border-b-teal-200 shadow-md transition-all transform hover:border-b-teal-500 hover:scale-105 duration-300">
      {/* 🔹 Center Content */}
      <div className="text-center space-y-4">
        <p className="text-sm font-semibold text-primary uppercase tracking-wide">
          {event.status} Event
        </p>
        <h2 className="text-3xl font-extrabold uppercase tracking-tight transition-colors duration-300 group-hover:text-primary">
          {event.title}
        </h2>
        <p className="text-base text-gray-700 leading-relaxed max-w-lg mx-auto">
          {event.description}
        </p>
      </div>

      {/* 🔹 Details */}
      <div className="flex flex-col gap-4 mt-8 text-gray-800">
        {/* Date */}
        <div className="flex items-center gap-3 text-base">
          <CalendarDaysIcon className="h-5 w-5 text-primary" />
          <span className="font-medium">
            {startDate}
            {endDate && endDate !== event.startDate && ` – ${endDate}`}
          </span>
        </div>

        {/* Time */}
        <div className="flex items-center gap-3 text-base">
          <ClockIcon className="h-5 w-5 text-primary" />
          <span className="font-medium">
            {formatTime(event.startTime)}
            {event.endTime && ` – ${formatTime(event.endTime)}`}
          </span>
        </div>

        {/* Venue */}
        <div className="flex items-center gap-3 text-base">
          <MapPinIcon className="h-5 w-5 text-primary" />
          <span className="font-medium">{event.venue}</span>
        </div>
      </div>
    </div>
  );
};
