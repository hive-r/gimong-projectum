"use client";

import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { ID } from "appwrite";

import { LiveStreamRecord } from "../livestream";
import { createLiveStream } from "../service";
import { storage } from "@/services/appwrite/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormInput = Omit<
  LiveStreamRecord,
  "id" | "dateCreated" | "dateUpdated" | "dateArchived"
>;

const urlPattern = {
  value: /^(https?:\/\/[^\s]+)$/i,
  message: "Please enter a valid URL",
};

export const LiveStreamForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInput>();

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

      await createLiveStream({
        ...data,
        imageUrl,
        isDisplay: false,
      });

      toast.success("Live stream created successfully!");
      reset();
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create live stream.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 border shadow bg-white max-w-4xl mx-auto rounded-xl"
    >
      <h2 className="text-xl font-semibold">Create Live Stream</h2>

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <Label>Title</Label>
        <Input
          placeholder="Enter live stream title"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Label>Description</Label>
        <textarea
          placeholder="Enter live stream description"
          {...register("description", { required: "Description is required" })}
          className="border rounded p-2 min-h-20"
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Date</Label>
          <Input
            type="date"
            {...register("date")}
          />
          {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Time</Label>
          <Input
            type="time"
            {...register("time")}
          />
          {errors.time && <p className="text-red-500 text-sm">{errors.time.message}</p>}
        </div>
      </div>

      {/* Image URL + Upload */}
      <div className="grid grid-cols-2 gap-4 items-end">
        {/* Image URL */}
        <div className="flex flex-col gap-1.5">
          <Label>Image URL</Label>
          <Input
            placeholder="https://example.com/image.jpg"
            {...register("imageUrl", {
              pattern: urlPattern,
              required: "Image is required",
            })}
          />
          {errors.imageUrl && (
            <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>
          )}
        </div>

        {/* Upload */}
        <div className="flex flex-col gap-1.5">
          <Label>Upload Image</Label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFile(e.target.files[0]);
              }
            }}
            className="border rounded p-2"
          />
        </div>
      </div>

      {/* Stream Link */}
      <div className="flex flex-col gap-1.5">
        <Label>Stream Link</Label>
        <Input
          placeholder="https://facebook.com/live/xyz"
          {...register("link", {
            required: "Stream link is required",
            pattern: urlPattern,
          })}
        />
        {errors.link && (
          <p className="text-red-500 text-sm">{errors.link.message}</p>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Submitting..." : "Create Live Stream"}
      </Button>
    </form>
  );
};
