// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqoXd3qffrtNISBJlzjucmz4W1SWwAGc4",
  authDomain: "d-web-39027.firebaseapp.com",
  projectId: "d-web-39027",
  storageBucket: "d-web-39027.appspot.com",
  messagingSenderId: "1032718342627",
  appId: "1:1032718342627:web:ed21bf70837f6eb338e8d6",
  measurementId: "G-H1ZRV1B6FX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authFirebase = getAuth(app)
export const storage = getStorage(app);
// const analytics = getAnalytics(app);