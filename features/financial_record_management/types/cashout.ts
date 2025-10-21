import { BaseMeta, ID } from "./base";

export interface CashoutRecord extends BaseMeta {
  id: ID;
  sourceFund: string;
  amount: number;
  currency: "PHP" | "USD" | "EUR" | "JPY" | "OTHER";
  purpose: string;
  requestedBy: string;
  approvedBy: string;
  status: "pending" | "approved" | "reported";
}

export interface CashoutReport extends BaseMeta {
  id: ID;
  cashoutId: string; 
  description: string;
  files: string[]; 
  submittedBy: string;
}


