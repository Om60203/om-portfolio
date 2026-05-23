import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAYTln2xGm5QCS-9pqfXUO2trSB1Pdhi0o",
  authDomain: "om-portfolio-a562b.firebaseapp.com",
  projectId: "om-portfolio-a562b",
  storageBucket: "om-portfolio-a562b.firebasestorage.app",
  messagingSenderId: "424842772366",
  appId: "1:424842772366:web:f530401fce9559ade5aedf"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);