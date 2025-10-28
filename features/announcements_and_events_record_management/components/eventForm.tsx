"use client";

import * as React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";

import { EventRecord } from "../types/event";
import { createEvent } from "../service";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { storage } from "@/services/appwrite/config"; // your Appwrite storage instance
import { ID } from "appwrite";

type FormInput = Omit<
  EventRecord,
  "id" | "dateCreated" | "type" | "status" | "isArchived" | "dateArchived"
>;

const urlPattern = {
  value: /^(https?:\/\/[^\s]+)$/i,
  message: "Please enter a valid URL",
};

export const EventForm: React.FC = () => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInput>();

  const today = new Date();
  const [startDate, setStartDate] = React.useState<Date>();

  const watchedStartDate = watch("startDate");
  const watchedStartTime = watch("startTime");
  const watchedEndDate = watch("endDate");
  const watchedEndTime = watch("endTime");
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    try {
      let imageUrl = data.imageUrl;

      if (selectedFile) {
        const response = await storage.createFile(
          process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
          ID.unique(),
          selectedFile
        );

        imageUrl = `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${response.bucketId}/files/${response.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
      }

      await createEvent({
        ...data,
        imageUrl,
        endDate: data.endDate || "",
        endTime: data.endTime || "",
      });

      toast.success("Event created successfully!");
      reset();
      setSelectedFile(null);
      setStartDate(undefined);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create event.");
    }
  };

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
      `${watchedEndDate || watchedStartDate}T${watchedEndTime || watchedStartTime
      }`
    );
    if (end < start) return "End date/time cannot be before start date/time";
    return true;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 border shadow bg-white max-w-4xl mx-auto"
    >
      <h2 className="text-xl font-semibold">Create Event</h2>

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <Label>Title</Label>
        <Input
          placeholder="Enter event title"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Label>Description</Label>
        <textarea
          placeholder="Enter event description"
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
        <Input
          placeholder="Enter event venue"
          {...register("venue", {
            required: "Venue is required",
          })}
        />
        {errors.venue && (
          <p className="text-red-500 text-sm">{errors.venue.message}</p>
        )}
      </div>

      {/* Image URL & Link */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Image URL + Upload */}
        <div className="flex flex-col gap-1.5">
          <Label>Image URL</Label>
          <Input
            placeholder="https://example.com/image.jpg"
            {...register("imageUrl", {
              pattern: urlPattern,
            })}
          />
          {errors.imageUrl && (
            <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>
          )}

          {/* Upload Button */}
          <Label>Or Upload Image</Label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0]); // store file for deferred upload
              }
            }}
            className="border rounded p-2"
          />
          <p className="text-sm text-gray-500">
            Select an image to upload when creating the event
          </p>
        </div>

        {/* Link */}
        <div className="flex flex-col gap-1.5">
          <Label>Link (optional)</Label>
          <Input
            placeholder="https://example.com"
            {...register("link", { pattern: urlPattern })}
          />
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
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-between font-normal"
                    >
                      {field.value
                        ? format(new Date(field.value), "PPP")
                        : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
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
                {errors.startDate && (
                  <p className="text-red-500 text-sm">
                    {errors.startDate.message}
                  </p>
                )}
              </>
            )}
          />

          <Label>Start Time</Label>
          <Input
            type="time"
            {...register("startTime", {
              required: "Start time is required",
              validate: validateStartTime,
            })}
          />
          {errors.startTime && (
            <p className="text-red-500 text-sm">
              {errors.startTime.message?.toString()}
            </p>
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
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="justify-between font-normal"
                    >
                      {field.value
                        ? format(new Date(field.value), "PPP")
                        : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        if (!date) {
                          field.onChange("");
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
                      }}
                      disabled={(date) =>
                        date < today || (startDate ? date < startDate : false)
                      }
                    />
                  </PopoverContent>
                </Popover>
                {errors.endDate && (
                  <p className="text-red-500 text-sm">
                    {errors.endDate.message?.toString()}
                  </p>
                )}
              </>
            )}
          />

          <Label>End Time (optional)</Label>
          <Input
            type="time"
            {...register("endTime", { validate: validateEndDateTime })}
          />
          {errors.endTime && (
            <p className="text-red-500 text-sm">
              {errors.endTime.message?.toString()}
            </p>
          )}
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Create Event"}
      </Button>
    </form>
  );
};