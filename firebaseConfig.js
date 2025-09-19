import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDX5LCq58ND9WfhGy0qpEZ6NWwbBndwRb8",
  authDomain: "bookify-72db9.firebaseapp.com",
  projectId: "bookify-72db9",
  storageBucket: "bookify-72db9.firebasestorage.app",
  messagingSenderId: "709554142466",
  appId: "1:709554142466:web:391ebb5f377e4e2a6a561b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };