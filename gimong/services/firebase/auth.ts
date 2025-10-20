import { auth } from "./config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getUserRole } from "./users";

export async function loginUser(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;
  const role = await getUserRole(uid);
  return { user: userCredential.user, role };
}
