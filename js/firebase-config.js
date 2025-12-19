// Firebase Configuration
// REPLACE THESE VALUES WITH YOUR FIREBASE PROJECT CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyBO2TJ3OVVyEQgnF6DSZVtDVxryEV2E99E",
  authDomain: "shuruegroup-3f1c6.firebaseapp.com",
  projectId: "shuruegroup-3f1c6",
  storageBucket: "shuruegroup-3f1c6.firebasestorage.app",
  messagingSenderId: "295273440954",
  appId: "1:295273440954:web:c55015fa62ec6c104bc483",
  measurementId: "G-TJ4Q5DLFWG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
