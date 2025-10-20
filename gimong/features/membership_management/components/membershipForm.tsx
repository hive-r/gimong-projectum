"use client";

import * as React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { toast } from "sonner";
import { createMembership } from "../service";
import { MembershipProfile } from "../types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type FormInput = Omit<
  MembershipProfile,
  "id" | "dateCreated" | "isArchived" | "dateArchived" | "dateUpdated"
>;

export const MembershipForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInput>({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      sex: "male",
      address: {
        barangay: "",
        municipality: "",
        province: "",
        country: "",
      },
      contactNumber: "",
      email: "",
      maritalStatus: "single",
      dateBaptized: "",
      membershipStatus: "active",
      isPinned: false,
    },
  });

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    try {
      await createMembership(data);
      toast.success("Membership created successfully!");
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create membership.");
    }
  };

  // Restrict future dates
  const today = new Date().toISOString().split("T")[0];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 border shadow bg-white max-w-4xl mx-auto"
    >
      <h2 className="text-xl font-semibold">Create Membership</h2>

      {/* Name */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>First Name</Label>
          <Input
            placeholder="Enter first name"
            {...register("firstName", { required: "First name is required" })}
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Middle Name (optional)</Label>
          <Input
            placeholder="Enter middle name"
            {...register("middleName")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Last Name</Label>
          <Input
            placeholder="Enter last name"
            {...register("lastName", { required: "Last name is required" })}
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Birth + Sex */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Date of Birth</Label>
          <Input
            type="date"
            max={today}
            {...register("dateOfBirth", {
              required: "Date of birth is required",
              validate: (value) =>
                new Date(value) <= new Date(today) ||
                "Date of birth cannot be in the future",
            })}
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Sex</Label>
          <Controller
            control={control}
            name="sex"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Barangay</Label>
          <Input {...register("address.barangay")} placeholder="Barangay" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Municipality</Label>
          <Input
            {...register("address.municipality")}
            placeholder="Municipality"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Province</Label>
          <Input {...register("address.province")} placeholder="Province" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Country</Label>
          <Input {...register("address.country")} placeholder="Country" />
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Contact Number</Label>
          <Input
            type="tel"
            placeholder="09XXXXXXXXX"
            {...register("contactNumber", {
              required: "Contact number is required",
              pattern: {
                value: /^(\+?\d{10,15})$/,
                message: "Enter a valid contact number",
              },
            })}
          />
          {errors.contactNumber && (
            <p className="text-red-500 text-sm">
              {errors.contactNumber.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Email (optional)</Label>
          <Input
            type="email"
            placeholder="example@email.com"
            {...register("email", {
              validate: (value) =>
                !value ||
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
                "Enter a valid email address",
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Marital + Membership Status + Date Baptized */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Marital Status</Label>
          <Controller
            control={control}
            name="maritalStatus"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Membership Status</Label>
          <Controller
            control={control}
            name="membershipStatus"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Date Baptized (optional)</Label>
          <Input
            type="date"
            max={today}
            {...register("dateBaptized", {
              validate: (value) =>
                !value ||
                new Date(value) <= new Date(today) ||
                "Date baptized cannot be in the future",
            })}
          />
          {errors.dateBaptized && (
            <p className="text-red-500 text-sm">{errors.dateBaptized.message}</p>
          )}
        </div>
      </div>


      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Create Membership"}
      </Button>
    </form>
  );
};
