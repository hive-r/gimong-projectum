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
} from "../service";
import { MonetaryRecord } from "../types/monetary";
import { CashoutRecord } from "../types/cashout";
import { NonMonetaryRecord } from "../types/nonMonetary";

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
  const [nonMonetaryRecords, setNonMonetaryRecords] = useState<NonMonetaryRecord[]>([]);

  useEffect(() => {
    const unsubMonetary = listenToMonetaryRecords(setMonetaryRecords);
    const unsubCashouts = listenToCashoutRecords(setCashouts);
    const unsubNonMonetary = listenToNonMonetaryRecords(setNonMonetaryRecords);

    return () => {
      unsubMonetary();
      unsubCashouts();
      unsubNonMonetary();
    };
  }, []);

  const activeMonetary = monetaryRecords.filter(
    (r) => !r.isArchived && typeof r.amount === "number"
  );
  const activeNonMonetary = nonMonetaryRecords.filter((r) => !r.isArchived);

  const totalMonetary = activeMonetary.reduce((sum, r) => sum + r.amount, 0);
  const totalCashouts = cashouts.reduce((sum, c) => sum + (c.amount || 0), 0);
  const netDonations = totalMonetary - totalCashouts;
  const totalNonMonetary = activeNonMonetary.length;

  const primaryColor = "hsl(180, 61%, 20%)";
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  // 1️⃣ Total donations by type
  const donationsByType = useMemo(() => {
    const grouped: Record<string, number> = {};
    activeMonetary.forEach((d) => {
      grouped[d.donationType] = (grouped[d.donationType] || 0) + d.amount;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [activeMonetary]);

  // 2️⃣ Net donations by type (donations - cashouts)
  const netDonationsByType = useMemo(() => {
    const donationMap: Record<string, number> = {};
    activeMonetary.forEach((d) => {
      donationMap[d.donationType] =
        (donationMap[d.donationType] || 0) + d.amount;
    });

    const cashoutMap: Record<string, number> = {};
    cashouts.forEach((c) => {
      cashoutMap[c.sourceFund] = (cashoutMap[c.sourceFund] || 0) + c.amount;
    });

    return Object.entries(donationMap).map(([type, amount]) => ({
      name: type,
      value: amount - (cashoutMap[type] || 0),
    }));
  }, [activeMonetary, cashouts]);

  // 3️⃣ Cashouts by source fund
  const cashoutsBySource = useMemo(() => {
    const grouped: Record<string, number> = {};
    cashouts.forEach((c) => {
      grouped[c.sourceFund] = (grouped[c.sourceFund] || 0) + c.amount;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [cashouts]);

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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1
        className="text-4xl md:text-5xl font-bold mb-6 text-center uppercase"
        style={{ color: primaryColor }}
      >
        Financial Statistics
      </h1>

      <div className="flex w-full max-w-5xl mx-auto flex-col gap-6 md:flex-row">
        {/* Total Monetary */}
        <Card
          className="flex-1 rounded-none border-t-4"
          style={{ borderColor: primaryColor }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <DollarSignIcon className="h-8 w-8" color={primaryColor} />
              Total Monetary Donations
            </CardTitle>
            <CardDescription>
              Sum of all active monetary donations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-6xl font-bold" style={{ color: primaryColor }}>
              ₱
              {totalMonetary.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
              })}
            </p>
            <p className="text-gray-500">{activeMonetary.length} donations</p>
          </CardContent>
        </Card>

        {/* Total Cashouts */}
        <Card
          className="flex-1 rounded-none border-t-4"
          style={{ borderColor: primaryColor }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <CoinsIcon className="h-8 w-8" color={primaryColor} />
              Total Monetary Cashouts
            </CardTitle>
            <CardDescription>Sum of all cashouts.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-6xl font-bold" style={{ color: primaryColor }}>
              ₱
              {totalCashouts.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
              })}
            </p>
          </CardContent>
        </Card>

        {/* Total Non-Monetary Donations */}
        <Card
          className="flex-1 rounded-none border-t-4"
          style={{ borderColor: primaryColor }}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <GiftIcon className="h-8 w-8" color={primaryColor} />
              Non-Monetary Donations
            </CardTitle>
            <CardDescription>
              Count of all non-monetary donations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-6xl font-bold" style={{ color: primaryColor }}>
              {totalNonMonetary.toLocaleString()}
            </p>
            <p className="text-gray-500">
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
