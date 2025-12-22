import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Firebase configuration from environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBEngkGj-us_Jyf-D_or0H9qbEnySGqss0",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "valkry-ed5c2.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "valkry-ed5c2",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "valkry-ed5c2.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "395028222152",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:395028222152:web:2d9cb122484ba888aa55fd",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-DWXGY75PBF",
    databaseURL: "https://valkry-ed5c2-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
// Add scopes to get profile info including photo
googleProvider.addScope('profile');
googleProvider.addScope('email');
export const database = getDatabase(app);
