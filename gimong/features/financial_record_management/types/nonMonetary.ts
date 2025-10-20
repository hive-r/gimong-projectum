import { BaseMeta, ID } from "./base";

export type NonMonetaryType = "goods" | "services" | "equipment" | "other";

export type NonMonetaryDestination = "church" | "orphanage" | "school" | "community" | "other";

export interface NonMonetaryRecord extends BaseMeta {
  estimatedValue: number;
  id: ID;
  fullName: string;
  donationType: NonMonetaryType;
  description: string;
  donationDestination: NonMonetaryDestination;
  status?: "pending" | "reported";
   customDonationType?: string; // add this
  customDestination?: string;
}

export type NonMonetaryReport = {
  recordId: string;
  id: ID;
  description: string;
  submittedBy: string;
  files: string[];
  isArchived: boolean;
  dateCreated?: string;
};
