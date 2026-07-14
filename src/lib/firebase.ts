import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";

// ============================================================
// 🔧 REPLACE THESE WITH YOUR FIREBASE PROJECT CONFIG
// ============================================================

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

const isConfigured = !!firebaseConfig.projectId && !firebaseConfig.projectId.startsWith("YOUR_");

let db: ReturnType<typeof getFirestore> | null = null;

if (isConfigured) {
  try {
    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
  } catch (e) {
    console.warn("Firebase initialization failed:", e);
    db = null;
  }
}

// ============================================================
// Interfaces
// ============================================================

export interface NewsItem {
  id: string;
  date: string;
  content: string;
  createdAt: Timestamp;
}

export interface BlogItem {
  id: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string;  // comma-separated hashtags, e.g. "machine-learning,python,quantitative-finance"
  category: string;
  content: string;
  createdAt: Timestamp;
}

export interface PublicationItem {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: string;
  abstract: string;  // shown in ABS popup/modal
  pdfUrl: string;    // shown as HTML link (user puts PDF link here)
  createdAt: Timestamp;
}

export interface ExperienceItem {
  id: string;
  type: "education" | "work" | "other";
  institution: string;
  institutionLink: string;  // hyperlink URL for the institution name
  degree: string;
  dateRange: string;
  location: string;
  details: string;  // rich text with HTML - user can include <a> tags for hyperlinks
  createdAt: Timestamp;
}

export interface TeachingItem {
  id: string;
  orgName: string;
  orgLink: string;  // the title is always this hyperlink
  role: string;
  date: string;
  location: string;
  bullets: string;  // rich text - user can include <a> tags
  createdAt: Timestamp;
}

export interface TalkItem {
  id: string;
  title: string;
  venue: string;
  invited: boolean;
  videoUrl: string;
  createdAt: Timestamp;
}

// ============================================================
// Helpers
// ============================================================

export function isFirebaseReady(): boolean {
  return db !== null;
}

// ============================================================
// News
// ============================================================

export async function fetchNews(): Promise<NewsItem[]> {
  if (!db) return [];
  try {
    const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      date: d.data().date,
      content: d.data().content,
      createdAt: d.data().createdAt,
    }));
  } catch (e) {
    console.warn("Failed to fetch news:", e);
    return [];
  }
}

export async function addNews(date: string, content: string): Promise<string> {
  if (!db) throw new Error("Firebase not configured. Set your Firebase config in .env.local");
  const docRef = await addDoc(collection(db, "news"), {
    date,
    content,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function deleteNews(id: string): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await deleteDoc(doc(db, "news", id));
}

// ============================================================
// Blog
// ============================================================

export async function fetchBlogs(): Promise<BlogItem[]> {
  if (!db) return [];
  try {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      title: d.data().title,
      description: d.data().description,
      date: d.data().date,
      readTime: d.data().readTime,
      tags: d.data().tags,
      category: d.data().category,
      content: d.data().content,
      createdAt: d.data().createdAt,
    }));
  } catch (e) {
    console.warn("Failed to fetch blogs:", e);
    return [];
  }
}

export async function addBlog(data: Omit<BlogItem, 'id' | 'createdAt'>): Promise<string> {
  if (!db) throw new Error("Firebase not configured. Set your Firebase config in .env.local");
  const docRef = await addDoc(collection(db, "blogs"), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function deleteBlog(id: string): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await deleteDoc(doc(db, "blogs", id));
}

// ============================================================
// Publications
// ============================================================

export async function fetchPublications(): Promise<PublicationItem[]> {
  if (!db) return [];
  try {
    const q = query(collection(db, "publications"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      title: d.data().title,
      authors: d.data().authors,
      venue: d.data().venue,
      year: d.data().year,
      abstract: d.data().abstract,
      pdfUrl: d.data().pdfUrl,
      createdAt: d.data().createdAt,
    }));
  } catch (e) {
    console.warn("Failed to fetch publications:", e);
    return [];
  }
}

export async function addPublication(data: Omit<PublicationItem, 'id' | 'createdAt'>): Promise<string> {
  if (!db) throw new Error("Firebase not configured. Set your Firebase config in .env.local");
  const docRef = await addDoc(collection(db, "publications"), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function deletePublication(id: string): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await deleteDoc(doc(db, "publications", id));
}

// ============================================================
// Experiences
// ============================================================

export async function fetchExperiences(): Promise<ExperienceItem[]> {
  if (!db) return [];
  try {
    const q = query(collection(db, "experiences"), orderBy("dateRange", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      type: d.data().type,
      institution: d.data().institution,
      institutionLink: d.data().institutionLink,
      degree: d.data().degree,
      dateRange: d.data().dateRange,
      location: d.data().location,
      details: d.data().details,
      createdAt: d.data().createdAt,
    }));
  } catch (e) {
    console.warn("Failed to fetch experiences:", e);
    return [];
  }
}

export async function addExperience(data: Omit<ExperienceItem, 'id' | 'createdAt'>): Promise<string> {
  if (!db) throw new Error("Firebase not configured. Set your Firebase config in .env.local");
  const docRef = await addDoc(collection(db, "experiences"), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function deleteExperience(id: string): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await deleteDoc(doc(db, "experiences", id));
}

// ============================================================
// Teaching
// ============================================================

export async function fetchTeaching(): Promise<TeachingItem[]> {
  if (!db) return [];
  try {
    const q = query(collection(db, "teaching"), orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      orgName: d.data().orgName,
      orgLink: d.data().orgLink,
      role: d.data().role,
      date: d.data().date,
      location: d.data().location,
      bullets: d.data().bullets,
      createdAt: d.data().createdAt,
    }));
  } catch (e) {
    console.warn("Failed to fetch teaching:", e);
    return [];
  }
}

export async function addTeaching(data: Omit<TeachingItem, 'id' | 'createdAt'>): Promise<string> {
  if (!db) throw new Error("Firebase not configured. Set your Firebase config in .env.local");
  const docRef = await addDoc(collection(db, "teaching"), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function deleteTeaching(id: string): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await deleteDoc(doc(db, "teaching", id));
}

// ============================================================
// Talks
// ============================================================

export async function fetchTalks(): Promise<TalkItem[]> {
  if (!db) return [];
  try {
    const q = query(collection(db, "talks"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      title: d.data().title,
      venue: d.data().venue,
      invited: d.data().invited,
      videoUrl: d.data().videoUrl,
      createdAt: d.data().createdAt,
    }));
  } catch (e) {
    console.warn("Failed to fetch talks:", e);
    return [];
  }
}

export async function addTalk(data: Omit<TalkItem, 'id' | 'createdAt'>): Promise<string> {
  if (!db) throw new Error("Firebase not configured. Set your Firebase config in .env.local");
  const docRef = await addDoc(collection(db, "talks"), {
    ...data,
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function deleteTalk(id: string): Promise<void> {
  if (!db) throw new Error("Firebase not configured");
  await deleteDoc(doc(db, "talks", id));
}

export { db };