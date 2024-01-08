import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBAT5cdLu_SdMgYb90xVNNcqjcFmhTkMHc",
  authDomain: "tickets-bf89b.firebaseapp.com",
  projectId: "tickets-bf89b",
  storageBucket: "tickets-bf89b.appspot.com",
  messagingSenderId: "891321999224",
  appId: "1:891321999224:web:e7a7f334cf632203aeb28d",
  measurementId: "G-1RFC3X4KMY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };