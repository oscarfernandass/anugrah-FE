// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBieMZr5up9EWlJmlaXKLyGIFKBpT4UoR0",
  authDomain: "anugrah-cyklones.firebaseapp.com",
  projectId: "anugrah-cyklones",
  storageBucket: "anugrah-cyklones.firebasestorage.app",
  messagingSenderId: "627379743453",
  appId: "1:627379743453:web:74e3784c9d9a178caf0934"
};

const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
const storage = getStorage(app);

export { database, storage };