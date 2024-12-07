// Import the functions you need from the SDKs you need
import app from "firebase/compat/app";
import "firebase/compat/firestore";
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


import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jsczitilzorbeapnotnp.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzY3ppdGlsem9yYmVhcG5vdG5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI5MDE0NTMsImV4cCI6MjA0ODQ3NzQ1M30.9WakA1jeGzwNYvEvZ7-ibG1J1kmSLisDsgWrsBV4Nds";
const supabase = createClient(supabaseUrl, supabaseKey);
export { supabase };