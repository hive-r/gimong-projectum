"use client";

import React from "react";
import {
  CalendarDaysIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  HeartIcon,
  UserIcon,
} from "lucide-react";
import { MembershipProfile } from "../types";

// Helper function to calculate age from date of birth
const calculateAge = (dob?: string): number | undefined => {
  if (!dob) return undefined;
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Helper to format ISO date strings
const formatDate = (dateStr?: string) =>
  dateStr
    ? new Date(dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

interface MembershipCardProps {
  member: MembershipProfile;
}

export const MembershipCard: React.FC<MembershipCardProps> = ({ member }) => {
  const fullName = `${member.firstName} ${member.lastName}`;
  const address = `${member.address.barangay}, ${member.address.municipality}, ${member.address.province}, ${member.address.country}`;
  const age = calculateAge(member.dateOfBirth);

  return (
    <div className="relative group block bg-teal-50 border-b-10 border-b-teal-200 hover:border-b-teal-500 p-8 shadow-sm hover:shadow-lg transition-all rounded-lg">
      {/* Header */}
      <div className="text-center space-y-3">
        <UserIcon className="mx-auto h-12 w-12 text-primary" />
        <h2 className="text-3xl font-extrabold uppercase text-gray-900 tracking-tight">
          {fullName}
        </h2>
        <p className="text-gray-700 text-sm">
          Age: <span className="font-medium">{age ?? "—"}</span> •{" "}
          <span className="capitalize">{member.sex}</span>
        </p>
      </div>

      {/* Details */}
      <div className="mt-8 space-y-4 text-gray-800">
        {/* Address */}
        <div className="flex items-center gap-3 text-base">
          <MapPinIcon className="h-5 w-5 text-primary" />
          <span className="font-medium">{address}</span>
        </div>

        {/* Contact */}
        <div className="flex items-center gap-3 text-base">
          <PhoneIcon className="h-5 w-5 text-primary" />
          <span className="font-medium">{member.contactNumber}</span>
        </div>

        {member.email && (
          <div className="flex items-center gap-3 text-base">
            <MailIcon className="h-5 w-5 text-primary" />
            <span className="font-medium">{member.email}</span>
          </div>
        )}

        {/* Marital, Membership, Baptism */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 border-t pt-4 text-center">
          <div className="flex flex-col items-center">
            <HeartIcon className="h-5 w-5 text-primary mb-1" />
            <span className="font-medium capitalize">{member.maritalStatus}</span>
          </div>

          <div className="flex flex-col items-center">
            <UserIcon className="h-5 w-5 text-primary mb-1" />
            <span
              className={`font-semibold capitalize ${
                member.membershipStatus === "active"
                  ? "text-green-600"
                  : "text-gray-500"
              }`}
            >
              {member.membershipStatus}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <CalendarDaysIcon className="h-5 w-5 text-primary mb-1" />
            <span className="font-medium">
              {member.dateBaptized ? formatDate(member.dateBaptized) : "Not baptized"}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-gray-500 mt-6 text-right">
        Joined: {formatDate(member.dateCreated)}
      </div>
    </div>
  );
};
