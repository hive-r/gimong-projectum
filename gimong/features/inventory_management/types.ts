// types.ts

export type InventoryCategory = "sermon" | "devotional";

export interface InventoryFormData {
  title: string;
  description: string;
  category: InventoryCategory; // New field to identify the type of PDF
}

export interface InventoryItem {
  firestoreId?: string; // Firestore document ID
  appwriteId: string;   // Appwrite file ID
  bucketId: string;     // Appwrite bucket ID
  name: string;
  description: string;
  category: InventoryCategory; // Add category to metadata
  size?: number;
  mimeType?: string;
  uploadedAt: string;
  dateArchived?: string;
  isArchived: boolean;
}
