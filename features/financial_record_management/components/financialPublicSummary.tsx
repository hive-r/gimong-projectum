"use client";

import React, { useEffect, useMemo, useState } from "react";
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
} from "../service";
import { MonetaryRecord } from "../types/monetary";
import { NonMonetaryRecord } from "../types/nonMonetary";
import { CashoutRecord } from "../types/cashout";
import { format, parseISO } from "date-fns";
import SectionHeader from "@/modules/components/sectionHeader";
import { BarChart, Bar, ResponsiveContainer } from "recharts";

export const FinancialPublicSummary: React.FC = () => {
  const [monetaryRecords, setMonetaryRecords] = useState<MonetaryRecord[]>([]);
  const [nonMonetaryRecords, setNonMonetaryRecords] = useState<NonMonetaryRecord[]>([]);
  const [cashouts, setCashouts] = useState<CashoutRecord[]>([]);
  const themeColor = "hsl(180, 61%, 20%)";

  useEffect(() => {
    const unsubMonetary = listenToMonetaryRecords(setMonetaryRecords);
    const unsubNonMonetary = listenToNonMonetaryRecords(setNonMonetaryRecords);
    const unsubCashouts = listenToCashoutRecords(setCashouts);
    return () => {
      unsubMonetary();
      unsubNonMonetary();
      unsubCashouts();
    };
  }, []);

  // 🗓 Monthly Summary
  const monthlyData = useMemo(() => {
    const map: Record<string, { monetary: number; nonMonetary: number; cashout: number }> = {};
    monetaryRecords.forEach((r) => {
      if (r.isArchived || typeof r.amount !== "number" || !r.dateCreated) return;
      const month = format(parseISO(r.dateCreated), "MMMM yyyy");
      if (!map[month]) map[month] = { monetary: 0, nonMonetary: 0, cashout: 0 };
      map[month].monetary += r.amount;
    });
    nonMonetaryRecords.forEach((r) => {
      if (r.isArchived || !r.dateCreated) return;
      const month = format(parseISO(r.dateCreated), "MMMM yyyy");
      if (!map[month]) map[month] = { monetary: 0, nonMonetary: 0, cashout: 0 };
      map[month].nonMonetary += 1;
    });
    cashouts.forEach((c) => {
      if (!c.dateCreated) return;
      const month = format(parseISO(c.dateCreated), "MMMM yyyy");
      if (!map[month]) map[month] = { monetary: 0, nonMonetary: 0, cashout: 0 };
      map[month].cashout += c.amount || 0;
    });
    return Object.entries(map)
      .map(([month, values]) => ({ month, ...values, net: values.monetary - values.cashout }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }, [monetaryRecords, nonMonetaryRecords, cashouts]);

  // 📆 Yearly Summary
  const yearlyData = useMemo(() => {
    const map: Record<string, { monetary: number; nonMonetary: number; cashout: number }> = {};
    monetaryRecords.forEach((r) => {
      if (r.isArchived || typeof r.amount !== "number" || !r.dateCreated) return;
      const year = format(parseISO(r.dateCreated), "yyyy");
      if (!map[year]) map[year] = { monetary: 0, nonMonetary: 0, cashout: 0 };
      map[year].monetary += r.amount;
    });
    nonMonetaryRecords.forEach((r) => {
      if (r.isArchived || !r.dateCreated) return;
      const year = format(parseISO(r.dateCreated), "yyyy");
      if (!map[year]) map[year] = { monetary: 0, nonMonetary: 0, cashout: 0 };
      map[year].nonMonetary += 1;
    });
    cashouts.forEach((c) => {
      if (!c.dateCreated) return;
      const year = format(parseISO(c.dateCreated), "yyyy");
      if (!map[year]) map[year] = { monetary: 0, nonMonetary: 0, cashout: 0 };
      map[year].cashout += c.amount || 0;
    });
    return Object.entries(map)
      .map(([year, values]) => ({ year, ...values, net: values.monetary - values.cashout }))
      .sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [monetaryRecords, nonMonetaryRecords, cashouts]);

  const totalMonetary = monetaryRecords
    .filter((r) => !r.isArchived && typeof r.amount === "number")
    .reduce((sum, r) => sum + r.amount, 0);

  const totalNonMonetary = nonMonetaryRecords.filter((r) => !r.isArchived).length;

  const totalCashouts = cashouts.reduce((sum, c) => sum + (c.amount || 0), 0);
  const netTotal = totalMonetary - totalCashouts;

  return (
    <section className="py-20 px-6 md:px-12 bg-linear-to-b from-white via-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="text-center mb-14">
        <SectionHeader
          subtitle="Transparency & Stewardship"
          title="Public Financial Summary"
          align="center"
        />
        <p className="text-gray-600 max-w-2xl mx-auto mt-4">
          Our mission thrives through faithful generosity. Explore the monthly and yearly breakdowns of 
          both monetary and non-monetary contributions, including cashouts.
        </p>
      </div>

      {/* Total Contributions + Cashouts Summary */}
      <div className="flex flex-col md:flex-row justify-center gap-8 max-w-5xl mx-auto mb-14">
        <Card className="flex-1 border-none shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl hover:shadow-xl transition-all duration-300">
          <CardHeader className="text-center border-b border-gray-100 py-6 bg-linear-to-r from-primary/5 to-transparent">
            <CardTitle className="text-2xl font-semibold text-gray-800">Total Contributions</CardTitle>
            <CardDescription className="text-gray-500">
              Overview of all monetary and non-monetary contributions including cashouts.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 text-center">
            <p className="text-4xl font-extrabold text-primary mb-2">
              ₱{totalMonetary.toLocaleString("en-PH")}
            </p>
            <p className="text-gray-500 mb-1">{monetaryRecords.filter(r => !r.isArchived).length} monetary donations</p>
            <p className="text-gray-500 mb-1">{totalNonMonetary} non-monetary contributions</p>
            <p className="text-red-600 mb-2">₱{totalCashouts.toLocaleString("en-PH")} cashouts</p>
            <p className="text-green-700 font-semibold text-lg">Net: ₱{netTotal.toLocaleString("en-PH")}</p>

            {/* Mini Monthly Trend Chart */}
            {monthlyData.length > 0 && (
              <div className="w-full h-20 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <Bar dataKey="net" fill={themeColor} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Summary Table */}
      <Card className="max-w-5xl mx-auto mb-14 border-none shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl hover:shadow-xl transition-all duration-300">
        <CardHeader className="border-b border-gray-100 py-6 bg-linear-to-r from-primary/5 to-transparent text-center">
          <CardTitle className="text-2xl font-semibold text-gray-800">Monthly Summary</CardTitle>
          <CardDescription className="text-gray-500">
            Contributions and cashouts per month.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto mt-4">
          <table className="w-full text-sm border-collapse rounded-lg overflow-hidden">
            <thead style={{ backgroundColor: themeColor, color: "white" }}>
              <tr>
                <th className="text-left p-3">Month</th>
                <th className="text-right p-3">Monetary (₱)</th>
                <th className="text-right p-3">Non-Monetary</th>
                <th className="text-right p-3">Cashouts (₱)</th>
                <th className="text-right p-3">Net Total</th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.length > 0 ? monthlyData.map((row, i) => (
                <tr key={row.month} className={`border-t border-gray-200 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition`}>
                  <td className="p-3 font-medium text-gray-700">{row.month}</td>
                  <td className="p-3 text-right text-gray-700">₱{row.monetary.toLocaleString()}</td>
                  <td className="p-3 text-right text-gray-700">{row.nonMonetary}</td>
                  <td className="p-3 text-right text-red-600">₱{row.cashout.toLocaleString()}</td>
                  <td className="p-3 text-right text-green-700 font-semibold">₱{row.net.toLocaleString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500 italic">
                    No records available for this period
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Yearly Summary Table */}
      <Card className="max-w-5xl mx-auto border-none shadow-lg bg-white/90 backdrop-blur-sm rounded-2xl hover:shadow-xl transition-all duration-300">
        <CardHeader className="border-b border-gray-100 py-6 bg-linear-to-r from-primary/5 to-transparent text-center">
          <CardTitle className="text-2xl font-semibold text-gray-800">Yearly Summary</CardTitle>
          <CardDescription className="text-gray-500">
            Contributions and cashouts per year.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto mt-4">
          <table className="w-full text-sm border-collapse rounded-lg overflow-hidden">
            <thead style={{ backgroundColor: themeColor, color: "white" }}>
              <tr>
                <th className="text-left p-3">Year</th>
                <th className="text-right p-3">Monetary (₱)</th>
                <th className="text-right p-3">Non-Monetary</th>
                <th className="text-right p-3">Cashouts (₱)</th>
                <th className="text-right p-3">Net Total</th>
              </tr>
            </thead>
            <tbody>
              {yearlyData.length > 0 ? yearlyData.map((row, i) => (
                <tr key={row.year} className={`border-t border-gray-200 ${i % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100 transition`}>
                  <td className="p-3 font-medium text-gray-700">{row.year}</td>
                  <td className="p-3 text-right text-gray-700">₱{row.monetary.toLocaleString()}</td>
                  <td className="p-3 text-right text-gray-700">{row.nonMonetary}</td>
                  <td className="p-3 text-right text-red-600">₱{row.cashout.toLocaleString()}</td>
                  <td className="p-3 text-right text-green-700 font-semibold">₱{row.net.toLocaleString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-500 italic">
                    No records available for this year
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </section>
  );
};
