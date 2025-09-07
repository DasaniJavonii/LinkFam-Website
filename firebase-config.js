import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAhFXINT8ULqKNJStUreJ9rlDbOl3Xjm1c",
  authDomain: "tapin-f478a.firebaseapp.com",
  projectId: "tapin-f478a",
  storageBucket: "tapin-f478a.appspot.com",
  messagingSenderId: "911526300629",
  appId: "1:911526300629:web:e2f7f256a69027d1d70b5c",
  measurementId: "G-G5J4F10YWF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
