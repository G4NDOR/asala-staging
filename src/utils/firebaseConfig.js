// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAP6WoqhE-csY6vZj8TiOWqgK8a-oYYK2E",
    authDomain: "asala-staging.firebaseapp.com",
    projectId: "asala-staging",
    storageBucket: "asala-staging.appspot.com",
    messagingSenderId: "285051155124",
    appId: "1:285051155124:web:3a8b3660a883476737dde1",
    measurementId: "G-HKXTR051NG"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a Firestore instance
const db = getFirestore(app);

const analytics = getAnalytics(app);
// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

// Initialize Firebase Storage
const storage = getStorage(app);

export { db, analytics, database, storage };
