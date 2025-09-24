import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDov8Gqq8UeWsdCZVCvWsV3jaMMm3zfLcw",
  authDomain: "inspira-8ee1e.firebaseapp.com",
  projectId: "inspira-8ee1e",
  storageBucket: "inspira-8ee1e.firebasestorage.app",
  messagingSenderId: "381925145088",
  appId: "1:381925145088:web:4a8a6a61cfab17abd076e5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
