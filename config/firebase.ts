// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { initializeAuth,getReactNativePersistence } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBaw4VeO4l4xZTSxnGwJrjlOIRtXRQeRrg",
    authDomain: "expense-tracker-2991c.firebaseapp.com",
    projectId: "expense-tracker-2991c",
    storageBucket: "expense-tracker-2991c.firebasestorage.app",
    messagingSenderId: "417329478836",
    appId: "1:417329478836:web:2451f00a2042e00b1bebe1",
    measurementId: "G-MELXE577PB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// auth
export const auth = initializeAuth(app,{
    persistence: getReactNativePersistence(AsyncStorage)
}) 

// this line connect fireStore DB with app
export const fireStore = getFirestore(app)
