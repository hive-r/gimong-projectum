export type ID = string;
export type ISODateString = string;

export interface LiveStreamRecord {
  id: ID;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  date?: ISODateString;
  time?: string;
  isDisplay: boolean;
  isArchived?: boolean;
  dateCreated: ISODateString;
  dateUpdated?: ISODateString;
  dateArchived?: ISODateString;
}
