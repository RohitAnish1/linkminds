// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth , GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDogabl_BcPolccV6OnCz9WcsIukOeCTXo",
    authDomain: "linkminds-d46db.firebaseapp.com",
    projectId: "linkminds-d46db",
    storageBucket: "linkminds-d46db.appspot.com",
    messagingSenderId: "756957605201",
    appId: "1:756957605201:web:9d7e7780d81425e12ab770",
    measurementId: "G-9EHCVLEFXL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth,provider, db };
