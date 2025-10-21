"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { toast } from "sonner";
import {
  createCashoutRecord,
  listenToMonetaryRecords,
  listenToCashoutRecords,
} from "../service";
import { MonetaryRecord } from "../types/monetary";
import { CashoutRecord } from "../types/cashout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/components/ui/select";

type FormInput = Omit<
  CashoutRecord,
  "id" | "dateCreated" | "isArchived" | "dateArchived"
>;

export const CashoutForm: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInput>({
    defaultValues: {
      sourceFund: "",
      amount: undefined,
      currency: "PHP",
      purpose: "",
      requestedBy: "",
      approvedBy: "",
    },
  });

  const [fundSources, setFundSources] = useState<string[]>([]);
  const [monetaryRecords, setMonetaryRecords] = useState<MonetaryRecord[]>([]);
  const [cashoutRecords, setCashoutRecords] = useState<CashoutRecord[]>([]);

  //
  // ─── LOAD DATA ──────────────────────────────────────────────
  //
  useEffect(() => {
    const unsubMonetary = listenToMonetaryRecords((records) => {
      setMonetaryRecords(records);
      const uniqueFunds = Array.from(new Set(records.map((r) => r.donationType)));
      setFundSources(uniqueFunds);
    });

    const unsubCashout = listenToCashoutRecords((records) => {
      setCashoutRecords(records);
    });

    return () => {
      unsubMonetary();
      unsubCashout();
    };
  }, []);

  //
  // ─── CALCULATE AVAILABLE BALANCE ────────────────────────────
  //
  const fundBalances = useMemo(() => {
    const balances: Record<string, number> = {};

    for (const rec of monetaryRecords) {
      balances[rec.donationType] = (balances[rec.donationType] || 0) + Number(rec.amount || 0);
    }

    for (const co of cashoutRecords) {
      balances[co.sourceFund] = (balances[co.sourceFund] || 0) - Number(co.amount || 0);
    }

    return balances;
  }, [monetaryRecords, cashoutRecords]);

  const selectedFund = useWatch({ control, name: "sourceFund" });
  const availableAmount = selectedFund ? fundBalances[selectedFund] ?? 0 : 0;

  //
  // ─── SUBMIT HANDLER ─────────────────────────────────────────
  //
  const onSubmit = async (data: FormInput) => {
    const amountNum = Number(data.amount);

    if (amountNum > availableAmount) {
      toast.error("Insufficient funds in selected source!");
      return;
    }

    try {
      await createCashoutRecord({
        ...data,
        amount: amountNum,
        status: "pending",
      });
      toast.success("Cashout record created successfully!");
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create cashout record.");
    }
  };

  //
  // ─── RENDER ────────────────────────────────────────────────
  //
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 border shadow bg-white max-w-4xl mx-auto"
    >
      <h2 className="text-xl font-semibold">Allocate Church Funds</h2>

      {/* Source Fund */}
      <div className="flex flex-col gap-1.5">
        <Label>Source Fund</Label>
        <Controller
          name="sourceFund"
          control={control}
          rules={{ required: "Source fund is required" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full justify-between font-normal">
                <SelectValue placeholder="Select fund source" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Available Funds</SelectLabel>
                  {fundSources.length > 0 ? (
                    fundSources.map((fund) => (
                      <SelectItem key={fund} value={fund}>
                        {fund}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="none">
                      No funds available
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.sourceFund && (
          <p className="text-red-500 text-sm">{errors.sourceFund.message}</p>
        )}
        {selectedFund && (
          <p
            className={`text-sm mt-1 ${
              availableAmount <= 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            Available Balance: ₱{availableAmount.toLocaleString()}
          </p>
        )}
      </div>

      {/* Purpose */}
      <div className="flex flex-col gap-1.5">
        <Label>Purpose of Cashout</Label>
        <Input
          placeholder="Enter purpose (e.g. Purchase Sunday school materials)"
          {...register("purpose", { required: "Purpose is required" })}
        />
        {errors.purpose && (
          <p className="text-red-500 text-sm">{errors.purpose.message}</p>
        )}
      </div>

      {/* Amount + Currency */}
      <div className="grid grid-cols-10 gap-4">
        <div className="col-span-7 flex flex-col gap-1.5">
          <Label>Amount</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="Enter requested amount"
            {...register("amount", {
              required: "Amount is required",
              min: { value: 0.01, message: "Amount must be greater than zero" },
            })}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount.message}</p>
          )}
        </div>

        <div className="col-span-3 flex flex-col gap-1.5">
          <Label>Currency</Label>
          <Controller
            name="currency"
            control={control}
            rules={{ required: "Currency is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full justify-between font-normal">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Currencies</SelectLabel>
                    <SelectItem value="PHP">PHP</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="JPY">JPY</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.currency && (
            <p className="text-red-500 text-sm">{errors.currency.message}</p>
          )}
        </div>
      </div>

      {/* Requested By */}
      <div className="flex flex-col gap-1.5">
        <Label>Requested By</Label>
        <Input
          placeholder="Enter name of requester"
          {...register("requestedBy", { required: "Requester name is required" })}
        />
        {errors.requestedBy && (
          <p className="text-red-500 text-sm">{errors.requestedBy.message}</p>
        )}
      </div>

      {/* Approved By */}
      <div className="flex flex-col gap-1.5">
        <Label>Approved By (Authorized Person)</Label>
        <Input
          placeholder="Enter name of approver"
          {...register("approvedBy", { required: "Approver name is required" })}
        />
        {errors.approvedBy && (
          <p className="text-red-500 text-sm">{errors.approvedBy.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Submit Cashout Request"}
      </Button>
    </form>
  );
};
