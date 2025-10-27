"use client";

import React, { useEffect, useState, useMemo } from "react";
import { DollarSignIcon, UsersIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  listenToMonetaryRecords,
  listenToNonMonetaryRecords,
  listenToCashoutRecords,
  listenToCashoutReports, // ✅ added
} from "../service";
import { MonetaryRecord } from "../types/monetary";
import { NonMonetaryRecord } from "../types/nonMonetary";
import { CashoutRecord } from "../types/cashout";
import { CashoutReport } from "../types/cashout"; // ✅ added
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import SectionHeader from "@/modules/components/sectionHeader";

type ChartData = {
  name: string;
  value: number;
};

export const FinancialStatisticsPublic: React.FC = () => {
  const [monetaryRecords, setMonetaryRecords] = useState<MonetaryRecord[]>([]);
  const [nonMonetaryRecords, setNonMonetaryRecords] = useState<NonMonetaryRecord[]>([]);
  const [cashouts, setCashouts] = useState<CashoutRecord[]>([]);
  const [cashoutReports, setCashoutReports] = useState<CashoutReport[]>([]); // ✅ added

  const primaryColor = "hsl(180, 61%, 20%)";

  // 👂 Listeners
  useEffect(() => {
    const unsub1 = listenToMonetaryRecords(setMonetaryRecords);
    const unsub2 = listenToNonMonetaryRecords(setNonMonetaryRecords);
    const unsub3 = listenToCashoutRecords(setCashouts);
    const unsub4 = listenToCashoutReports(setCashoutReports); // ✅ added
    return () => {
      unsub1();
      unsub2();
      unsub3();
      unsub4();
    };
  }, []);

  // Totals
  const totalMonetary = monetaryRecords
    .filter((r) => !r.isArchived && typeof r.amount === "number")
    .reduce((sum, r) => sum + r.amount, 0);

  const totalNonMonetary = nonMonetaryRecords.filter((r) => !r.isArchived).length;

  // Monetary by Type
  const monetaryByType: ChartData[] = useMemo(() => {
    const grouped: Record<string, number> = {};
    monetaryRecords
      .filter((r) => !r.isArchived && typeof r.amount === "number")
      .forEach((r) => {
        grouped[r.donationType] = (grouped[r.donationType] || 0) + r.amount;
      });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [monetaryRecords]);

  // ✅ Reported Cashouts Only
  const reportedCashouts = useMemo(() => {
    const reportIds = new Set(
      cashoutReports.filter((r) => !r.isArchived).map((r) => r.cashoutId)
    );
    return cashouts.filter((c) => reportIds.has(c.id) && !c.isArchived);
  }, [cashoutReports, cashouts]);

  // ✅ Cashouts by Source Fund (only reported)
  const cashoutsBySource: ChartData[] = useMemo(() => {
    const grouped: Record<string, number> = {};
    reportedCashouts.forEach((c) => {
      if (!c.sourceFund) return;
      grouped[c.sourceFund] = (grouped[c.sourceFund] || 0) + (c.amount || 0);
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [reportedCashouts]);

  // ✅ Net Donations by Type (subtract reported cashouts only)
  const netDonationsByType: ChartData[] = useMemo(() => {
    const donationMap: Record<string, number> = {};
    monetaryRecords
      .filter((r) => !r.isArchived && typeof r.amount === "number")
      .forEach((r) => {
        donationMap[r.donationType] = (donationMap[r.donationType] || 0) + r.amount;
      });

    const cashoutMap: Record<string, number> = {};
    reportedCashouts.forEach((c) => {
      if (!c.sourceFund) return;
      cashoutMap[c.sourceFund] = (cashoutMap[c.sourceFund] || 0) + (c.amount || 0);
    });

    return Object.entries(donationMap).map(([type, amount]) => ({
      name: type,
      value: amount - (cashoutMap[type] || 0),
    }));
  }, [monetaryRecords, reportedCashouts]);


  return (
    <section className="py-20 px-6 md:px-12 bg-linear-to-b from-white via-gray-50 to-gray-100 min-h-screen">
      {/* Section Header */}
      <div className="text-center mb-14">
        <SectionHeader
          subtitle="Our Blessings at Work"
          title="Financial Contributions Overview"
          align="center"
        />
        <p className="text-gray-600 max-w-3xl mx-auto mt-4 text-lg">
          A reflection of God’s grace through the generosity of our members. Here’s how our
          community continues to give and serve through financial and non-monetary support.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto">
        {/* Total Monetary */}
        <Card className="flex-1 border-none shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300 rounded-2xl">
          <CardHeader className="text-center border-b border-gray-100 bg-linear-to-r from-primary/5 to-transparent">
            <div className="flex justify-center mb-3">
              <DollarSignIcon className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Total Monetary Contributions
            </CardTitle>
            <CardDescription className="text-gray-500">
              The total value of all active financial donations.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 text-center">
            <p className="text-4xl font-extrabold text-primary mb-2">
              ₱{totalMonetary.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </p>
            <p className="text-gray-500">
              {monetaryRecords.filter((r) => !r.isArchived).length} donations received
            </p>
          </CardContent>
        </Card>

        {/* Total Non-Monetary */}
        <Card className="flex-1 border-none shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300 rounded-2xl">
          <CardHeader className="text-center border-b border-gray-100 bg-linear-to-r from-primary/5 to-transparent">
            <div className="flex justify-center mb-3">
              <UsersIcon className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Total Non-Monetary Contributions
            </CardTitle>
            <CardDescription className="text-gray-500">
              Count of gifts and offerings beyond finances.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 text-center">
            <p className="text-4xl font-extrabold text-primary mb-2">
              {totalNonMonetary}
            </p>
            <p className="text-gray-500">{totalNonMonetary} contributions shared</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {/* 1️⃣ Monetary by Type */}
      <Card className="mt-16 max-w-5xl mx-auto shadow-lg border-none bg-white/90 backdrop-blur-sm rounded-2xl hover:shadow-xl transition-all duration-300">
        <CardHeader className="text-center border-b border-gray-100 py-6 bg-linear-to-r from-primary/5 to-transparent">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Monetary Contributions by Type
          </CardTitle>
          <CardDescription className="text-gray-500">
            Visual insight into where our blessings are directed.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 pb-12">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monetaryByType} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fill: "#4b5563", fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `₱${v.toLocaleString("en-PH")}`} tick={{ fill: "#4b5563", fontSize: 12 }} />
              <Tooltip formatter={(value: number) => `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`} />
              <Bar dataKey="value" fill={primaryColor} radius={[8, 8, 0, 0]}>
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(label: React.ReactNode) => {
                    const value = typeof label === "number" ? label : Number(label) || 0;
                    return `₱${value.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;
                  }}
                  style={{ fill: "#1f2937", fontSize: 12 }}
                />

              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2️⃣ Net Donations by Type */}
      <Card className="mt-16 max-w-5xl mx-auto shadow-lg border-none bg-white/90 backdrop-blur-sm rounded-2xl hover:shadow-xl transition-all duration-300">
        <CardHeader className="text-center border-b border-gray-100 py-6 bg-linear-to-r from-primary/5 to-transparent">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Net Donations by Type (After Cashouts)
          </CardTitle>
          <CardDescription className="text-gray-500">
            Amounts after deducting cashouts from each donation type.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 pb-12">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={netDonationsByType} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fill: "#4b5563", fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `₱${v.toLocaleString("en-PH")}`} tick={{ fill: "#4b5563", fontSize: 12 }} />
              <Tooltip
                content={({ active, payload }: { active?: boolean; payload?: { payload: ChartData }[] }) => {
                  if (active && payload && payload.length) {
                    const { name, value } = payload[0].payload;
                    const original = monetaryByType.find(d => d.name === name)?.value || 0;
                    return (
                      <div className="bg-white p-2 border rounded shadow">
                        <p className="font-bold">{name}</p>
                        <p>Original: ₱{original.toLocaleString("en-PH")}</p>
                        <p>After Cashouts: ₱{value.toLocaleString("en-PH")}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" fill="hsl(173, 80%, 40%)" radius={[8, 8, 0, 0]}>
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(label: React.ReactNode) => {
                    const value = typeof label === "number" ? label : Number(label) || 0;
                    return `₱${value.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;
                  }}
                  style={{ fill: "#1f2937", fontSize: 12 }}
                />

              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3️⃣ Cashouts by Source Fund */}
      <Card className="mt-16 max-w-5xl mx-auto shadow-lg border-none bg-white/90 backdrop-blur-sm rounded-2xl hover:shadow-xl transition-all duration-300">
        <CardHeader className="text-center border-b border-gray-100 py-6 bg-linear-to-r from-primary/5 to-transparent">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Cashouts by Source Fund
          </CardTitle>
          <CardDescription className="text-gray-500">
            Distribution of cashouts based on each source fund.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 pb-12">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={cashoutsBySource} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fill: "#4b5563", fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `₱${v.toLocaleString("en-PH")}`} tick={{ fill: "#4b5563", fontSize: 12 }} />
              <Tooltip
                content={({ active, payload }: { active?: boolean; payload?: { payload: ChartData }[] }) => {
                  if (active && payload && payload.length) {
                    const { name, value } = payload[0].payload;
                    return (
                      <div className="bg-white p-2 border rounded shadow">
                        <p className="font-bold">{name}</p>
                        <p>Cashout: ₱{value.toLocaleString("en-PH")}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="value" fill={primaryColor} radius={[8, 8, 0, 0]}>
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(label: React.ReactNode) => {
                    const value = typeof label === "number" ? label : Number(label) || 0;
                    return `₱${value.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;
                  }}
                  style={{ fill: "#1f2937", fontSize: 12 }}
                />

              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </section>
  );
};
