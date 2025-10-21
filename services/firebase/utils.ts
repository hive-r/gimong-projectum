/* eslint-disable */

import { deleteDoc, DocumentSnapshot, getDoc } from "firebase/firestore";
import { onSnapshot, QuerySnapshot, DocumentData } from "firebase/firestore";
import { collection, addDoc, getDocs, doc, setDoc, query, where, QueryConstraint } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { db } from "./config";

/**
 * Add a document to an existing collection (or create if not exists)
 * @param {string} collectionName - The name of the collection
 * @param {object} data - The document data
 * @param {string} [docId] - Optional document ID
 * @returns {Promise<string>} The document ID
 */
export async function addDocument(
  collectionName: string,
  data: object,
  docId?: string,
): Promise<string> {
  if (docId) {
    await setDoc(doc(db, collectionName, docId), data);

    return docId;
  } else {
    const docRef = await addDoc(collection(db, collectionName), data);

    return docRef.id;
  }
}

/**
 * Update a document in a Firestore collection
 * @param {string} collectionName - The name of the collection
 * @param {string} docId - The document ID
 * @param {object} data - The data to update (partial fields)
 * @returns {Promise<void>}
 */
export async function updateDocument(
  collectionName: string,
  docId: string,
  data: object,
): Promise<void> {
  await setDoc(doc(db, collectionName, docId), data, { merge: true });
}

/**
 * Read all documents from a collection with inferred types
 * @param collectionName - The name of the collection
 * @returns Array of documents with IDs
 */
export async function getAllDocuments<T = DocumentData>(
  collectionName: string
): Promise<(T)[]> {
  const querySnapshot = await getDocs(collection(db, collectionName));
  const res: T[] = querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as T)
  );
  return res;
}

/**
 * Listen to real-time updates from a Firestore collection with optional filtering
 * @template T - The type of the document data
 * @param {string} collectionName - The name of the collection
 * @param {(docs: (T & {id: string})[]) => void} callback - Function to call with updated documents
 * @param {QueryConstraint[]} [filters] - Optional Firestore query constraints (e.g., where clauses)
 * @returns {() => void} Unsubscribe function
 */
export function listenToCollection<T = any>(
  collectionName: string,
  callback: (docs: (T & { id: string })[]) => void,
  filters: QueryConstraint[] = [] // Optional filters
): () => void {
  const collectionRef = collection(db, collectionName);

  // Apply filters if provided
  const queryRef = filters.length > 0 ? query(collectionRef, ...filters) : collectionRef;

  const unsubscribe = onSnapshot(
    queryRef,
    (querySnapshot: QuerySnapshot<DocumentData>) => {
      const docs = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as T & { id: string }
      );

      callback(docs);
    }
  );

  return unsubscribe;
}

/**
 * Listen to real-time updates from a Firestore document
 * @template T - The type of the document data
 * @param {string} collectionName - The collection name
 * @param {string} docId - The document ID
 * @param {(doc: (T & { id: string }) | null) => void} callback - Called with updated data or null if doc is deleted
 * @returns {() => void} Unsubscribe function
 */
export function listenToDocument<T = DocumentData>(
  collectionName: string,
  docId: string,
  callback: (doc: (T & { id: string }) | null) => void,
): () => void {
  const docRef = doc(db, collectionName, docId);

  const unsubscribe = onSnapshot(
    docRef,
    (docSnap: DocumentSnapshot<DocumentData>) => {
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as T & {
          id: string;
        };

        callback(data);
      } else {
        callback(null); // document was deleted or doesn't exist
      }
    },
  );

  return unsubscribe;
}

/**
 * Delete a document from a Firestore collection
 * @param {string} collectionName - The name of the collection
 * @param {string} docId - The document ID
 * @returns {Promise<void>}
 */
export async function deleteDocument(
  collectionName: string,
  docId: string,
): Promise<void> {
  await deleteDoc(doc(db, collectionName, docId));
}

export async function getDocumentById<T = DocumentData>(
  collectionName: string,
  docId: string,
): Promise<(T) | null> {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return docSnap.data() as T;
}