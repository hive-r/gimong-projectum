"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventRecord } from "@/features/announcements_record_management/types";

interface AnnouncementCardProps {
  announcement: EventRecord;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  const {
    title,
    description,
    imageUrl,
    startDate,
    startTime,
    endDate,
    endTime,
    venue,
    link,
  } = announcement;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      {imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            priority={false}
          />
        </div>
      )}

      {/* Content */}
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-gray-700">{description}</p>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>
            {startDate}
            {endDate ? ` - ${endDate}` : ""}
          </span>
        </div>

        {startTime && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>
              {startTime}
              {endTime ? ` - ${endTime}` : ""}
            </span>
          </div>
        )}

        {/* Venue (optional) */}
        {venue && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{venue}</span>
          </div>
        )}

        {/* Link (optional) */}
        {link && (
          <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-sm font-medium text-teal-600 hover:underline"
          >
            View on Facebook
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
