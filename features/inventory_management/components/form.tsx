"use client";

import React from "react";
import { FileTextIcon, RadioIcon } from "lucide-react";
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
import { InventoryForm } from "./inventoryForm";
import { LiveStreamForm } from "@/features/livestream_management/components/livestreamForm";

export const IForm: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Resource Management Form
      </h1>

      {/* Main Content */}
      <div className="flex w-full max-w-5xl mx-auto flex-col gap-6">
        <Tabs defaultValue="inventory" className="w-full">
          {/* Tab Headers */}
          <TabsList className="grid w-full grid-cols-2 bg-primary">
            <TabsTrigger
              value="inventory"
              className="flex items-center gap-2 text-gray-700"
            >
              <FileTextIcon className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger
              value="livestream"
              className="flex items-center gap-2 text-gray-700"
            >
              <RadioIcon className="h-4 w-4" />
              Livestream
            </TabsTrigger>
          </TabsList>

          {/* Inventory Form */}
          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">
                  Inventory
                </CardTitle>
                <CardDescription className="text-lg">
                  Upload a PDF and fill in inventory details below.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InventoryForm />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Livestream Form */}
          <TabsContent value="livestream">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl uppercase">
                  Livestream
                </CardTitle>
                <CardDescription className="text-lg">
                  Fill out the details for a new livestream session.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LiveStreamForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
