"use client";

import * as React from "react";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { MonetaryRecord, DonationType } from "../types/monetary";
import { createMonetaryRecord } from "../service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormInput = Omit<
  MonetaryRecord,
  "id" | "dateCreated" | "isArchived" | "dateArchived"
> & { customDonationType?: string };

export const MonetaryForm: React.FC = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInput>({
    defaultValues: {
      fullName: "",
      donationType: "offering",
      donationSource: "cash",
      currency: "PHP",
      amount: undefined,
      customDonationType: "",
    },
  });

  // Watch donationType to show custom input
  const selectedDonationType = useWatch({
    control,
    name: "donationType",
  });

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    try {
      const payload = {
        ...data,
        amount: Number(data.amount),
        donationType: (
          data.donationType === "other"
            ? (data.customDonationType || "Other")
            : data.donationType
        ) as DonationType,
      };
      await createMonetaryRecord(payload);
      toast.success("Monetary record created successfully!");
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create monetary record.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 border shadow bg-white max-w-4xl mx-auto"
    >
      <h2 className="text-xl font-semibold">Add Monetary Record</h2>

      {/* Full Name */}
      <div className="flex flex-col gap-1.5">
        <Label>Donor&apos;s Full Name or Description</Label>
        <Input
          placeholder="Enter full name"
          {...register("fullName", { required: "Full name is required" })}
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm">{errors.fullName.message}</p>
        )}
      </div>

      {/* Donation Type & Donation Source */}
      <div className="grid grid-cols-2 gap-4">
        {/* Donation Type */}
        <div className="flex flex-col gap-1.5">
          <Label>Donation Type</Label>
          <Controller
            name="donationType"
            control={control}
            rules={{ required: "Donation type is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full justify-between font-normal">
                  <SelectValue placeholder="Select donation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Types</SelectLabel>
                    <SelectItem value="offering">Offering</SelectItem>
                    <SelectItem value="tithe">Tithe</SelectItem>
                    <SelectItem value="pledge">Pledge</SelectItem>
                    <SelectItem value="mission fund">Mission Fund</SelectItem>
                    <SelectItem value="barnabas fund">Barnabas Fund</SelectItem>
                    <SelectItem value="church building and lot">Church Building and Lot</SelectItem>
                    <SelectItem value="praise and worship">Praise and Worship</SelectItem>
                    <SelectItem value="vacation bible school">Vacation Bible School</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.donationType && (
            <p className="text-red-500 text-sm">{errors.donationType.message}</p>
          )}

          {/* Custom Donation Type Input */}
          {selectedDonationType === "other" && (
            <Input
              placeholder="Enter custom donation type"
              {...register("customDonationType", {
                required: "Custom donation type is required",
              })}
            />
          )}
        </div>

        {/* Donation Source */}
        <div className="flex flex-col gap-1.5">
          <Label>Donation Source</Label>
          <Controller
            name="donationSource"
            control={control}
            rules={{ required: "Donation source is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full justify-between font-normal">
                  <SelectValue placeholder="Select donation source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Sources</SelectLabel>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.donationSource && (
            <p className="text-red-500 text-sm">{errors.donationSource.message}</p>
          )}
        </div>
      </div>

      {/* Amount & Currency */}
      <div className="grid grid-cols-10 gap-4">
        {/* Amount 70% */}
        <div className="col-span-7 flex flex-col gap-1.5">
          <Label>Amount</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="Enter donation amount"
            {...register("amount", {
              required: "Amount is required",
              min: { value: 0.01, message: "Amount must be greater than zero" },
            })}
          />
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount.message}</p>
          )}
        </div>

        {/* Currency 30% */}
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

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Add Monetary Record"}
      </Button>
    </form>
  );
};
