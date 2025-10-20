import {
  addDocument,
  updateDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocument,
  listenToCollection,
} from "@/services/firebase/utils";

import { AnnouncementRecord } from "./types/announcement";
import { EventRecord, EventStatus } from "./types/event";
import { computeEventStatus } from "@/features/announcements_and_events_record_management/utils/computeEventStatus";
import { deleteField } from "firebase/firestore";

const ANNOUNCEMENTS_COLLECTION = "announcements";
const EVENTS_COLLECTION = "events";

/**
 * Utility to strip out undefined values (Firestore does not allow them).
 */
function removeUndefined<T extends Record<string, any>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined)
  ) as T;
}

//
// ─── ANNOUNCEMENTS SERVICE ──────────────────────────────────────────────
//

export async function createAnnouncement(
  data: Omit<AnnouncementRecord, "id" | "dateCreated" | "type">
): Promise<string> {
  return addDocument(
    ANNOUNCEMENTS_COLLECTION,
    removeUndefined({
      ...data,
      type: "announcement",
      dateCreated: new Date().toISOString(),
      isArchived: false,
    })
  );
}

export async function updateAnnouncement(
  id: string,
  data: Partial<AnnouncementRecord>
): Promise<void> {
  await updateDocument(
    ANNOUNCEMENTS_COLLECTION,
    id,
    removeUndefined({
      ...data,
      dateUpdated: new Date().toISOString(),
    })
  );
}

export async function getAnnouncements(): Promise<AnnouncementRecord[]> {
  return getAllDocuments<AnnouncementRecord>(ANNOUNCEMENTS_COLLECTION);
}

export async function getAnnouncementById(
  id: string
): Promise<AnnouncementRecord | null> {
  return getDocumentById<AnnouncementRecord>(ANNOUNCEMENTS_COLLECTION, id);
}

export async function deleteAnnouncement(id: string): Promise<void> {
  return deleteDocument(ANNOUNCEMENTS_COLLECTION, id);
}

export function listenToAnnouncements(
  callback: (docs: AnnouncementRecord[]) => void
): () => void {
  return listenToCollection<AnnouncementRecord>(
    ANNOUNCEMENTS_COLLECTION,
    (docs) => {
      // Strip undefined just in case Firestore snapshot returns incomplete data
      callback(docs.map((doc) => removeUndefined(doc)));
    }
  );
}

//
// ─── EVENTS SERVICE ─────────────────────────────────────────────────────
//

export async function createEvent(
  data: Omit<
    EventRecord,
    "id" | "dateCreated" | "type" | "status" | "isArchived" | "dateArchived"
  >
): Promise<string> {
  const initialStatus: EventStatus = computeEventStatus(
    data.startDate,
    data.startTime,
    data.endDate,
    data.endTime
  );

  return addDocument(
    EVENTS_COLLECTION,
    removeUndefined({
      ...data,
      type: "event",
      dateCreated: new Date().toISOString(),
      status: initialStatus,
      isArchived: initialStatus === "past",
      dateArchived:
        initialStatus === "past" ? new Date().toISOString() : undefined,
    })
  );
}

export async function updateEvent(
  id: string,
  data: Partial<EventRecord>
): Promise<void> {
  const updateData: Partial<EventRecord> = {
    ...data,
    dateUpdated: new Date().toISOString(),
  };

  // Recompute status if dates/times change
  if (data.startDate || data.startTime || data.endDate || data.endTime) {
    const status = computeEventStatus(
      data.startDate ?? "",
      data.startTime ?? "",
      data.endDate ?? "",
      data.endTime ?? ""
    );

    updateData.status = status;
    if (status === "past") {
      updateData.isArchived = true;
      updateData.dateArchived = new Date().toISOString();
    }
  }

  await updateDocument(EVENTS_COLLECTION, id, removeUndefined(updateData));
}

export async function getEvents(): Promise<EventRecord[]> {
  const events = await getAllDocuments<EventRecord>(EVENTS_COLLECTION);

  return Promise.all(
    events.map(async (event) => {
      const newStatus = computeEventStatus(
        event.startDate,
        event.startTime,
        event.endDate,
        event.endTime
      );

      if (newStatus !== event.status) {
        await updateEvent(event.id, { status: newStatus });
      }

      return removeUndefined({
        ...event,
        status: newStatus,
        isArchived: newStatus === "past" ? true : event.isArchived,
        dateArchived:
          newStatus === "past" && !event.dateArchived
            ? new Date().toISOString()
            : event.dateArchived,
      });
    })
  );
}

export async function getEventById(id: string): Promise<EventRecord | null> {
  const event = await getDocumentById<EventRecord>(EVENTS_COLLECTION, id);

  if (!event) return null;

  const newStatus = computeEventStatus(
    event.startDate,
    event.startTime,
    event.endDate,
    event.endTime
  );

  if (newStatus !== event.status) {
    await updateEvent(event.id, { status: newStatus });
    return removeUndefined({
      ...event,
      status: newStatus,
      isArchived: newStatus === "past" ? true : event.isArchived,
      dateArchived:
        newStatus === "past" && !event.dateArchived
          ? new Date().toISOString()
          : event.dateArchived,
    });
  }

  return removeUndefined(event);
}

export async function deleteEvent(id: string): Promise<void> {
  return deleteDocument(EVENTS_COLLECTION, id);
}

/**
 * Real-time listener for events that auto-updates status and archiving.
 */
export function listenToEvents(
  callback: (docs: EventRecord[]) => void
): () => void {
  return listenToCollection<EventRecord>(
    EVENTS_COLLECTION,
    async (docs) => {
      const updatedDocs = await Promise.all(
        docs.map(async (event) => {
          const newStatus = computeEventStatus(
            event.startDate,
            event.startTime,
            event.endDate,
            event.endTime
          );

          const updateData: Partial<EventRecord> = {};

          // Only update status if it changed
          if (newStatus !== event.status) updateData.status = newStatus;

          // Only auto-archive if event is past AND NOT manually unarchived
          if (newStatus === "past" && event.isArchived === false) {
            updateData.isArchived = true;
            updateData.dateArchived = new Date().toISOString();
          }

          // Update Firestore if anything changed
          if (Object.keys(updateData).length > 0) {
            await updateEvent(event.id, updateData);
          }

          return {
            ...event,
            ...updateData,
          };
        })
      );

      callback(updatedDocs);
    }
  );
}
//
// ─── PINNING (Global: only 1 announcement OR event can be pinned) ─────────────
//

export async function togglePinRecord(
  collectionName: typeof ANNOUNCEMENTS_COLLECTION | typeof EVENTS_COLLECTION,
  id: string,
  isPinned: boolean
): Promise<void> {
  if (isPinned) {
    // Unpin ALL announcements and events first
    const [announcements, events] = await Promise.all([
      getAllDocuments<any>(ANNOUNCEMENTS_COLLECTION),
      getAllDocuments<any>(EVENTS_COLLECTION),
    ]);

    const unpins = [
      ...announcements
        .filter((doc) => doc.isPinned)
        .map((doc) =>
          updateDocument(ANNOUNCEMENTS_COLLECTION, doc.id, { isPinned: false })
        ),
      ...events
        .filter((doc) => doc.isPinned)
        .map((doc) =>
          updateDocument(EVENTS_COLLECTION, doc.id, { isPinned: false })
        ),
    ];

    await Promise.all(unpins);
  }

  // Apply pin state to the selected record
  await updateDocument(collectionName, id, { isPinned });
}

//
// ─── ARCHIVING ─────────────────────────────────────────────────────────
//
export async function toggleArchiveRecord(
  collectionName: typeof ANNOUNCEMENTS_COLLECTION | typeof EVENTS_COLLECTION,
  id: string,
  isArchived: boolean
): Promise<void> {
  const updateData: Record<string, any> = { isArchived };

  if (isArchived) {
    // When archiving → set dateArchived
    updateData.dateArchived = new Date().toISOString();
  } else {
    // When unarchiving → remove dateArchived correctly
    updateData.dateArchived = deleteField();
  }

  // Don't strip deleteField with removeUndefined
  await updateDocument(collectionName, id, updateData);
}
