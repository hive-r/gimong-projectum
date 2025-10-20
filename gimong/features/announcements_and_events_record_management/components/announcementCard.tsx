"use client";

import React from "react";
import { CalendarDaysIcon } from "lucide-react";
import { AnnouncementRecord } from "../types/announcement";

interface AnnouncementCardProps {
  announcement: AnnouncementRecord;
}

export const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement }) => {
  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="relative group block p-8 rounded-none bg-white border-b-4 border-b-teal-200 shadow-md transition-all transform hover:border-b-teal-500 hover:scale-105 duration-300">
      {/* 🔹 Center Content */}
      <div className="text-center space-y-4">
        <p className="text-sm font-semibold text-primary uppercase tracking-wide">
          Announcement
        </p>
        <h2 className="text-3xl font-extrabold uppercase tracking-tight transition-colors duration-300 group-hover:text-primary">
          {announcement.title}
        </h2>
        <p className="text-base text-gray-700 leading-relaxed max-w-lg mx-auto">
          {announcement.description}
        </p>
      </div>

      {/* 🔹 Details */}
      <div className="flex flex-col gap-4 mt-8 text-gray-800">
        <div className="flex items-center gap-3 text-base">
          <CalendarDaysIcon className="h-5 w-5 text-primary" />
          <span className="font-medium">{formatDate(announcement.dateCreated)}</span>
        </div>
      </div>
    </div>
  );
};
