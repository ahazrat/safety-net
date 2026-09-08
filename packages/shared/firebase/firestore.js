import { collection, doc, getDoc, getDocs, addDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore'
import { getStorage, ref, uploadBytes } from 'firebase/storage'
import { db, app, auth } from './app'

export async function getCollection(col) {
  const snapshot = await getDocs(collection(db, col))
  return snapshot.docs.map(d => ({ ...d.data(), id: d.id }))
}

function mapDocs(snapshot) {
  return snapshot.docs.map(d => ({ ...d.data(), id: d.id }))
}

// List queries must match firestore.rules: public listings, or the
// caller's own docs. Unfiltered collection scans are denied.
export async function listPublicListings() {
  const snapshot = await getDocs(
    query(collection(db, 'listings'), where('visibility', '==', 'public'))
  )
  return mapDocs(snapshot)
}

export async function listMyListings() {
  const uid = auth.currentUser && auth.currentUser.uid
  if (!uid) return []
  const snapshot = await getDocs(
    query(collection(db, 'listings'), where('ownerUid', '==', uid))
  )
  return mapDocs(snapshot)
}

export async function listVisibleListings() {
  const publicListings = await listPublicListings()
  const mine = await listMyListings()
  const byId = new Map()
  for (const listing of publicListings.concat(mine)) {
    byId.set(listing.id, listing)
  }
  return Array.from(byId.values())
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
  const visibility = data.visibility === 'private' ? 'private' : 'public'
  return createNewDoc('listings', {
    ...data,
    visibility,
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
