// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getFirestore, collection, doc, getDocs, addDoc, deleteDoc } from 'firebase/firestore/lite'

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
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const analytics = getAnalytics(app)

async function getCollection(col) {
  const c = collection(db, col)
  const snapshot = await getDocs(c)
  const docArr = snapshot.docs.map(doc => {
    let loadedDoc = doc.data()
    loadedDoc['id'] = doc.id
    return loadedDoc
  })
  console.log(docArr)
  return docArr
}

async function createNewDoc(col, doc) {
  const c = collection(db, col)
  const docRef = await addDoc(c, doc)
  console.log("Document written with ID: ", docRef.id);
}

async function deleteDocument(c, did) {
  await deleteDoc(doc(db, c, did));
  console.log('Deleted document ' + did + 'in collection ' + c)
}

export default app

export { db, getCollection, createNewDoc }
