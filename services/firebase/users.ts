import { db } from "./config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type Role = "superadmin" | "admin" | "media" | "finance" | "pastor";

export async function createUserRole(uid: string, email: string, role: Role) {
  return setDoc(doc(db, "users", uid), { email, role });
}

export async function getUserRole(uid: string): Promise<Role | null> {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data().role as Role;
  }
  return null;
}
