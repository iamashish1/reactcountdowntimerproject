// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCxmBRI4SoWSFr0D9SwyMcuAvtqIzfPd6o",
  authDomain: "carpoolapp-3b5c0.firebaseapp.com",
  projectId: "carpoolapp-3b5c0",
  storageBucket: "carpoolapp-3b5c0.appspot.com",
  messagingSenderId: "639317273644",
  appId: "1:639317273644:web:d942fa61a0290bdf8c7589",
  measurementId: "G-KBPE92BFQ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);