import { collection, doc, getDoc, getDocs, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { getStorage, ref, uploadBytes } from 'firebase/storage'
import { db, app, auth } from './app'

export async function getCollection(col) {
  const snapshot = await getDocs(collection(db, col))
  return snapshot.docs.map(d => ({ ...d.data(), id: d.id }))
}

export async function getDocument(col, id) {
  const snapshot = await getDoc(doc(db, col, id))
  return snapshot.exists() ? { ...snapshot.data(), id: snapshot.id } : null
}

export async function createNewDoc(col, data) {
  const docRef = await addDoc(collection(db, col), data)
  return docRef.id
}

// Listings are owner-scoped in firestore.rules: create is allowed only when
// ownerUid matches the signed-in user. Stamp it here so callers cannot forget.
export async function createListing(data) {
  const uid = auth.currentUser && auth.currentUser.uid
  if (!uid) {
    throw new Error('Must be signed in to create a listing')
  }
  return createNewDoc('listings', {
    ...data,
    ownerUid: uid,
    createdAt: serverTimestamp(),
  })
}

export async function deleteDocument(col, id) {
  await deleteDoc(doc(db, col, id))
}

export function uploadFile(storagePath, data) {
  const storage = getStorage(app)
  return uploadBytes(ref(storage, storagePath), data)
}
