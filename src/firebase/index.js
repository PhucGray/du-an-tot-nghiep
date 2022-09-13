import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCHr7xyo3gidxWzOVLJ27MireF2-vBfQJQ",
  authDomain: "tot-nghiep-csharp.firebaseapp.com",
  projectId: "tot-nghiep-csharp",
  storageBucket: "tot-nghiep-csharp.appspot.com",
  messagingSenderId: "845741545804",
  appId: "1:845741545804:web:1b0021719636177f0fd7e9",
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
