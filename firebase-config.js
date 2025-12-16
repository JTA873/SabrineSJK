// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, setDoc, doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6hNLg-Ad2XihTrVD5P-3wI2H3kl6IUVg",
  authDomain: "sandrinesjk.firebaseapp.com",
  projectId: "sandrinesjk",
  storageBucket: "sandrinesjk.firebasestorage.app",
  messagingSenderId: "481099745596",
  appId: "1:481099745596:web:af7fe189c144ba2a44f639",
  measurementId: "G-XS6F46SLVT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Export pour utilisation dans le site
export { app, analytics, db, auth, collection, addDoc, getDocs, query, where, orderBy, setDoc, doc, getDoc, updateDoc, deleteDoc, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut };
