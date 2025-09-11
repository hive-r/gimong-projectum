export type ID = string;
export type ISODateString = string;

export type DonationType = "tithe" | "offering" | "pledge" | "other";
export type DonationSource = "cash" | "online" | "bank-transfer" | "check" | "other";
export type Currency = "PHP" | "USD" | "EUR" | "JPY" | "OTHER";

export interface BaseMeta {
  dateCreated: ISODateString;
  dateUpdated?: ISODateString;
  isArchived: boolean;
  dateArchived?: ISODateString;
}

export interface FinancialRecord extends BaseMeta {
  id: ID;
  donationType: DonationType;
  amount: number;
  currency?: Currency; 
  fullName: string;
  donationSource?: DonationSource;
}
