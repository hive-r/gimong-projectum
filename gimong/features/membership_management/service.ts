import {
  addDocument,
  updateDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocument,
  listenToCollection,
} from "@/services/firebase/utils";

import { deleteField } from "firebase/firestore";
import { MembershipProfile } from "./types";

const MEMBERSHIP_COLLECTION = "memberships";

/**
 * Utility to remove undefined fields before writing to Firestore.
 */
function removeUndefined<T extends object>(obj: T): T { // FIXED: T extends object
  return Object.fromEntries(
    Object.entries(obj).filter(([v]) => v !== undefined)
  ) as T;
}

//
// ─── MEMBERSHIP SERVICE ───────────────────────────────────────────────
//

export async function createMembership(
  data: Omit<MembershipProfile, "id" | "dateCreated" | "isArchived">
): Promise<string> {
  return addDocument(
    MEMBERSHIP_COLLECTION,
    removeUndefined({
      ...data,
      dateCreated: new Date().toISOString(),
      isArchived: false,
    })
  );
}

export async function updateMembership(
  id: string,
  data: Partial<MembershipProfile>
): Promise<void> {
  await updateDocument(
    MEMBERSHIP_COLLECTION,
    id,
    removeUndefined({
      ...data,
      dateUpdated: new Date().toISOString(),
    })
  );
}

export async function getMemberships(): Promise<MembershipProfile[]> {
  return getAllDocuments<MembershipProfile>(MEMBERSHIP_COLLECTION);
}

export async function getMembershipById(
  id: string
): Promise<MembershipProfile | null> {
  return getDocumentById<MembershipProfile>(MEMBERSHIP_COLLECTION, id);
}

export async function deleteMembership(id: string): Promise<void> {
  return deleteDocument(MEMBERSHIP_COLLECTION, id);
}

/**
 * Real-time listener for membership updates
 */
export function listenToMemberships(
  callback: (docs: MembershipProfile[]) => void
): () => void {
  return listenToCollection<MembershipProfile>(
    MEMBERSHIP_COLLECTION,
    (docs) => {
      callback(docs.map((doc) => removeUndefined(doc)));
    }
  );
}

//
// ─── ARCHIVING ─────────────────────────────────────────────────────────
//

export async function toggleArchiveMembership(
  id: string,
  isArchived: boolean
): Promise<void> {
  const updateData: Record<string, unknown> = { isArchived }; // FIXED: Changed 'any' to 'unknown'

  if (isArchived) {
    updateData.dateArchived = new Date().toISOString();
  } else {
    updateData.dateArchived = deleteField();
  }

  // Casting to Partial<MembershipProfile> to satisfy the signature of updateDocument
  await updateDocument(
    MEMBERSHIP_COLLECTION, 
    id, 
    removeUndefined(updateData as Partial<MembershipProfile>)
  );
}

//
// ─── PINNING (Optional: if you support featured members) ───────────────
//

export async function togglePinMembership(
  id: string,
  isPinned: boolean
): Promise<void> {
  if (isPinned) {
    // Unpin all other memberships first
    const memberships = await getAllDocuments<MembershipProfile>(
      MEMBERSHIP_COLLECTION
    );

    const unpins = memberships
      .filter((m) => m.isPinned)
      .map((m) =>
        updateDocument(MEMBERSHIP_COLLECTION, m.id, { isPinned: false })
      );

    await Promise.all(unpins);
  }

  await updateDocument(MEMBERSHIP_COLLECTION, id, { isPinned });
}