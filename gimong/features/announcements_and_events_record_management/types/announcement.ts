export type ID = string;
export type ISODateString = string;

export interface AnnouncementRecord {
  id: ID;
  type: "announcement";
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
  isPinned?: boolean;
  
  dateCreated: ISODateString;
  dateUpdated?: ISODateString;
  isArchived: boolean;
  dateArchived?: ISODateString;
}