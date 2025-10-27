import { NextResponse } from "next/server";
import { getAnnouncements, getEvents } from "@/features/announcements_and_events_record_management/service";
import {
  getMonetaryRecords,
  getNonMonetaryRecords,
  getCashoutReports,
  getCashoutRecords,
} from "@/features/financial_record_management/service";
import { getInventoryItems } from "@/features/inventory_management/service";

export async function GET() {
  try {
    const [
      announcements,
      events,
      monetary,
      nonMonetary,
      cashouts,
      cashoutRecords,
      resources,
    ] = await Promise.all([
      getAnnouncements(),
      getEvents(),
      getMonetaryRecords(),
      getNonMonetaryRecords(),
      getCashoutReports(),
      getCashoutRecords(),
      getInventoryItems(), 
    ]);

    const activeMonetary = monetary.filter((m) => !m.isArchived);
    const activeNonMonetary = nonMonetary.filter((n) => !n.isArchived);
    const activeCashouts = cashouts.filter((c) => !c.isArchived);
    const activeCashoutRecords = cashoutRecords.filter((r) => !r.isArchived);
    const activeResources = resources.filter((r) => !r.isArchived);

    const totalMonetaryAmount = activeMonetary.reduce(
      (sum, m) => sum + (Number(m.amount) || 0),
      0
    );

    const totalNonMonetaryCount = activeNonMonetary.length;

    const totalCashouts = activeCashouts.reduce((sum, c) => {
      const record = activeCashoutRecords.find((r) => r.id === c.cashoutId);
      return sum + (Number(record?.amount) || 0);
    }, 0);

    const remainingBalance = totalMonetaryAmount - totalCashouts;

    const monetaryByType = activeMonetary.reduce<Record<string, number>>(
      (acc, m) => {
        const type = m.donationType || "Unknown";
        acc[type] = (acc[type] || 0) + (Number(m.amount) || 0);
        return acc;
      },
      {}
    );

    return NextResponse.json(
      {
        source: "gimong-chatbase-feed",
        timestamp: new Date().toISOString(),
        data: {
          announcements: announcements
            .filter((a) => !a.isArchived)
            .map((a) => ({
              title: a.title,
              description: a.description ?? "",
              date: a.dateCreated,
            })),

          events: events
            .filter((e) => !e.isArchived)
            .map((e) => ({
              title: e.title,
              description: e.description ?? "",
              date: `${e.startDate} – ${e.endDate}`,
              time: `${e.startTime} – ${e.endTime}`,
              venue: e.venue,
              status: e.status,
            })),

          financial: {
            summary: {
              totalMonetaryAmount,
              totalNonMonetaryCount,
              totalCashouts,
              remainingBalance,
              breakdownByType: monetaryByType,
            },
          },

          resources: activeResources.map((r) => ({
            title: r.name,
            description: r.description ?? "",
            category: r.category,
            uploadedAt: r.uploadedAt,
            mimeType: r.mimeType ?? "unknown",
          })),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Chatbase Feed Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data for Chatbase" },
      { status: 500 }
    );
  }
}
