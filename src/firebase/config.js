import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY_2,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN_2,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL_2,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID_2,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET_2,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID_2,
  appId: import.meta.env.VITE_FIREBASE_APP_ID_2,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID_2
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
