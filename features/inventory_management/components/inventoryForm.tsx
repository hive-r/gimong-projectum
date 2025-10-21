"use client";

import React, { useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { InventoryFormData, InventoryItem, InventoryCategory } from "../types";
import { toast } from "sonner";

import { storage } from "@/services/appwrite/config"; // Appwrite Storage
import { ID } from "appwrite";
import { addInventoryItem, updateInventoryItem } from "../service"; // Firebase service

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BUCKET_ID = "68ee4f3700317e582588"; // Your Appwrite bucket ID

export const InventoryForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<InventoryFormData>({
    defaultValues: { category: "sermon" }
  });

  const categoryValue = watch("category");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        toast.error("Please select a PDF file only.");
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  const onSubmit: SubmitHandler<InventoryFormData> = async (data) => {
    if (!selectedFile) {
      toast.error("Please select a PDF file.");
      return;
    }

    setUploading(true);

    try {
      const response = await storage.createFile(BUCKET_ID, ID.unique(), selectedFile);

      const newItem: InventoryItem = {
          appwriteId: response.$id,
          bucketId: response.bucketId,
          name: data.title,
          description: data.description,
          category: data.category,
          size: selectedFile.size,
          mimeType: selectedFile.type,
          uploadedAt: new Date().toISOString(),
          isArchived: false,
      };

      const firestoreId = await addInventoryItem(newItem);
      await updateInventoryItem(firestoreId, { firestoreId });

      toast.success("PDF uploaded successfully!");

      // ✅ Clear all inputs
      setSelectedFile(null);           // Clear selected file
      reset({ title: "", description: "", category: "sermon" }); // Reset form fields
      fileInputRef.current!.value = ""; // Reset hidden file input
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload PDF.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 border shadow bg-white max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold">Add Inventory PDF</h2>

      {/* Title */}
      <div className="flex flex-col gap-1.5">
        <Label>Title</Label>
        <Input
          placeholder="Enter file title"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <Label>Description</Label>
        <textarea
          placeholder="Enter file description"
          {...register("description", { required: "Description is required" })}
          className="border rounded p-2 min-h-[80px]"
        />
        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
      </div>

      {/* Category + PDF Upload Row */}
      <div className="flex gap-4">
        {/* Category */}
        <div className="flex flex-col gap-1.5 w-1/2">
          <Label>Category</Label>
          <Select value={categoryValue} onValueChange={(value: InventoryCategory) => setValue("category", value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sermon">Sermon</SelectItem>
              <SelectItem value="devotional">Devotional</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* PDF Upload */}
        <div className="flex flex-col gap-1.5 w-1/2">
          <Label>PDF File</Label>
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
            {selectedFile ? selectedFile.name : "Select PDF File"}
          </Button>
          <input
            ref={fileInputRef}
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Submit */}
      <Button type="submit" disabled={uploading} className="w-full">
        {uploading ? "Uploading..." : "Add Inventory PDF"}
      </Button>
    </form>
  );
};
