import { NextResponse } from "next/server";
import { getAnnouncements, getEvents } from "@/features/announcements_and_events_record_management/service"; // adjust path if needed

export async function GET() {
  try {
    const [announcements, events] = await Promise.all([
      getAnnouncements(),
      getEvents(),
    ]);

    // You can trim or simplify fields if you want to reduce payload size
    return NextResponse.json(
      {
        source: "gimong-chatbase-feed",
        timestamp: new Date().toISOString(),
        announcements: announcements
          .filter((a) => !a.isArchived)
          .map((a) => ({
            id: a.id,
            title: a.title,
            content: a.description ?? "",
            dateCreated: a.dateCreated,
          })),
        events: events
          .filter((e) => !e.isArchived)
          .map((e) => ({
            id: e.id,
            name: e.title,
            description: e.description ?? "",
            startDate: e.startDate,
            endDate: e.endDate,
            status: e.status,
          })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Chatbase Feed Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch announcements and events" },
      { status: 500 }
    );
  }
}
