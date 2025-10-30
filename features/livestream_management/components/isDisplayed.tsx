"use client";

import React, { useEffect, useMemo, useState } from "react";
import { VideoIcon, PlayIcon, CalendarDaysIcon } from "lucide-react";
import Image from "next/image";
import { listenToLiveStreams } from "../service";
import { LiveStreamRecord } from "../livestream";
import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export const IsDisplayCard: React.FC = () => {
  const [liveStreams, setLiveStreams] = useState<LiveStreamRecord[]>([]);

  useEffect(() => {
    const unsubscribe = listenToLiveStreams(setLiveStreams);
    return () => unsubscribe();
  }, []);

  // ✅ Filter all displayed (pinned) livestreams that are not archived
  const displayedStreams = useMemo(
    () => liveStreams.filter((s) => s.isDisplay && !s.isArchived),
    [liveStreams]
  );

  if (displayedStreams.length === 0) {
    return (
      <div className="flex justify-center items-center w-full my-6">
        <Card className="w-full max-w-3xl text-center hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6 text-gray-500">
            No live streams currently displayed.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-10 w-full my-10">
      {displayedStreams.map((stream) => (
        <Card
          key={stream.id}
          className="w-full max-w-7xl overflow-hidden shadow-md rounded-none group"
        >
          <CardContent className="flex flex-col justify-center items-center p-6 text-center gap-4">
            {/* Header */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-xl text-primary uppercase flex items-center gap-2">
                <VideoIcon className="h-6 w-6" />
                LIVE STREAM
              </div>
              <CardTitle className="text-5xl uppercase group-hover:text-primary transition-colors duration-300">
                {stream.title}
              </CardTitle>
            </div>

            {/* Date and Time */}
            <CardDescription className="text-lg flex items-center gap-2 justify-center">
              <CalendarDaysIcon className="h-5 w-5" />
              {stream.date
                ? new Date(stream.date).toLocaleDateString()
                : "No Date"}
              {stream.time ? ` at ${stream.time}` : ""}
            </CardDescription>

            {/* Description */}
            <CardDescription className="text-lg max-w-3xl text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
              {stream.description}
            </CardDescription>

            {/* Image */}
            <div className="w-full max-h-[400px] aspect-video overflow-hidden rounded-md relative">
              {stream.imageUrl ? (
                <div className="overflow-hidden rounded-md relative">
                  <Image
                    src={stream.imageUrl}
                    alt={stream.title}
                    width={1600}
                    height={900}
                    className="w-full h-full object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                    priority={true}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center border border-dashed text-gray-400">
                  No Image Available
                </div>
              )}
            </div>

            {/* Watch Button */}
            {stream.link && (
              <a
                href={stream.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-primary/90 transition-all duration-300"
              >
                <PlayIcon className="h-5 w-5" />
                Watch Live
              </a>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
