"use client";

import React, { useEffect, useState, useMemo } from "react";
import { UsersIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { listenToMemberships } from "../service";
import { MembershipProfile } from "../types";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Legend,
  Line,
} from "recharts";

import { differenceInYears, parseISO } from "date-fns";

export const MembershipStatistics: React.FC = () => {
  const [members, setMembers] = useState<MembershipProfile[]>([]);

  useEffect(() => {
    const unsubscribe = listenToMemberships(setMembers);
    return () => unsubscribe();
  }, []);

  const primaryColor = "hsl(180, 61%, 20%)";
  const secondaryColor = "hsl(173, 80%, 40%)";
  const tertiaryColor = "hsl(200, 70%, 50%)";
  const chartColors = [primaryColor, secondaryColor, tertiaryColor, "#facc15", "#ef4444"];

  // Totals
  const totalActive = members.filter(
    (m) => !m.isArchived && m.membershipStatus === "active"
  ).length;
  const totalInactive = members.filter(
    (m) => !m.isArchived && m.membershipStatus === "inactive"
  ).length;
  const totalArchived = members.filter((m) => m.isArchived).length;

  // Marital Status
  const maritalStatusData = useMemo(() => {
    const counts: Record<string, number> = {};
    members.forEach((m) => {
      const status = m.maritalStatus || "Unknown";
      counts[status] = (counts[status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [members]);

  // Sex distribution
  const sexData = useMemo(() => {
    const counts: Record<string, number> = {};
    members.forEach((m) => {
      const sex = m.sex || "Unknown";
      counts[sex] = (counts[sex] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [members]);

  // Age groups
  const ageData = useMemo(() => {
    const groups = {
      Toddler: 0,
      Child: 0,
      Teen: 0,
      Adult: 0,
      Senior: 0,
    };
    members.forEach((m) => {
      if (!m.dateOfBirth) return;
      const age = differenceInYears(new Date(), parseISO(m.dateOfBirth));
      if (age <= 4) groups.Toddler += 1;
      else if (age <= 12) groups.Child += 1;
      else if (age <= 17) groups.Teen += 1;
      else if (age <= 59) groups.Adult += 1;
      else groups.Senior += 1;
    });
    return Object.entries(groups).map(([name, value]) => ({ name, value }));
  }, [members]);

  // Baptized vs Unbaptized
  const baptizedData = useMemo(() => {
    const counts = { Baptized: 0, Unbaptized: 0 };
    members.forEach((m) => {
      if (m.dateBaptized) counts.Baptized += 1;
      else counts.Unbaptized += 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [members]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1
        className="text-4xl md:text-5xl font-bold mb-6 text-center uppercase"
        style={{ color: primaryColor }}
      >
        Membership Statistics
      </h1>

      {/* Summary Cards */}
      <div className="flex w-full max-w-5xl mx-auto flex-col gap-6 md:flex-row">
        <Card className="flex-1 rounded-none border-t-4" style={{ borderColor: primaryColor }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <UsersIcon className="h-8 w-8" color={primaryColor} />
              Total Active Members
            </CardTitle>
            <CardDescription className="text-lg">All currently active members.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-6xl font-bold" style={{ color: primaryColor }}>{totalActive}</p>
            <p className="text-gray-500">{totalActive} members</p>
          </CardContent>
        </Card>

        <Card className="flex-1 rounded-none border-t-4" style={{ borderColor: primaryColor }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <UsersIcon className="h-8 w-8" color={primaryColor} />
              Total Inactive Members
            </CardTitle>
            <CardDescription className="text-lg">All currently inactive members.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-6xl font-bold" style={{ color: primaryColor }}>{totalInactive}</p>
            <p className="text-gray-500">{totalInactive} members</p>
          </CardContent>
        </Card>

        <Card className="flex-1 rounded-none border-t-4" style={{ borderColor: primaryColor }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <UsersIcon className="h-8 w-8" color={primaryColor} />
              Total Archived Members
            </CardTitle>
            <CardDescription className="text-lg">Members that have been archived.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-6xl font-bold" style={{ color: primaryColor }}>{totalArchived}</p>
            <p className="text-gray-500">{totalArchived} members</p>
          </CardContent>
        </Card>
      </div>

      {/* Pie Charts */}
      <div className="mt-8 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sex */}
        <Card className="rounded-none border-t-4" style={{ borderColor: primaryColor }}>
          <CardHeader>
            <CardTitle className="text-3xl" style={{ color: primaryColor }}>Sex</CardTitle>
            <CardDescription className="text-lg">Distribution of members by sex.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={sexData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {sexData.map((_, index) => <Cell key={index} fill={chartColors[index % chartColors.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Baptized Status */}
        <Card className="rounded-none border-t-4" style={{ borderColor: primaryColor }}>
          <CardHeader>
            <CardTitle className="text-3xl" style={{ color: primaryColor }}>Baptized Status</CardTitle>
            <CardDescription className="text-lg">Counts of baptized and unbaptized members.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={baptizedData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {baptizedData.map((_, index) => <Cell key={index} fill={chartColors[index % chartColors.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Age Groups as BarChart */}
      <Card className="mt-8 rounded-none border-t-4" style={{ borderColor: primaryColor }}>
        <CardHeader>
          <CardTitle className="text-3xl" style={{ color: primaryColor }}>Age Groups</CardTitle>
          <CardDescription className="text-lg">Categorized by age ranges from Toddler to Senior.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill={primaryColor} radius={[6, 6, 0, 0]}>
                <LabelList dataKey="value" position="top" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      {/* Marital Status as LineChart */}
      <Card className="mt-8 rounded-none border-t-4" style={{ borderColor: primaryColor }}>
        <CardHeader>
          <CardTitle className="text-3xl" style={{ color: primaryColor }}>Marital Status</CardTitle>
          <CardDescription className="text-lg">Distribution of members by marital status.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={maritalStatusData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke={primaryColor} strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
