import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAR039iEeX1v34XBptfqz_5sAkhuHn0oDI",
  authDomain: "flashcards-app-7a15d.firebaseapp.com",
  projectId: "flashcards-app-7a15d",
  storageBucket: "flashcards-app-7a15d.appspot.com",
  messagingSenderId: "579118308229",
  appId: "1:579118308229:web:0140309fdada2d973202ec",
  measurementId: "G-5DHEYZT61X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const firestore = getFirestore(app);
export const storage = getStorage(app);
