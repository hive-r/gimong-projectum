import { EventStatus } from "@/features/announcements_and_events_record_management/types/event";
import { ISODateString } from "@/features/announcements_and_events_record_management/types/base";

export function computeEventStatus(
  startDate: ISODateString,
  startTime: string,
  endDate?: ISODateString,
  endTime?: string
): EventStatus {
  const now = new Date();

  const start = new Date(`${startDate}T${startTime}`);
  const end = endDate
    ? new Date(`${endDate}T${endTime ?? "23:59:59"}`)
    : new Date(`${startDate}T${endTime ?? "23:59:59"}`);

  if (now < start) return "upcoming";
  if (now >= start && now <= end) return "ongoing";
  return "past";
}
