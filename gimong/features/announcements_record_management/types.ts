export type AnnouncementType = "event" | "announcement";

export type ID = string;
export type ISODateString = string;

export type EventStatus = "upcoming" | "ongoing" | "past" | "archived";

export interface BaseMeta {
  dateCreated: ISODateString;
  dateUpdated?: ISODateString;
  isArchived: boolean;
  dateArchived?: ISODateString;
}

export interface EventRecord extends BaseMeta {
  id: ID;
  announcementType: AnnouncementType;
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
  startDate: ISODateString; 
  endDate?: ISODateString;
  startTime?: string; 
  endTime?: string;
  venue?: string;
  status?: EventStatus;
}
