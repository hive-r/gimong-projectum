"use client";

import React from "react";
import { CalendarDaysIcon, ClockIcon, LinkIcon, VideoIcon } from "lucide-react";
import { LiveStreamRecord } from "../livestream";

interface LiveStreamCardProps {
  liveStream: LiveStreamRecord;
}

export const LiveStreamCard: React.FC<LiveStreamCardProps> = ({ liveStream }) => {
  const formatDate = (dateStr?: string) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "";

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

  return (
    <div className="relative group block p-8 rounded-none bg-white border-b-4 border-b-teal-200 shadow-md transition-all transform hover:border-b-teal-500 hover:scale-105 duration-300">
      {/* 🔹 Center Content */}
      <div className="text-center space-y-4">
        <p className="text-sm font-semibold text-primary uppercase tracking-wide">
          Live Stream
        </p>
        <h2 className="text-3xl font-extrabold uppercase tracking-tight transition-colors duration-300 group-hover:text-primary">
          {liveStream.title}
        </h2>
        <p className="text-base text-gray-700 leading-relaxed max-w-lg mx-auto">
          {liveStream.description}
        </p>
      </div>

      {/* 🔹 Details */}
      <div className="flex flex-col gap-4 mt-8 text-gray-800">
        {/* Date */}
        {liveStream.date && (
          <div className="flex items-center gap-3 text-base">
            <CalendarDaysIcon className="h-5 w-5 text-primary" />
            <span className="font-medium">{formatDate(liveStream.date)}</span>
          </div>
        )}

        {/* Time */}
        {liveStream.time && (
          <div className="flex items-center gap-3 text-base">
            <ClockIcon className="h-5 w-5 text-primary" />
            <span className="font-medium">{formatTime(liveStream.time)}</span>
          </div>
        )}

        {/* Link */}
        {liveStream.link && (
          <div className="flex items-center gap-3 text-base">
            <LinkIcon className="h-5 w-5 text-primary" />
            <a
              href={liveStream.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-teal-600 underline hover:text-teal-800 transition-colors"
            >
              Watch Live
            </a>
          </div>
        )}

        {/* Display status */}
        <div className="flex items-center gap-3 text-base">
          <VideoIcon
            className={`h-5 w-5 ${
              liveStream.isDisplay ? "text-teal-600" : "text-gray-400"
            }`}
          />
          <span className="font-medium">
            {liveStream.isDisplay ? "Visible to viewers" : "Hidden from display"}
          </span>
        </div>
      </div>
    </div>
  );
};
