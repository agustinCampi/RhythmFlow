// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA7KEOnPJWlLC_eWm-mhp74A2LQUlRsBIk",
  authDomain: "rhythmflow-r0mt5.firebaseapp.com",
  projectId: "rhythmflow-r0mt5",
  storageBucket: "rhythmflow-r0mt5.appspot.com",
  messagingSenderId: "58544355493",
  appId: "1:58544355493:web:4febce5985268bf38e354c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
