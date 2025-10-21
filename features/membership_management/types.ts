export type ID = string;
export type ISODateString = string;

export type Sex = "male" | "female";
export type MaritalStatus = "single" | "married" | "divorced" | "widowed";
export type MembershipStatus = "active" | "inactive";

export interface MembershipProfile {
  id: ID;
  firstName: string;
  middleName?: string; 
  lastName: string;
  dateOfBirth: ISODateString;
  sex: Sex;

  address: {
    barangay: string;
    municipality: string;
    province: string;
    country: string;
  };

  contactNumber: string;
  email?: string;
  maritalStatus: MaritalStatus;
  dateBaptized?: ISODateString;

  membershipStatus: MembershipStatus;

  isArchived: boolean;
  isPinned?: boolean;

  dateCreated: ISODateString;
  dateUpdated?: ISODateString;
  dateArchived?: ISODateString;

  readonly age?: number;
}
