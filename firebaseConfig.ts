import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence, initializeFirestore, FirestoreSettings } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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

let app;
if (!getApps().length) {
  console.log('Inicializando Firebase App');
  app = initializeApp(firebaseConfig);
} else {
  console.log('Firebase App já inicializado');
  app = getApp();
}

// Firestore settings with cache size
const firestoreSettings: FirestoreSettings = {
  cacheSizeBytes: 10485760 // 10 MB cache size
};

const db = initializeFirestore(app, firestoreSettings);

enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.log('Persistência falhou: múltiplas abas abertas');
  } else if (err.code == 'unimplemented') {
    console.log('Persistência não suportada');
  }
});

const auth = getAuth(app);

export { db, auth };