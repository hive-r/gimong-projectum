"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  DollarSignIcon,
  CoinsIcon,
  GiftIcon,
  PieChartIcon,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  listenToMonetaryRecords,
  listenToCashoutRecords,
  listenToNonMonetaryRecords,
  listenToCashoutReports, // ✅ added
} from "../service";
import { MonetaryRecord } from "../types/monetary";
import { CashoutRecord } from "../types/cashout";
import { NonMonetaryRecord } from "../types/nonMonetary";
import { CashoutReport } from "../types/cashout"; // ✅ added

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
  Legend,
} from "recharts";

export const FinancialStatistics: React.FC = () => {
  const [monetaryRecords, setMonetaryRecords] = useState<MonetaryRecord[]>([]);
  const [cashouts, setCashouts] = useState<CashoutRecord[]>([]);
  const [cashoutReports, setCashoutReports] = useState<CashoutReport[]>([]); // ✅ added
  const [nonMonetaryRecords, setNonMonetaryRecords] = useState<NonMonetaryRecord[]>([]);

  useEffect(() => {
    const unsubMonetary = listenToMonetaryRecords(setMonetaryRecords);
    const unsubCashouts = listenToCashoutRecords(setCashouts);
    const unsubNonMonetary = listenToNonMonetaryRecords(setNonMonetaryRecords);
    const unsubReports = listenToCashoutReports(setCashoutReports); // ✅ added

    return () => {
      unsubMonetary();
      unsubCashouts();
      unsubNonMonetary();
      unsubReports();
    };
  }, []);

  const primaryColor = "hsl(180, 61%, 20%)";
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // ✅ Filter active records
  const activeMonetary = monetaryRecords.filter(
    (r) => !r.isArchived && typeof r.amount === "number"
  );
  const activeNonMonetary = nonMonetaryRecords.filter((r) => !r.isArchived);

  // ✅ Filter reported cashouts (using cashoutReports)
  const reportedCashouts = useMemo(() => {
    const reportedIds = new Set(
      cashoutReports.filter((r) => !r.isArchived).map((r) => r.cashoutId)
    );
    return cashouts.filter((c) => reportedIds.has(c.id) && !c.isArchived);
  }, [cashoutReports, cashouts]);

  // ✅ Totals
  const totalMonetary = activeMonetary.reduce((sum, r) => sum + r.amount, 0);
  const totalCashouts = reportedCashouts.reduce((sum, c) => sum + (c.amount || 0), 0); // only reported
  const netDonations = totalMonetary - totalCashouts;
  const totalNonMonetary = activeNonMonetary.length;

  // 1️⃣ Donations by type
  const donationsByType = useMemo(() => {
    const grouped: Record<string, number> = {};
    activeMonetary.forEach((d) => {
      grouped[d.donationType] = (grouped[d.donationType] || 0) + d.amount;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [activeMonetary]);

  // 2️⃣ Net donations by type (subtract reported cashouts)
  const netDonationsByType = useMemo(() => {
    const donationMap: Record<string, number> = {};
    activeMonetary.forEach((d) => {
      donationMap[d.donationType] =
        (donationMap[d.donationType] || 0) + d.amount;
    });

    const cashoutMap: Record<string, number> = {};
    reportedCashouts.forEach((c) => {
      if (!c.sourceFund) return;
      cashoutMap[c.sourceFund] =
        (cashoutMap[c.sourceFund] || 0) + (c.amount || 0);
    });

    return Object.entries(donationMap).map(([type, amount]) => ({
      name: type,
      value: amount - (cashoutMap[type] || 0),
    }));
  }, [activeMonetary, reportedCashouts]);

  // 3️⃣ Cashouts by source fund (only reported)
  const cashoutsBySource = useMemo(() => {
    const grouped: Record<string, number> = {};
    reportedCashouts.forEach((c) => {
      if (!c.sourceFund) return;
      grouped[c.sourceFund] = (grouped[c.sourceFund] || 0) + (c.amount || 0);
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [reportedCashouts]);

  // 4️⃣ Cashouts status (pending vs reported)
  const cashoutStatusData = useMemo(() => {
    const pending = cashouts.filter((c) => c.status === "pending").length;
    const reported = cashouts.filter((c) => c.status === "reported").length;
    return [
      { name: "Pending", value: pending },
      { name: "Reported", value: reported },
    ];
  }, [cashouts]);

  // 5️⃣ Non-monetary status (pending vs reported)
  const nonMonetaryStatusData = useMemo(() => {
    const pending = nonMonetaryRecords.filter(
      (r) => r.status === "pending"
    ).length;
    const reported = nonMonetaryRecords.filter(
      (r) => r.status === "reported"
    ).length;
    return [
      { name: "Pending", value: pending },
      { name: "Reported", value: reported },
    ];
  }, [nonMonetaryRecords]);

  return (
   <div className="p-6 sm:p-8 md:p-12 bg-gray-50 min-h-screen">
  <h1
    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-10 text-center uppercase tracking-wide leading-tight"
    style={{ color: primaryColor }}
  >
    Financial Statistics
  </h1>

  <div className="w-full max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {/* Total Monetary Donations */}
    <Card
      className="rounded-none border-t-4 shadow-sm hover:shadow-md transition-shadow duration-300"
      style={{ borderColor: primaryColor }}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">
          <DollarSignIcon
            className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
            color={primaryColor}
          />
          Total Monetary Donations
        </CardTitle>
        <CardDescription className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg">
          Sum of all monetary donations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold wrap-break-word"
          style={{ color: primaryColor }}
        >
          ₱
          {totalMonetary.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
          })}
        </p>
        <p className="text-gray-500 text-xs sm:text-sm md:text-base">
          {activeMonetary.length} donations
        </p>
      </CardContent>
    </Card>

    {/* Total Cashouts */}
    <Card
      className="rounded-none border-t-4 shadow-sm hover:shadow-md transition-shadow duration-300"
      style={{ borderColor: primaryColor }}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">
          <CoinsIcon
            className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
            color={primaryColor}
          />
          Total Monetary Cashouts
        </CardTitle>
        <CardDescription className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg">
          Sum of all Monetary cashouts.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold wrap-break-word"
          style={{ color: primaryColor }}
        >
          ₱
          {totalCashouts.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
          })}
        </p>
      </CardContent>
    </Card>

    {/* Non-Monetary Donations */}
    <Card
      className="rounded-none border-t-4 shadow-sm hover:shadow-md transition-shadow duration-300"
      style={{ borderColor: primaryColor }}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">
          <GiftIcon
            className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
            color={primaryColor}
          />
          Non-Monetary Donations
        </CardTitle>
        <CardDescription className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg">
          Count of non-monetary donations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold wrap-break-word"
          style={{ color: primaryColor }}
        >
          {totalNonMonetary.toLocaleString()}
        </p>
        <p className="text-gray-500 text-xs sm:text-sm md:text-base">
          {activeNonMonetary.length} items donated
        </p>
      </CardContent>
    </Card>
  </div>

      {/* Net Donations */}
      <Card
        className="mt-8 max-w-5xl mx-auto rounded-xl border-t-8 shadow-lg"
        style={{ borderColor: primaryColor, background: "#ffffff" }}
      >
        <CardHeader className="text-center">
          <CardTitle
            className="text-4xl md:text-5xl font-extrabold"
            style={{ color: primaryColor }}
          >
            Net Donations
          </CardTitle>
          <CardDescription className="text-lg md:text-xl mt-2 text-gray-600">
            Total donations minus all cashouts
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          <p
            className="text-6xl md:text-7xl font-extrabold text-center"
            style={{
              color: primaryColor,
              textShadow: "2px 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            ₱
            {netDonations.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
            })}
          </p>
        </CardContent>
      </Card>

      {/* Bar Charts */}
      <Card
        className="mt-8 max-w-5xl mx-auto rounded-none border-t-4"
        style={{ borderColor: primaryColor }}
      >
        <CardHeader>
          <CardTitle className="text-3xl" style={{ color: primaryColor }}>
            Total Donations by Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={donationsByType}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `₱${v.toLocaleString()}`} />
              <Tooltip formatter={(v) => `₱${v.toLocaleString()}`} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={primaryColor}>
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(v) => `₱${Number(v).toLocaleString()}`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Net Donations by Type */}
      <Card
        className="mt-8 max-w-5xl mx-auto rounded-none border-t-4"
        style={{ borderColor: primaryColor }}
      >
        <CardHeader>
          <CardTitle className="text-3xl" style={{ color: primaryColor }}>
            Net Donations by Type (After Cashouts)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={netDonationsByType}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `₱${v.toLocaleString()}`} />
              <Tooltip />
              <Bar
                dataKey="value"
                radius={[6, 6, 0, 0]}
                fill="hsl(173, 80%, 40%)"
              >
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(v) => `₱${Number(v).toLocaleString()}`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cashouts by Source Fund */}
      <Card
        className="mt-8 max-w-5xl mx-auto rounded-none border-t-4"
        style={{ borderColor: primaryColor }}
      >
        <CardHeader>
          <CardTitle className="text-3xl" style={{ color: primaryColor }}>
            Cashouts by Source Fund
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={cashoutsBySource}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => `₱${v.toLocaleString()}`} />
              <Tooltip formatter={(v) => `₱${v.toLocaleString()}`} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={primaryColor}>
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(v) => `₱${Number(v).toLocaleString()}`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

    {/* Pie Charts Section */}
<div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
  {/* Non-Monetary Status Pie */}
  <Card className="rounded-none border-t-4" style={{ borderColor: primaryColor }}>
    <CardHeader className="text-center">
      <CardTitle
        className="flex justify-center gap-2 text-2xl"
        style={{ color: primaryColor }}
      >
        <PieChartIcon /> Non-Monetary Status
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={nonMonetaryStatusData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {nonMonetaryStatusData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          {/* ✅ Add Tooltip */}
          <Tooltip
            formatter={(value: number, name: string) =>
              [`${value} records`, name]
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>

  {/* Cashouts Status Pie */}
  <Card className="rounded-none border-t-4" style={{ borderColor: primaryColor }}>
    <CardHeader className="text-center">
      <CardTitle
        className="flex justify-center gap-2 text-2xl"
        style={{ color: primaryColor }}
      >
        <PieChartIcon /> Cashouts Status
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={cashoutStatusData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {cashoutStatusData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          {/* ✅ Add Tooltip */}
          <Tooltip
            formatter={(value: number, name: string) =>
              [`${value} records`, name]
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
</div>

    </div>
  );
};
