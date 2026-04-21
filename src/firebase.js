import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBcj9EB0w21RdAF_LHCM4HYGlCM1fZwYzA",
  authDomain: "collabrix-india.firebaseapp.com",
  projectId: "collabrix-india",
  storageBucket: "collabrix-india.firebasestorage.app",
  messagingSenderId: "193398686254",
  appId: "1:193398686254:web:55ba2ed3b9dd118842d5bf",
  measurementId: "G-1JEQ8LBMYN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);