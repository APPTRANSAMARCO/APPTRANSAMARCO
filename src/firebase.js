// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAT7_C7qz45vGCM4ziAiChY2zwQWZ4AQKM",
    authDomain: "apptransamarco-c4c2a.firebaseapp.com",
    databaseURL: "https://apptransamarco-c4c2a-default-rtdb.firebaseio.com",
    projectId: "apptransamarco-c4c2a",
    storageBucket: "apptransamarco-c4c2a.appspot.com",
    messagingSenderId: "850467103209",
    appId: "1:850467103209:web:fa699f91af7af30a4feb78",
    measurementId: "G-2SZXV6DZ0M"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

export { auth, database, storage };
