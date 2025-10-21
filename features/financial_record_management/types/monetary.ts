import { BaseMeta, ID } from "./base";

export type DonationType = "offering" | "tithe" | "pledge" | "mission fund" | "barnabas fund" | "church building and lot" | "praise and worship" | "vacation bible school" | "other";
export type DonationSource = "cash" | "online" | "bank-transfer" | "check" | "other";
export type Currency = "PHP" | "USD" | "EUR" | "JPY" | "OTHER";

export interface MonetaryRecord extends BaseMeta {
  id: ID;
  fullName: string;
  donationType: DonationType;
  donationSource: DonationSource;
  amount: number;
  currency: Currency;
  status?: "pending" | "reported";
}
