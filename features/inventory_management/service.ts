import {
  addDocument,
  updateDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocument,
  listenToCollection,
} from "@/services/firebase/utils";

import { InventoryItem } from "./types"; // FIX: Removed unused InventoryFormData
import { deleteField } from "firebase/firestore";

const INVENTORY_COLLECTION = "inventory";

/**
 * Utility to strip out undefined values (Firestore does not allow them).
 */
function removeUndefined<T extends object>(obj: T): T { // FIX: Changed 'any' to 'object'
  return Object.fromEntries(
    Object.entries(obj).filter(([v]) => v !== undefined)
  ) as T;
}

//
// ─── INVENTORY SERVICE ──────────────────────────────────────────────
//

/**
 * Add a new inventory item (metadata saved in Firebase)
 */
export async function addInventoryItem(
  data: InventoryItem
): Promise<string> {
  return addDocument(
    INVENTORY_COLLECTION,
    removeUndefined({
      ...data,
      dateCreated: new Date().toISOString(),
      isArchived: false,
    })
  );
}

/**
 * Update inventory item metadata
 */
export async function updateInventoryItem(
  id: string,
  data: Partial<InventoryItem>
): Promise<void> {
  await updateDocument(
    INVENTORY_COLLECTION,
    id,
    removeUndefined({
      ...data,
      dateUpdated: new Date().toISOString(),
    })
  );
}

/**
 * Get all inventory items
 */
export async function getInventoryItems(): Promise<InventoryItem[]> {
  return getAllDocuments<InventoryItem>(INVENTORY_COLLECTION);
}

/**
 * Get inventory item by ID
 */
export async function getInventoryItemById(
  id: string
): Promise<InventoryItem | null> {
  return getDocumentById<InventoryItem>(INVENTORY_COLLECTION, id);
}

/**
 * Delete inventory item metadata
 */
export async function deleteInventoryItem(id: string): Promise<void> {
  return deleteDocument(INVENTORY_COLLECTION, id);
}

/**
 * Real-time listener for inventory collection
 */
export function listenToInventory(
  callback: (docs: InventoryItem[]) => void
): () => void {
  return listenToCollection<InventoryItem>(
    INVENTORY_COLLECTION,
    (docs) => {
      callback(docs.map((doc) => removeUndefined(doc)));
    }
  );
}

/**
 * Archive / Unarchive inventory item
 */
export async function toggleArchiveInventoryItem(
  id: string,
  isArchived: boolean
): Promise<void> {
  const updateData: Record<string, unknown> = { isArchived }; // FIX: Changed 'any' to 'unknown'

  if (isArchived) {
    updateData.dateArchived = new Date().toISOString();
  } else {
    updateData.dateArchived = deleteField();
  }

  // NOTE: Asserting the type to satisfy updateInventoryItem's signature
  await updateInventoryItem(id, updateData as Partial<InventoryItem>);
}