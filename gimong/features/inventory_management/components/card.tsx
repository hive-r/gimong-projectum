"use client";

import React, { useEffect, useState } from "react";
import { BookOpenIcon, FileTextIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { listenToInventory } from "../service";
import { InventoryItem } from "../types";
import { InventoryCard } from "./inventoryCard";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const SermonDevtionalCard: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // 🔹 Real-time inventory
  useEffect(() => {
    const unsubscribe = listenToInventory(setInventory);
    return () => unsubscribe();
  }, []);

  const sermons = inventory.filter((item) => item.category === "sermon" && !item.isArchived);
  const devotionals = inventory.filter((item) => item.category === "devotional" && !item.isArchived);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Sermons & Devotionals Card
      </h1>

      <div className="flex w-full max-w-5xl mx-auto flex-col gap-6">
        <Tabs defaultValue="sermon" className="w-full">
          {/* Tab Headers */}
          <TabsList className="grid w-full grid-cols-2 bg-primary">
            <TabsTrigger value="sermon" className="flex items-center gap-2 text-gray-700">
              <BookOpenIcon className="h-4 w-4" />
              Sermons
            </TabsTrigger>
            <TabsTrigger value="devotional" className="flex items-center gap-2 text-gray-700">
              <FileTextIcon className="h-4 w-4" />
              Devotionals
            </TabsTrigger>
          </TabsList>

          {/* Sermons */}
          <TabsContent value="sermon">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">Sermons</CardTitle>
                <CardDescription className="text-lg">Available sermons.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {sermons.length > 0 ? (
                    sermons.map((item, index) => <InventoryCard key={item.firestoreId ?? index} item={item} />)
                  ) : (
                    <p className="text-center text-gray-500 mt-4">
                      No sermons available.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Devotionals */}
          <TabsContent value="devotional">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">Devotionals</CardTitle>
                <CardDescription className="text-lg">Available devotionals.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {devotionals.length > 0 ? (
                    devotionals.map((item,index) => <InventoryCard key={item.firestoreId ?? index} item={item} />)
                  ) : (
                    <p className="text-center text-gray-500 mt-4">
                      No devotionals available.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
