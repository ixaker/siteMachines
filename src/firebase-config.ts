import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDN_87XDf7ml2XbburJJvMGeLRkdz2cHaw",
  authDomain: "qpart-machines.firebaseapp.com",
  projectId: "qpart-machines",
  storageBucket: "qpart-machines.firebasestorage.app",
  messagingSenderId: "853771405723",
  appId: "1:853771405723:web:d1c448b1293331435fb93e",
  measurementId: "G-2KV3R6E9FZ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const firestore = getFirestore(app);
// const analytics = getAnalytics(app);
// const auth = getAuth(app);

export { app, db, firestore };
