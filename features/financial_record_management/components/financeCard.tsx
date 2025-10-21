"use client";

import React from "react";
import { CalendarDaysIcon, Package } from "lucide-react";
import { MonetaryRecord } from "../types/monetary";
import { NonMonetaryRecord } from "../types/nonMonetary";

type RecordType = MonetaryRecord | NonMonetaryRecord;

interface FinanceCardProps {
  record: RecordType;
}

export const FinanceCard: React.FC<FinanceCardProps> = ({ record }) => {
  const formatDate = (dateStr?: string) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "—";

  const toSentenceCase = (text: string | number | undefined) => {
    if (!text) return "-";
    const str = String(text).toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const isMonetary = "amount" in record;

  return (
    <div className={`relative group block bg-teal-50 border-b-8 border-b-teal-200 hover:border-b-teal-500 p-6 shadow-sm hover:shadow-md transition-all`}>
      {/* Header */}
      <div className="text-center space-y-2">
        {isMonetary ? (
          <span className="mx-auto text-4xl text-primary font-bold">₱</span>
        ) : (
          <Package className="mx-auto h-10 w-10 text-primary" />
        )}
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          {record.fullName}
        </h2>
      </div>

      {/* Details */}
        <div className="mt-4 space-y-3 text-gray-800">
          {/* Donation Type */}
          <div className="flex items-center gap-3">
            <span className="font-bold uppercase text-primary">{toSentenceCase(record.donationType)}</span>
          </div>

        {/* Amount / Description */}
        <div className="flex items-center gap-3">
          <span className="font-medium">
            {isMonetary
              ? `Amount: ₱${record.amount}`
              : `Description: ${record.description || "-"}`}
          </span>
        </div>

        {/* Date Created */}
        <div className="flex items-center gap-3">
          <CalendarDaysIcon className="h-5 w-5 text-primary" />
          <span className="font-medium">Created: {formatDate(record.dateCreated)}</span>
        </div>

        {/* Archived Status */}
        {record.isArchived && (
          <div className="text-red-600 font-semibold">Archived</div>
        )}
      </div>
    </div>
  );
};
