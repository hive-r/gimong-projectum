"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { MembershipForm } from "./membershipForm";

export const MForm: React.FC = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center uppercase">
        Memberships Form
      </h1>

      <div className="flex w-full max-w-5xl mx-auto flex-col gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <div>
              <CardTitle className="text-2xl uppercase">Create Membership</CardTitle>
              <CardDescription className="text-lg">
                Fill out the details to add a new member record.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <MembershipForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
