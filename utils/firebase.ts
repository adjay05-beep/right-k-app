import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyD7hQiL2eM-CMSJuSaqzsjCAFHsG8y4rFw",
    authDomain: "right-k.firebaseapp.com",
    projectId: "right-k",
    storageBucket: "right-k.firebasestorage.app",
    messagingSenderId: "439875629908",
    appId: "1:439875629908:web:4e6498bc24e578fc964ec1",
    measurementId: "G-NEBP3F36DK"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Cloud Firestore
const db = getFirestore(app);

export { app, auth, db };

