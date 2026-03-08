import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB3eEa0pQyriZWuwmSiNqgCKVC2moiuZ1I",
  authDomain: "fillzapp.firebaseapp.com",
  projectId: "fillzapp",
  storageBucket: "fillzapp.firebasestorage.app",
  messagingSenderId: "566496609753",
  appId: "1:566496609753:web:0fe4de3fd9454bdf1345c8",
  measurementId: "G-XK0MN7KX8D",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
