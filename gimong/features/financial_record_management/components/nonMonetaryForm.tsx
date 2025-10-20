"use client";

import * as React from "react";
import { useForm, SubmitHandler, Controller, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { NonMonetaryRecord } from "../types/nonMonetary";
import { createNonMonetaryRecord } from "../service";

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
  NonMonetaryRecord,
  "id" | "dateCreated" | "isArchived" | "dateArchived"
> & {
  customDonationType?: string;
  customDestination?: string;
};

export const NonMonetaryForm: React.FC = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInput>({
    defaultValues: {
      fullName: "",
      donationType: undefined,
      donationDestination: undefined,
      description: "",
      customDonationType: "",
      customDestination: "",
    },
  });

  const selectedDonationType = useWatch({ control, name: "donationType" });
  const selectedDestination = useWatch({ control, name: "donationDestination" });

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    try {
      const payload = {
        ...data,
        donationType:
          data.donationType === "other" ? data.customDonationType || "Other" : data.donationType,
        donationDestination:
          data.donationDestination === "other" ? data.customDestination || "Other" : data.donationDestination,
      };

      await createNonMonetaryRecord(payload as NonMonetaryRecord);
      toast.success("Non-monetary record created successfully!");
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create non-monetary record.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 border shadow bg-white max-w-4xl mx-auto"
    >
      <h2 className="text-xl font-semibold">Add Non-Monetary Record</h2>

      {/* Full Name */}
      <div className="flex flex-col gap-1.5">
        <Label>Full Name</Label>
        <Input
          placeholder="Enter full name"
          {...register("fullName", { required: "Full name is required" })}
        />
        {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message}</p>}
      </div>

      {/* Donation Type & Destination on one line */}
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
                    <SelectItem value="goods">Goods</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {selectedDonationType === "other" && (
            <Input
              placeholder="Enter custom donation type"
              {...register("customDonationType", { required: "Custom type is required" })}
            />
          )}
          {errors.donationType && <p className="text-red-500 text-sm">{errors.donationType.message}</p>}
        </div>

        {/* Donation Destination */}
        <div className="flex flex-col gap-1.5">
          <Label>Where will the donation go?</Label>
          <Controller
            name="donationDestination"
            control={control}
            rules={{ required: "Destination is required" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full justify-between font-normal">
                  <SelectValue placeholder="Select destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Destination</SelectLabel>
                    <SelectItem value="church">Church</SelectItem>
                    <SelectItem value="orphanage">Orphanage</SelectItem>
                    <SelectItem value="school">School</SelectItem>
                    <SelectItem value="community">Community</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {selectedDestination === "other" && (
            <Input
              placeholder="Enter custom destination"
              {...register("customDestination", { required: "Custom destination is required" })}
            />
          )}
          {errors.donationDestination && <p className="text-red-500 text-sm">{errors.donationDestination.message}</p>}
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Label>Description</Label>
        <Input
          placeholder="Enter description"
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Add Non-Monetary Record"}
      </Button>
    </form>
  );
};
