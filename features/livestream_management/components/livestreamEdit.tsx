"use client";

import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { LiveStreamRecord } from "../livestream";
import { updateLiveStream } from "../service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface Props {
  record: LiveStreamRecord;
  onClose: () => void;
}

type FormInput = Omit<
  LiveStreamRecord,
  "id" | "dateCreated" | "dateArchived"
>;

const urlPattern = {
  value: /^(https?:\/\/[^\s]+)$/i,
  message: "Please enter a valid URL (https://...)",
};

export const LiveStreamEdit: React.FC<Props> = ({ record, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInput>({
    defaultValues: record,
  });

  const isDisplay = watch("isDisplay");

  React.useEffect(() => {
    reset(record);
  }, [record, reset]);

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    try {
      await updateLiveStream(record.id, {
        ...data,
        dateUpdated: new Date().toISOString(),
      });
      toast.success("Live stream updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update live stream.");
    }
  };

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
        <Textarea
          {...register("description", { required: "Description is required" })}
          className="min-h-[100px]"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* Image & Link */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Thumbnail / Image URL</Label>
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
          <Label>Stream Link</Label>
          <Input
            {...register("link", {
              required: "Live stream link is required",
              pattern: urlPattern,
            })}
          />
          {errors.link && (
            <p className="text-red-500 text-sm">{errors.link.message}</p>
          )}
        </div>
      </div>

      {/* Date / Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Date</Label>
          <Input
            type="date"
            {...register("date", { required: "Date is required" })}
          />
          {errors.date && (
            <p className="text-red-500 text-sm">{errors.date.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Time</Label>
          <Input
            type="time"
            {...register("time", { required: "Time is required" })}
          />
          {errors.time && (
            <p className="text-red-500 text-sm">{errors.time.message}</p>
          )}
        </div>
      </div>

      {/* isDisplay Toggle */}
      <div className="flex items-center justify-between border-t pt-4">
        <Label className="font-medium">Display on site?</Label>
        <Switch
          checked={isDisplay}
          onCheckedChange={(checked) => setValue("isDisplay", checked)}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};
