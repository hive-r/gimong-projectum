"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

import { AnnouncementRecord } from "../types/announcement";
import { updateAnnouncement } from "../service";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Props {
  record: AnnouncementRecord;
  onClose: () => void;
}

type FormInput = Omit<
  AnnouncementRecord,
  "id" | "dateCreated" | "type" | "isArchived" | "dateArchived"
>;

const urlPattern = {
  value: /^(https?:\/\/[^\s]+)$/i,
  message: "Please enter a valid URL",
};

export const AnnouncementEdit: React.FC<Props> = ({ record, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInput>({
    defaultValues: record,
  });

  useEffect(() => {
    reset(record);
  }, [record, reset]);

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    try {
      await updateAnnouncement(record.id, data);
      toast.success("Announcement updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update announcement.");
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
        <textarea
          {...register("description", { required: "Description is required" })}
          className="border rounded p-2 min-h-20"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* Image URL */}
      <div className="flex flex-col gap-1.5">
        <Label>Image URL (optional)</Label>
        <Input
          {...register("imageUrl", { pattern: urlPattern })}
          placeholder="https://example.com/image.jpg"
        />
        {errors.imageUrl && (
          <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>
        )}
      </div>

      {/* Link */}
      <div className="flex flex-col gap-1.5">
        <Label>Link (optional)</Label>
        <Input
          {...register("link", { pattern: urlPattern })}
          placeholder="https://example.com"
        />
        {errors.link && (
          <p className="text-red-500 text-sm">{errors.link.message}</p>
        )}
      </div>

      {/* Save */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
};
