import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";

// Client-side Firebase for the partner application form (Firestore + Storage,
// project cue-e00d5 — the same backend the Cue app runs on). Config comes from
// NEXT_PUBLIC_ env vars; a Firebase web config is public by design, but we keep
// the values out of the repo. When unconfigured (e.g. a preview without env),
// callers fall back to the /api/lead webhook so submissions are never lost.
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function firebaseApp(): FirebaseApp | null {
  if (!config.apiKey || !config.projectId || !config.appId) return null;
  return getApps().length ? getApp() : initializeApp(config);
}
