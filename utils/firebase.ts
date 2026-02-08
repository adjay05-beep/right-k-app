import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBjOOK-UrgvrrOCuDpTHHgQEJBOSrF69fw",
    authDomain: "right-k.firebaseapp.com",
    projectId: "right-k",
    storageBucket: "right-k.firebasestorage.app",
    messagingSenderId: "439875629908",
    appId: "1:439875629908:web:4e6498bc24e578fc964ec1",
    measurementId: "G-NEBP3F36DK"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { app, auth };

