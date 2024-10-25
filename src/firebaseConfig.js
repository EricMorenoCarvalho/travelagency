import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDP2gq1SBKeRToVyemDDe9E8y4eNcCW5V0",
  authDomain: "travelagency-3a972.firebaseapp.com",
  projectId: "travelagency-3a972",
  storageBucket: "travelagency-3a972.appspot.com",
  messagingSenderId: "203416513179",
  appId: "1:203416513179:web:55ba7216622661c97f743e",
  measurementId: "G-KM1Q1TSBTC"
};

const appFirebase = initializeApp(firebaseConfig);
const analytics = getAnalytics(appFirebase);
export const auth = getAuth(appFirebase);
export default appFirebase;