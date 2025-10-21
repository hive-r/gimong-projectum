import {
  addDocument,
  updateDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocument,
  listenToCollection,
} from "@/services/firebase/utils";

import { collection, deleteField, doc, updateDoc } from "firebase/firestore";
import { MonetaryRecord } from "./types/monetary";
import { NonMonetaryRecord, NonMonetaryReport } from "./types/nonMonetary";
import { CashoutRecord, CashoutReport } from "./types/cashout";
import { db } from "@/services/firebase/config";
import { setDoc } from "firebase/firestore"; // Added import

//
// ─── COLLECTION NAMES ───────────────────────────────────────────────
//
const MONETARY_COLLECTION = "monetary_records";
const NON_MONETARY_COLLECTION = "non_monetary_records";
const CASHOUT_COLLECTION = "cashout_records";
const CASHOUT_REPORT_COLLECTION = "cashout_reports";
const NON_MONETARY_REPORT_COLLECTION = "nonMonetaryReports"; // Moved up for clarity

//
// ─── UTILITY: REMOVE UNDEFINED (Firestore-safe) ─────────────────────
//
/**
 * Removes properties with 'undefined' values from an object, which is required
 * for safe Firestore operations (Firestore doesn't allow undefined).
 */
// FIX 1: Replace 'any' with a more specific type: 'Record<string, unknown>'
function removeUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as T; // Note: Filtering by value, not key ([key, value])
}

//
// ─── MONETARY RECORD SERVICE ────────────────────────────────────────
//

export async function createMonetaryRecord(
  data: Omit<
    MonetaryRecord,
    "id" | "dateCreated" | "dateUpdated" | "isArchived" | "dateArchived"
  >
): Promise<string> {
  return addDocument(
    MONETARY_COLLECTION,
    removeUndefined({
      ...data,
      dateCreated: new Date().toISOString(),
      isArchived: false,
    })
  );
}

export async function updateMonetaryRecord(
  id: string,
  data: Partial<MonetaryRecord>
): Promise<void> {
  await updateDocument(
    MONETARY_COLLECTION,
    id,
    removeUndefined({
      ...data,
      dateUpdated: new Date().toISOString(),
    })
  );
}

export async function getMonetaryRecords(): Promise<MonetaryRecord[]> {
  return getAllDocuments<MonetaryRecord>(MONETARY_COLLECTION);
}

export async function getMonetaryRecordById(
  id: string
): Promise<MonetaryRecord | null> {
  return getDocumentById<MonetaryRecord>(MONETARY_COLLECTION, id);
}

export async function deleteMonetaryRecord(id: string): Promise<void> {
  return deleteDocument(MONETARY_COLLECTION, id);
}

export function listenToMonetaryRecords(
  callback: (docs: MonetaryRecord[]) => void
): () => void {
  return listenToCollection<MonetaryRecord>(
    MONETARY_COLLECTION,
    // FIX: Removed: (docs) => callback(docs.map((doc) => removeUndefined(doc)))
    (docs) => callback(docs)
  );
}

//
// ─── NON-MONETARY RECORD SERVICE ────────────────────────────────────
//

export async function createNonMonetaryRecord(
  data: Omit<
    NonMonetaryRecord,
    "id" | "dateCreated" | "dateUpdated" | "isArchived" | "dateArchived" | "status"
  >
): Promise<string> {
  return addDocument(
    NON_MONETARY_COLLECTION,
    removeUndefined({
      ...data,
      dateCreated: new Date().toISOString(),
      isArchived: false,
      status: "pending", // <-- default status added
    })
  );
}

export async function updateNonMonetaryRecord(
  id: string,
  data: Partial<NonMonetaryRecord>
): Promise<void> {
  await updateDocument(
    NON_MONETARY_COLLECTION,
    id,
    removeUndefined({
      ...data,
      dateUpdated: new Date().toISOString(),
    })
  );
}

export async function getNonMonetaryRecords(): Promise<NonMonetaryRecord[]> {
  return getAllDocuments<NonMonetaryRecord>(NON_MONETARY_COLLECTION);
}

export async function getNonMonetaryRecordById(
  id: string
): Promise<NonMonetaryRecord | null> {
  return getDocumentById<NonMonetaryRecord>(NON_MONETARY_COLLECTION, id);
}

export async function deleteNonMonetaryRecord(id: string): Promise<void> {
  return deleteDocument(NON_MONETARY_COLLECTION, id);
}

export function listenToNonMonetaryRecords(
  callback: (docs: NonMonetaryRecord[]) => void
): () => void {
  return listenToCollection<NonMonetaryRecord>(
    NON_MONETARY_COLLECTION,
    // FIX: Removed: (docs) => callback(docs.map((doc) => removeUndefined(doc)))
    (docs) => callback(docs)
  );
}

//
// ─── GENERIC ARCHIVE TOGGLE (used by both collections) ──────────────
//

export async function toggleArchiveRecord(
  collectionName:
    | typeof MONETARY_COLLECTION
    | typeof NON_MONETARY_COLLECTION,
  id: string,
  isArchived: boolean
): Promise<void> {
  const updateData: Record<string, unknown> = {
    isArchived,
  };

  if (isArchived) {
    updateData.dateArchived = new Date().toISOString();
  } else {
    updateData.dateArchived = deleteField();
  }

  // FIX: Suppress the ESLint rule for the specific line using the 'any' cast.
  // This safely allows 'deleteField()' (which has a problematic type) to be passed.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await updateDocument(collectionName, id, removeUndefined(updateData as Record<string, any>));
}

//
// ─── CONVENIENCE WRAPPERS ───────────────────────────────────────────
//

export async function toggleArchiveMonetaryRecord(
  id: string,
  isArchived: boolean
): Promise<void> {
  return toggleArchiveRecord(MONETARY_COLLECTION, id, isArchived);
}

export async function toggleArchiveNonMonetaryRecord(
  id: string,
  isArchived: boolean
): Promise<void> {
  return toggleArchiveRecord(NON_MONETARY_COLLECTION, id, isArchived);
}

// ─── CASHOUT RECORD SERVICE ─────────────────────────────────────────────
export async function createCashoutRecord(
  data: Omit<CashoutRecord, "id" | "dateCreated" | "isArchived" | "dateArchived">
): Promise<string> {
  // Step 1: Create the document and get its ID
  const id = await addDocument(
    CASHOUT_COLLECTION,
    removeUndefined({
      ...data,
      dateCreated: new Date().toISOString(),
      isArchived: false,
    })
  );

  // Step 2: Update the document with the generated ID
  await updateDocument(CASHOUT_COLLECTION, id, { id });

  // Return the document ID for reference
  return id;
}


export function listenToCashoutRecords(
  callback: (docs: CashoutRecord[]) => void
): () => void {
  return listenToCollection<CashoutRecord>(
    CASHOUT_COLLECTION,
    (docs) => callback(docs)
  );
}

// ─── CASHOUT REPORT SERVICE ─────────────────────────────────────────────
export async function createCashoutReport(
  data: Omit<CashoutReport, "id" | "dateCreated">
): Promise<string> {
  // Step 1: Create the cashout report document
  const id = await addDocument(
    CASHOUT_REPORT_COLLECTION,
    removeUndefined({
      ...data,
      isArchived: data.isArchived ?? false, // default to false
      dateCreated: new Date().toISOString(),
    })
  );

  // Step 2: Update the document with its generated ID
  await updateDocument(CASHOUT_REPORT_COLLECTION, id, { id });

  // Step 3: Update the related cashout record's status to "reported"
  try {
    await updateDocument(CASHOUT_COLLECTION, data.cashoutId, { // Used constant
      status: "reported",
    });
  } catch (err) {
    console.error("Failed to update related cashout record:", err);
  }

  // Step 4: Return report ID
  return id;
}

export function listenToCashoutReports(
  callback: (docs: CashoutReport[]) => void
): () => void {
  return listenToCollection<CashoutReport>(CASHOUT_REPORT_COLLECTION, callback);
}

export async function createNonMonetaryReport(report: NonMonetaryReport) {
  try {
    // Generate a new document reference with an auto ID
    const reportRef = doc(collection(db, NON_MONETARY_REPORT_COLLECTION)); // Used constant
    const newReport: NonMonetaryReport = {
      ...report,
      id: reportRef.id,
      dateCreated: new Date().toISOString(),
      isArchived: report.isArchived ?? false,
    };

    // Save the report using Firestore's setDoc
    await setDoc(reportRef, newReport);

    // Update the related non-monetary record's status to "reported"
    const recordRef = doc(db, NON_MONETARY_COLLECTION, report.recordId); // Used constant
    await updateDoc(recordRef, { status: "reported" });

    return reportRef.id;
  } catch (err) {
    console.error("Failed to create non-monetary report:", err);
    throw err;
  }
}

export function listenToNonMonetaryReports(
  callback: (docs: NonMonetaryReport[]) => void
): () => void {
  return listenToCollection<NonMonetaryReport>(
    NON_MONETARY_REPORT_COLLECTION,
    callback
  );
}