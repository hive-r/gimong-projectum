"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { AnnouncementRecord } from "../types/announcement";
import { createAnnouncement } from "../service";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type FormInput = Omit<AnnouncementRecord, "id" | "dateCreated" | "type">;

const urlPattern = {
  value: /^(https?:\/\/[^\s]+)$/i,
  message: "Please enter a valid URL",
};

export const AnnouncementForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInput>();

  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    try {
      await createAnnouncement(data);
      toast.success("Announcement created successfully!");
      reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create announcement.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 border shadow bg-white max-w-4xl mx-auto"
    >
      <h2 className="text-xl font-semibold">Create Announcement</h2>

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <Label>Title</Label>
        <Input
          placeholder="Enter announcement title"
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
          placeholder="Enter announcement description"
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
          placeholder="https://example.com/image.jpg"
          {...register("imageUrl", { pattern: urlPattern })}
        />
        {errors.imageUrl && (
          <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>
        )}
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

      {/* Submit */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Create Announcement"}
      </Button>
    </form>
  );
};
