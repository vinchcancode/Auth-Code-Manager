// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc, doc } from "firebase/firestore";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAVuxRQfoRHfgwxn4nPHpjiTH4_MMLA4Fs",
  authDomain: "auth-code-manager.firebaseapp.com",
  projectId: "auth-code-manager",
  storageBucket: "auth-code-manager.firebasestorage.app",
  messagingSenderId: "58509409186",
  appId: "1:58509409186:web:86507c489f69f01defd0fb",
  measurementId: "G-KRM8TXBP1Z"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, collection, getDocs, addDoc, doc };

