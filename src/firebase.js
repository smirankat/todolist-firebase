import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjEb_w-xlrv4QVDlH9IsA6D81mssV3Uvw",
  authDomain: "todolist-aab10.firebaseapp.com",
  projectId: "todolist-aab10",
  storageBucket: "todolist-aab10.appspot.com",
  messagingSenderId: "614705881331",
  appId: "1:614705881331:web:8567598bfc823cbe011786",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
