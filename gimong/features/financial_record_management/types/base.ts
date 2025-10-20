export type ID = string;
export type ISODateString = string;

export interface BaseMeta {
  dateCreated: ISODateString;
  dateUpdated?: ISODateString;
  isArchived: boolean;
  dateArchived?: ISODateString;
}
