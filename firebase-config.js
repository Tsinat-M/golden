
// ===================================================================
//  Golden Lounge Oslo – Firebase-oppsett
//  Verdiene under er hentet fra Firebase-konsollen for prosjektet
//  "golden-lounge-oslo". Disse er trygge å ha i nettsidens kode –
//  sikkerheten styres av reglene i firestore.rules.
// ===================================================================
 
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-storage.js";
 
const firebaseConfig = {
  apiKey: "AIzaSyC54ZjwAS7KI8_PKBZhfPaWhCCjhCzCQjI",
  authDomain: "golden-lounge-oslo.firebaseapp.com",
  projectId: "golden-lounge-oslo",
  storageBucket: "golden-lounge-oslo.firebasestorage.app",
  messagingSenderId: "724479481618",
  appId: "1:724479481618:web:5797f4f5d2a8b739e505cb",
  measurementId: "G-J2CZGW8ZDP"
};
 
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);