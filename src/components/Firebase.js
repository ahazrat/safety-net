// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDoTCzMO1Gg0mjuAk8_ie1Yy7uXus2hpic",
  authDomain: "safety-net-2022.firebaseapp.com",
  projectId: "safety-net-2022",
  storageBucket: "safety-net-2022.appspot.com",
  messagingSenderId: "192593256362",
  appId: "1:192593256362:web:d65c7d7c0f789ff1dbd5d3",
  measurementId: "G-TKKV85SWQX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

async function getListings() {
  const listingsCol = collection(db, 'listings');
  const citySnapshot = await getDocs(listingsCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  console.log(cityList)
  return cityList;
}

export default app;

export { db, getListings };
