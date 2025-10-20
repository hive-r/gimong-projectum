"use client";

import { FinancialPublicSummary } from "@/features/financial_record_management/components/financialPublicSummary";
import FinanceHero from "./finance_components/financeHero";
import { FinancialStatisticsPublic } from "@/features/financial_record_management/components/financialStatisticPublic";

export default function FinanceModule() {
  return (
    <main className="w-full">
        <FinanceHero />
        <FinancialStatisticsPublic />
        <FinancialPublicSummary />
    </main>
  );
}
