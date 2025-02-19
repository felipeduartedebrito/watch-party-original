import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDk5V2hPYEZB8E4jOqUZOJ0mBpnv5yK87A",
  authDomain: "watch-party-9db43.firebaseapp.com",
  projectId: "watch-party-9db43",
  storageBucket: "watch-party-9db43.firebasestorage.app",
  messagingSenderId: "180128749425",
  appId: "1:180128749425:web:f342c251ce21d4475008d0",
  measurementId: "G-ZQSHDQKLGR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };