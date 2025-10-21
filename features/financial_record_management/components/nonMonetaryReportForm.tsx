"use client";

import * as React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { ID } from "appwrite";
import { storage } from "@/services/appwrite/config";
import { createNonMonetaryReport, listenToNonMonetaryRecords } from "../service";
import { NonMonetaryRecord } from "../types/nonMonetary";

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
import Image from "next/image";

type FormInput = {
  recordId: string;
  description: string;
  submittedBy: string;
  files: FileList;
};

export const NonMonetaryReportForm: React.FC = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInput>({
    defaultValues: {
      recordId: "",
      description: "",
      submittedBy: "",
      files: undefined,
    },
  });

  const [records, setRecords] = React.useState<NonMonetaryRecord[]>([]);
  const [previewUrls, setPreviewUrls] = React.useState<string[]>([]);
  const [uploading, setUploading] = React.useState(false);

  // ─── Listen to Non-Monetary Records ───────────────────────────────
  // ─── Listen to Non-Monetary Records ───────────────────────────────
  React.useEffect(() => {
    const unsub = listenToNonMonetaryRecords((records) => {
      // Only include records that are not archived AND have status "pending"
      const available = records.filter(
        (r) => !r.isArchived && r.status === "pending"
      );
      setRecords(available);
    });
    return () => unsub();
  }, []);

  // ─── File Preview ────────────────────────────────────────────
  const handleFilePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const urls = Array.from(files).map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  // ─── Upload File ─────────────────────────────────────────────
  const uploadFile = async (file: File): Promise<string> => {
    try {
      setUploading(true);
      const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;
      const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
      if (!bucketId || !projectId) throw new Error("Missing Appwrite config");

      const result = await storage.createFile(bucketId, ID.unique(), file);
      return `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${result.$id}/view?project=${projectId}`;
    } catch (err) {
      console.error(err);
      toast.error("File upload failed.");
      return "";
    } finally {
      setUploading(false);
    }
  };

  // ─── Submit Handler ──────────────────────────────────────────
  const onSubmit: SubmitHandler<FormInput> = async (data) => {
    try {
      const uploadedUrls: string[] = [];

      if (data.files?.length) {
        for (const file of Array.from(data.files)) {
          const url = await uploadFile(file);
          if (url) uploadedUrls.push(url);
        }
      }

      await createNonMonetaryReport({
        recordId: data.recordId,
        description: data.description,
        submittedBy: data.submittedBy,
        files: uploadedUrls,
        isArchived: false, id: "",
      });

      toast.success("Non-monetary report submitted successfully!");
      reset();
      setPreviewUrls([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit non-monetary report.");
    }
  };

  // ─── Render Form ─────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-6 border shadow bg-white max-w-4xl mx-auto"
    >
      <h2 className="text-xl font-semibold">Submit Non-Monetary Report</h2>

      {/* Non-Monetary Record Reference */}
      <div className="flex flex-col gap-1.5">
        <Label>Non-Monetary Record</Label>
        <Controller
          name="recordId"
          control={control}
          rules={{ required: "Record reference is required" }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full justify-between font-normal">
                <SelectValue placeholder="Select related record" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Available Records</SelectLabel>
                  {records.length > 0 ? (
                    records.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.fullName} — {r.donationType} ({r.donationDestination})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled value="none">
                      No non-monetary records available
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors.recordId && (
          <p className="text-red-500 text-sm">{errors.recordId.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Label>Report Description</Label>
        <Input
          placeholder="Briefly describe the contribution"
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* File Upload */}
      <div className="flex flex-col gap-1.5">
        <Label>Supporting Documents / Images</Label>
        <Input
          type="file"
          multiple
          accept="image/*"
          {...register("files")}
          onChange={handleFilePreview}
        />
        <p className="text-sm text-gray-500">
          Upload any relevant documents or photos for verification.
        </p>

        {previewUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-3">
            {previewUrls.map((url, i) => (
              <div key={i} className="border rounded-lg overflow-hidden relative group">
                <Image
                  src={url}
                  alt={`Preview ${i + 1}`}
                  width={200}
                  height={128}
                  className="object-cover w-full h-32 group-hover:opacity-80 transition"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submitted By */}
      <div className="flex flex-col gap-1.5">
        <Label>Submitted By</Label>
        <Input
          placeholder="Enter your full name"
          {...register("submittedBy", { required: "Submitter name is required" })}
        />
        {errors.submittedBy && (
          <p className="text-red-500 text-sm">{errors.submittedBy.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting || uploading} className="w-full">
        {uploading
          ? "Uploading files..."
          : isSubmitting
            ? "Submitting..."
            : "Submit Non-Monetary Report"}
      </Button>
    </form>
  );
};
