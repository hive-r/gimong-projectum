"use client";

import React from "react";
import { CalendarDaysIcon, DownloadIcon } from "lucide-react";
import { InventoryItem } from "../types";
import { storage } from "@/services/appwrite/config";

interface InventoryCardProps {
  item: InventoryItem;
}

export const InventoryCard: React.FC<InventoryCardProps> = ({ item }) => {
  const formatDate = (dateStr?: string) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "—";

  const categoryLabel = item.category === "sermon" ? "Sermon" : "Devotional";

  const handleDownload = async () => {
    if (!item.appwriteId || !item.bucketId) return alert("File not available");

    try {
      const fileUrl = await storage.getFileDownload(item.bucketId, item.appwriteId);
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = item.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file");
    }
  };

  return (
    <div className="relative group block p-8 rounded-none bg-white border-b-4 border-b-teal-200 shadow-md transition-all transform hover:border-b-teal-500 hover:scale-105 duration-300">
      {/* Download Icon - Upper Right */}
      {item.appwriteId && item.bucketId && (
        <button
          onClick={handleDownload}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-primary transition-colors"
          title="Download"
        >
          <DownloadIcon className="h-5 w-5" />
        </button>
      )}

      {/* Center Content */}
      <div className="text-center space-y-4">
        <p className="text-sm font-semibold text-primary uppercase tracking-wide">
          {categoryLabel}
        </p>
        <h2 className="text-3xl font-extrabold uppercase text-gray-900 tracking-tight transition-colors duration-300 group-hover:text-primary">
          {item.name}
        </h2>
        {item.description && (
          <p className="text-base text-gray-700 leading-relaxed max-w-lg mx-auto">
            {item.description}
          </p>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-4 mt-8 text-gray-800">
        <div className="flex items-center gap-3 text-base">
          <CalendarDaysIcon className="h-5 w-5 text-primary" />
          <span className="font-medium">{formatDate(item.uploadedAt)}</span>
        </div>
      </div>
    </div>
  );
};
