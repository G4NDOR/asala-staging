// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
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
const analytics = getAnalytics(app);