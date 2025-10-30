"use client";

import * as React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { format } from "date-fns";
import { toast } from "sonner";

import { EventRecord } from "../types/event";
import { updateEvent } from "../service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Props {
  record: EventRecord;
  onClose: () => void;
}

type FormInput = Omit<
  EventRecord,
  "id" | "dateCreated" | "type" | "status" | "isArchived" | "dateArchived"
>;

const urlPattern = {
  value: /^(https?:\/\/[^\s]+)$/i,
  message: "Please enter a valid URL",
};

export const EventEdit: React.FC<Props> = ({ record, onClose }) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    defaultValues: record,
  });

  const [startDate, setStartDate] = React.useState<Date | undefined>(
    record.startDate ? new Date(record.startDate) : undefined
  );
  const [endDate, setEndDate] = React.useState<Date | undefined>(
    record.endDate ? new Date(record.endDate) : undefined
  );

  React.useEffect(() => {
    reset(record);
    setStartDate(record.startDate ? new Date(record.startDate) : undefined);
    setEndDate(record.endDate ? new Date(record.endDate) : undefined);
  }, [record, reset]);

  const watchedStartDate = watch("startDate");
  const watchedStartTime = watch("startTime");
  const watchedEndDate = watch("endDate");
  const watchedEndTime = watch("endTime");

  // Validation
  const validateStartTime = (value: string) => {
    if (!watchedStartDate) return "Start date required first";
    const now = new Date();
    const selectedDate = new Date(`${watchedStartDate}T${value}`);
    if (selectedDate < now) return "Start time must be in the future";
    return true;
  };

  const validateEndDateTime = () => {
    if (!watchedEndDate && !watchedEndTime) return true;
    if (!watchedStartDate || !watchedStartTime)
      return "Start date/time required first";
    const start = new Date(`${watchedStartDate}T${watchedStartTime}`);
    const end = new Date(
      `${watchedEndDate || watchedStartDate}T${
        watchedEndTime || watchedStartTime
      }`
    );
    if (end < start) return "End date/time cannot be before start date/time";
    return true;
  };

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    try {
      await updateEvent(record.id, {
        ...data,
        endDate: data.endDate || "",
        endTime: data.endTime || "",
      });
      toast.success("Event updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update event.");
    }
  };

  const today = new Date();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <Label>Title</Label>
        <Input {...register("title", { required: "Title is required" })} />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Label>Description</Label>
        <textarea
          {...register("description", { required: "Description is required" })}
          className="border rounded p-2 min-h-20"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* Venue */}
      <div className="flex flex-col gap-1.5">
        <Label>Venue</Label>
        <Input {...register("venue", { required: "Venue is required" })} />
        {errors.venue && (
          <p className="text-red-500 text-sm">{errors.venue.message}</p>
        )}
      </div>

      {/* Image & Link */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Image URL</Label>
          <Input
            {...register("imageUrl", {
              required: "Image URL is required",
              pattern: urlPattern,
            })}
          />
          {errors.imageUrl && (
            <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Link (optional)</Label>
          <Input {...register("link", { pattern: urlPattern })} />
          {errors.link && (
            <p className="text-red-500 text-sm">{errors.link.message}</p>
          )}
        </div>
      </div>

      {/* Dates & Times */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Date + Time */}
        <div className="flex flex-col gap-2">
          <Label>Start Date</Label>
          <Controller
            control={control}
            name="startDate"
            rules={{ required: "Start date is required" }}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-between font-normal">
                    {field.value ? format(new Date(field.value), "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      if (!date) return;
                      if (date < today) {
                        toast.error("Start date cannot be in the past");
                        return;
                      }
                      field.onChange(format(date, "yyyy-MM-dd"));
                      setStartDate(date);
                    }}
                    disabled={(date) => date < today}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm">{errors.startDate.message}</p>
          )}

          <Label>Start Time</Label>
          <Input
            type="time"
            {...register("startTime", {
              required: "Start time is required",
              validate: validateStartTime,
            })}
          />
          {errors.startTime && (
            <p className="text-red-500 text-sm">{errors.startTime.message?.toString()}</p>
          )}
        </div>

        {/* End Date + Time */}
        <div className="flex flex-col gap-2">
          <Label>End Date (optional)</Label>
          <Controller
            control={control}
            name="endDate"
            rules={{ validate: validateEndDateTime }}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-between font-normal">
                    {field.value ? format(new Date(field.value), "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      if (!date) {
                        field.onChange("");
                        setEndDate(undefined);
                        return;
                      }
                      if (date < today) {
                        toast.error("End date cannot be in the past");
                        return;
                      }
                      if (startDate && date < startDate) {
                        toast.error("End date cannot be before start date");
                        return;
                      }
                      field.onChange(format(date, "yyyy-MM-dd"));
                      setEndDate(date);
                    }}
                    disabled={(date) => date < today || (startDate ? date < startDate : false)}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm">{errors.endDate.message?.toString()}</p>
          )}

          <Label>End Time (optional)</Label>
          <Input type="time" {...register("endTime", { validate: validateEndDateTime })} />
          {errors.endTime && (
            <p className="text-red-500 text-sm">{errors.endTime.message?.toString()}</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};
