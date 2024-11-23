// Import the functions you need from the SDKs you need
import app from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeD8fQFpAL7LhBTa2_3E8wiqA-lib2H1s",
  authDomain: "whatsappclone-c5a86.firebaseapp.com",
  databaseURL: "https://whatsappclone-c5a86-default-rtdb.firebaseio.com",
  projectId: "whatsappclone-c5a86",
  storageBucket: "whatsappclone-c5a86.firebasestorage.app",
  messagingSenderId: "472967082248",
  appId: "1:472967082248:web:c3f0adee0ed6d8ecb0fcbd"
};

// Initialize Firebase
const firebase = app.initializeApp(firebaseConfig);
export default firebase;