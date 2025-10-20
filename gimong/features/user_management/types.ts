export type ID = string;
export type ISODateString = string;

export type UserRole = "media" | "pastor" | "finance";

export interface UserProfile {
  id: ID;
  fullName: string;
  email: string;
  contactNumber?: string;
  imageUrl?: string;

  role: UserRole;

  dateCreated: ISODateString;
  dateUpdated?: ISODateString;
  lastLogin?: ISODateString;
}
