// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmh1j8PBh212MxA59C3_clR0yyxt6ln1w",
  authDomain: "newapp-eb613.firebaseapp.com",
  databaseURL: "https://newapp-eb613-default-rtdb.firebaseio.com",
  projectId: "newapp-eb613",
  storageBucket: "newapp-eb613.appspot.com",
  messagingSenderId: "1013906103597",
  appId: "1:1013906103597:web:3cf20df51e448893f287a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const database = getDatabase(app);
export {
  db,
  database,
}
