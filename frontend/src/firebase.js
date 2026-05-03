import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAjJBc5O5E86A5dUsU34p9oI92tQXSvLIs",
  authDomain: "healthcompass3109.firebaseapp.com",
  projectId: "healthcompass3109",
  storageBucket: "healthcompass3109.firebasestorage.app",
  messagingSenderId: "6804404398",
  appId: "1:6804404398:web:3a8f0420d69fc4c265153f"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
