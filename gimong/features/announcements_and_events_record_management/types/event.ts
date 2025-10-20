export type ID = string;
export type ISODateString = string;

export type EventStatus = "upcoming" | "ongoing" | "past";

export interface EventRecord {
  id: ID;
  type: "event";
  title: string;
  description: string;
  imageUrl: string;
  venue: string;
  link?: string;
  startDate: ISODateString;
  startTime: string;
  endDate?: ISODateString;
  endTime?: string;
  status: EventStatus;
  isPinned?: boolean;

  dateCreated: ISODateString;
  dateUpdated?: ISODateString;
  isArchived: boolean;
  dateArchived?: ISODateString;
}
