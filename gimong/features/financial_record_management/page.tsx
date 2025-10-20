"use client";

import { FinancialPublicSummary } from "./components/financialPublicSummary";
import { FinancialStatistics } from "./components/financialStatistics";
import { FinancialForm } from "./components/form";
import { MonetaryNonMonetaryList } from "./components/listFinance";

export const FinancePage: React.FC = () => {    
  return (
    <main className="w-full">
        <FinancialForm />
        <MonetaryNonMonetaryList />
        <FinancialStatistics />
        <FinancialPublicSummary />
    </main>
  );
};
