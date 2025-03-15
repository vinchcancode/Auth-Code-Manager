// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAVuxRQfoRHfgwxn4nPHpjiTH4_MMLA4Fs",
  authDomain: "auth-code-manager.firebaseapp.com",
  projectId: "auth-code-manager",
  storageBucket: "auth-code-manager.appspot.com", // ✅ Fixed storageBucket
  messagingSenderId: "58509409186",
  appId: "1:58509409186:web:86507c489f69f01defd0fb",
  measurementId: "G-KRM8TXBP1Z",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
