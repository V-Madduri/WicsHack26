// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgZBOdQZh0N7q6kxKr2NhQ62vsHJTTdvA",
  authDomain: "sonicscout-650ef.firebaseapp.com",
  projectId: "sonicscout-650ef",
  storageBucket: "sonicscout-650ef.firebasestorage.app",
  messagingSenderId: "498423874058",
  appId: "1:498423874058:web:3a99993e690feb1b0455f3",
  measurementId: "G-7XYREZ48T7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

