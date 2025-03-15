import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

// Function to observe authentication state changes
export const observeAuthState = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};
