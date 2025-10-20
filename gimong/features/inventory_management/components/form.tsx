"use client";

import React from "react";
import { ArchiveIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InventoryForm } from "./inventoryForm";

export const IForm: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Resource Form
      </h1>

      <div className="flex w-full max-w-5xl mx-auto flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl uppercase">
              <div className="flex items-center gap-2">
                Add New Inventory PDF
              </div>
            </CardTitle>
            <CardDescription className="text-lg">
              Upload a PDF and fill in inventory details below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InventoryForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
