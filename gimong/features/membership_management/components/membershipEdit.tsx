"use client";

import * as React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { format } from "date-fns";
import { toast } from "sonner";

import { MembershipProfile } from "../types";
import { updateMembership } from "../service"; // <-- adjust import path

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  record: MembershipProfile;
  onClose: () => void;
}

type FormInput = Omit<
  MembershipProfile,
  "id" | "dateCreated" | "isArchived" | "dateArchived" | "dateUpdated"
>;

export const MembershipEdit: React.FC<Props> = ({ record, onClose }) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    defaultValues: record,
  });

  const [dateOfBirth, setDateOfBirth] = React.useState<Date | undefined>(
    record.dateOfBirth ? new Date(record.dateOfBirth) : undefined
  );
  const [dateBaptized, setDateBaptized] = React.useState<Date | undefined>(
    record.dateBaptized ? new Date(record.dateBaptized) : undefined
  );

  React.useEffect(() => {
    reset(record);
    setDateOfBirth(record.dateOfBirth ? new Date(record.dateOfBirth) : undefined);
    setDateBaptized(record.dateBaptized ? new Date(record.dateBaptized) : undefined);
  }, [record, reset]);

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    try {
      await updateMembership(record.id, {
        ...data,
        dateOfBirth: data.dateOfBirth,
        dateBaptized: data.dateBaptized || "",
      });
      toast.success("Membership updated successfully!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update membership.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>First Name</Label>
          <Input {...register("firstName", { required: "First name is required" })} />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <Label>Last Name</Label>
          <Input {...register("lastName", { required: "Last name is required" })} />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Date of Birth + Sex */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date of Birth */}
        <div>
          <Label>Date of Birth</Label>
          <Controller
            control={control}
            name="dateOfBirth"
            rules={{ required: "Date of birth is required" }}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between font-normal">
                    {field.value
                      ? format(new Date(field.value), "PPP")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateOfBirth}
                    onSelect={(date) => {
                      if (!date) return;
                      field.onChange(format(date, "yyyy-MM-dd"));
                      setDateOfBirth(date);
                    }}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>
          )}
        </div>

        {/* Sex */}
        <div>
          <Label>Sex</Label>
          <Controller
            control={control}
            name="sex"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
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

      {/* Address Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Barangay</Label>
          <Input {...register("address.barangay", { required: true })} />
        </div>
        <div>
          <Label>Municipality</Label>
          <Input {...register("address.municipality", { required: true })} />
        </div>
        <div>
          <Label>Province</Label>
          <Input {...register("address.province", { required: true })} />
        </div>
        <div>
          <Label>Country</Label>
          <Input {...register("address.country", { required: true })} />
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Contact Number</Label>
          <Input
            type="number"
            {...register("contactNumber", { required: "Contact number is required" })}
          />
          {errors.contactNumber && (
            <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>
          )}
        </div>
        <div>
          <Label>Email (optional)</Label>
          <Input type="email" {...register("email")} />
        </div>
      </div>

      {/* Marital Status, Membership Status, Date Baptized */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Marital Status */}
        <div>
          <Label>Marital Status</Label>
          <Controller
            control={control}
            name="maritalStatus"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
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

        {/* Membership Status */}
        <div>
          <Label>Membership Status</Label>
          <Controller
            control={control}
            name="membershipStatus"
            render={({ field }) => (
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select membership" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Date Baptized */}
        <div>
          <Label>Date Baptized</Label>
          <Controller
            control={control}
            name="dateBaptized"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-between font-normal">
                    {field.value
                      ? format(new Date(field.value), "PPP")
                      : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateBaptized}
                    onSelect={(date) => {
                      if (!date) {
                        field.onChange("");
                        setDateBaptized(undefined);
                        return;
                      }
                      field.onChange(format(date, "yyyy-MM-dd"));
                      setDateBaptized(date);
                    }}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};
