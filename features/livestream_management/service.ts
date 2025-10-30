import {
  addDocument,
  updateDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocument,
  listenToCollection,
} from "@/services/firebase/utils";

import { LiveStreamRecord } from "./livestream";
import { deleteField } from "firebase/firestore";
import { storage } from "@/services/appwrite/config";

const LIVESTREAMS_COLLECTION = "livestreams";

function removeUndefined<T extends object>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as T;
}

function getFileIdFromUrl(url: string): string | null {
  const match = url.match(/\/files\/([^/]+)\/view/);
  return match ? match[1] : null;
}

async function deleteAppwriteFile(url?: string) {
  if (!url) return;
  const fileId = getFileIdFromUrl(url);
  if (!fileId) return;
  try {
    await storage.deleteFile(process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!, fileId);
  } catch (err) {
    console.error("Failed to delete Appwrite file:", err);
  }
}

/**
 * CREATE
 */
export async function createLiveStream(
  data: Omit<
    LiveStreamRecord,
    "id" | "dateCreated" | "dateUpdated" | "isArchived" | "dateArchived"
  >
): Promise<string> {
  return addDocument(
    LIVESTREAMS_COLLECTION,
    removeUndefined({
      ...data,
      dateCreated: new Date().toISOString(),
      isArchived: false,
      isDisplay: false,
    })
  );
}

/**
 * UPDATE
 */
export async function updateLiveStream(id: string, data: Partial<LiveStreamRecord>): Promise<void> {
  await updateDocument(
    LIVESTREAMS_COLLECTION,
    id,
    removeUndefined({
      ...data,
      dateUpdated: new Date().toISOString(),
    })
  );
}

/**
 * GET ALL
 */
export async function getLiveStreams(): Promise<LiveStreamRecord[]> {
  return getAllDocuments<LiveStreamRecord>(LIVESTREAMS_COLLECTION);
}

/**
 * GET BY ID
 */
export async function getLiveStreamById(id: string): Promise<LiveStreamRecord | null> {
  return getDocumentById<LiveStreamRecord>(LIVESTREAMS_COLLECTION, id);
}

/**
 * DELETE (with Appwrite image cleanup)
 */
export async function deleteLiveStream(id: string): Promise<void> {
  const doc = await getLiveStreamById(id);
  if (doc?.imageUrl) {
    await deleteAppwriteFile(doc.imageUrl);
  }
  return deleteDocument(LIVESTREAMS_COLLECTION, id);
}

/**
 * LISTEN (Realtime)
 */
export function listenToLiveStreams(callback: (docs: LiveStreamRecord[]) => void): () => void {
  return listenToCollection<LiveStreamRecord>(LIVESTREAMS_COLLECTION, (docs) => {
    callback(docs.map((doc) => removeUndefined(doc)));
  });
}

/**
 * ARCHIVE / UNARCHIVE
 */
export async function toggleArchiveLiveStream(id: string, isArchived: boolean): Promise<void> {
  const updateData: Record<string, unknown> = { isArchived };

  if (isArchived) {
    updateData.dateArchived = new Date().toISOString();
  } else {
    updateData.dateArchived = deleteField();
  }

  await updateDocument(LIVESTREAMS_COLLECTION, id, updateData);
}

/**
 * DISPLAY / HIDE LIVESTREAM
 * Ensures only 2 livestreams can be displayed at once.
 */
export async function toggleDisplayLiveStream(id: string, value: boolean) {
  const allStreams = await getLiveStreams();

  if (value) {
    // Filter currently displayed streams
    const displayed = allStreams
      .filter((s) => s.isDisplay)
      .sort((a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime());

    // If already 2 displayed, undisplay the oldest one
    if (displayed.length >= 2) {
      const oldest = displayed[0];
      if (oldest && oldest.id !== id) {
        await updateLiveStream(oldest.id, { isDisplay: false });
      }
    }
  }

  // Update selected livestream display state
  await updateLiveStream(id, { isDisplay: value });
}
