// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJiWATPtxkoDiA2V-TJzRkTsHGMocMTWY",
  authDomain: "snap-clone-543d7.firebaseapp.com",
  projectId: "snap-clone-543d7",
  storageBucket: "snap-clone-543d7.appspot.com",
  messagingSenderId: "448560574039",
  appId: "1:448560574039:web:ac4d8652a600b0b00ffd12",
  measurementId: "G-KJWXV2PECP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
//
// const analytics = getAnalytics(app);

export { auth, db };
