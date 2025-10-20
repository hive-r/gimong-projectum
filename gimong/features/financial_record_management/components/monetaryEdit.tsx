"use client";

import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { MonetaryRecord } from "../types/monetary";
import { updateMonetaryRecord } from "../service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  record: MonetaryRecord;
  onClose: () => void;
}

type FormInput = Omit<MonetaryRecord, "id" | "dateCreated" | "type" | "isArchived" | "dateArchived">;

export const MonetaryEdit: React.FC<Props> = ({ record, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInput>({ defaultValues: record });

  React.useEffect(() => {
    reset(record);
  }, [record, reset]);

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    try {
      await updateMonetaryRecord(record.id, data);
      toast.success("Monetary record updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update monetary record.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      {/* Full Name */}
      <div className="flex flex-col gap-1.5">
        <Label>Full Name</Label>
        <Input {...register("fullName", { required: "Full name is required" })} />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
      </div>

      {/* Amount */}
      <div className="flex flex-col gap-1.5">
        <Label>Amount</Label>
        <Input
          type="number"
          step="0.01"
          {...register("amount", {
            required: "Amount is required",
            min: { value: 0.01, message: "Amount must be greater than 0" },
          })}
        />
        {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};
