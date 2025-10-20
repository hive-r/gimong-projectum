"use client";

import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { NonMonetaryRecord } from "../types/nonMonetary";
import { updateNonMonetaryRecord } from "../service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  record: NonMonetaryRecord;
  onClose: () => void;
}

type FormInput = Omit<NonMonetaryRecord, "id" | "dateCreated" | "type" | "isArchived" | "dateArchived">;

export const NonMonetaryEdit: React.FC<Props> = ({ record, onClose }) => {
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
      await updateNonMonetaryRecord(record.id, data);
      toast.success("Non-monetary record updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update non-monetary record.");
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

      {/* Donation Type */}
      <div className="flex flex-col gap-1.5">
        <Label>Donation Type</Label>
        <Input {...register("donationType", { required: "Donation type is required" })} />
        {errors.donationType && <p className="text-red-500 text-sm">{errors.donationType.message}</p>}
      </div>

      {/* Destination */}
      <div className="flex flex-col gap-1.5">
        <Label>Donation Destination</Label>
        <Input {...register("donationDestination", { required: "Destination is required" })} />
        {errors.donationDestination && <p className="text-red-500 text-sm">{errors.donationDestination.message}</p>}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Label>Description</Label>
        <textarea
          {...register("description")}
          className="border rounded p-2 min-h-[80px]"
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};
