"use client";

import React, { useEffect, useState } from "react";
import { BookOpenIcon, FileTextIcon } from "lucide-react";
import { listenToInventory } from "../service";
import { InventoryItem } from "../types";
import { InventoryCard } from "./inventoryCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import SectionHeader from "@/modules/components/sectionHeader";

export const SermonDevotionalCardPublic: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    const unsubscribe = listenToInventory(setInventory);
    return () => unsubscribe();
  }, []);

  const sermons = inventory.filter(
    (item) => item.category === "sermon" && !item.isArchived
  );
  const devotionals = inventory.filter(
    (item) => item.category === "devotional" && !item.isArchived
  );

  return (
    <section className="relative py-20 px-6 md:px-12 bg-gradient-to-b from-white via-gray-50 to-gray-100 overflow-hidden">
      {/* Subtle Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none"></div>

      {/* Header */}
      <div className="relative mb-4 text-center">
        <SectionHeader
          subtitle="Grow in Faith"
          title="Sermons & Devotionals"
          align="center"
        />
        <p className="text-gray-600 max-w-2xl mx-auto mt-4 leading-relaxed">
          Deepen your understanding of God's Word through inspiring sermons and
          heartfelt devotionals. Listen, reflect, and grow in your daily walk
          with Christ.
        </p>
      </div>

      <div className="space-y-20 max-w-6xl mx-auto relative z-10">
        {/* Sermons Section */}
        <Card className="overflow-hidden border-0 shadow-xl rounded-none bg-white/90 backdrop-blur-sm transition-transform hover:scale-[1.01] hover:shadow-2xl">
          <CardHeader className="text-center py-10 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-200">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <BookOpenIcon className="h-10 w-10 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold uppercase tracking-wide text-gray-900">
              Sermons
            </CardTitle>
            <CardDescription className="mt-2 text-gray-600 text-base">
              Powerful messages to inspire your spiritual journey.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {sermons.length > 0 ? (
                sermons.map((item, index) => (
                  <InventoryCard key={item.firestoreId ?? index} item={item} />
                ))
              ) : (
                <p className="text-center text-gray-500 mt-6">
                  No sermons available at the moment. Please check back soon.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Devotionals Section */}
        <Card className="overflow-hidden border-0 shadow-xl rounded-none bg-white/90 backdrop-blur-sm transition-transform hover:scale-[1.01] hover:shadow-2xl">
          <CardHeader className="text-center py-10 bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-200">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <FileTextIcon className="h-10 w-10 text-aprimary/10" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold uppercase tracking-wide text-gray-900">
              Devotionals
            </CardTitle>
            <CardDescription className="mt-2 text-gray-600 text-base">
              Daily encouragements to strengthen your faith and spirit.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {devotionals.length > 0 ? (
                devotionals.map((item, index) => (
                  <InventoryCard key={item.firestoreId ?? index} item={item} />
                ))
              ) : (
                <p className="text-center text-gray-500 mt-6">
                  No devotionals available at the moment. Please check back soon.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
