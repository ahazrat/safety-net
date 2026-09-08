import { collection, doc, getDoc, getDocs, addDoc, setDoc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore'
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

export function conversationIdFor(uidA, uidB) {
  return [uidA, uidB].sort().join('_')
}

export async function getOrCreateConversation(otherUid) {
  const uid = auth.currentUser && auth.currentUser.uid
  if (!uid) throw new Error('Must be signed in to message')
  if (!otherUid || otherUid === uid) {
    throw new Error('Pick another user to message')
  }
  const id = conversationIdFor(uid, otherUid)
  const ref = doc(db, 'conversations', id)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      participants: [uid, otherUid].sort(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }
  return id
}

export async function sendMessage(otherUid, text) {
  const uid = auth.currentUser && auth.currentUser.uid
  if (!uid) throw new Error('Must be signed in to message')
  const body = String(text || '').trim()
  if (!body) throw new Error('Message cannot be empty')
  if (body.length >= 2000) throw new Error('Message is too long')
  const cid = await getOrCreateConversation(otherUid)
  const participants = [uid, otherUid].sort()
  await addDoc(collection(db, 'conversations', cid, 'messages'), {
    fromUid: uid,
    text: body,
    participants,
    createdAt: serverTimestamp(),
  })
  await updateDoc(doc(db, 'conversations', cid), { updatedAt: serverTimestamp() })
  return cid
}

export async function listMyConversations() {
  const uid = auth.currentUser && auth.currentUser.uid
  if (!uid) return []
  const snapshot = await getDocs(
    query(collection(db, 'conversations'), where('participants', 'array-contains', uid))
  )
  return mapDocs(snapshot)
}

export async function listMessages(conversationId) {
  const uid = auth.currentUser && auth.currentUser.uid
  if (!uid) return []
  const snapshot = await getDocs(
    query(
      collection(db, 'conversations', conversationId, 'messages'),
      where('participants', 'array-contains', uid)
    )
  )
  return mapDocs(snapshot).sort((a, b) => {
    const at = a.createdAt && a.createdAt.seconds ? a.createdAt.seconds : 0
    const bt = b.createdAt && b.createdAt.seconds ? b.createdAt.seconds : 0
    return at - bt
  })
}

export function otherParticipant(conversation, uid) {
  const parts = (conversation && conversation.participants) || []
  return parts.find(p => p !== uid) || parts[0] || ''
}

export function uploadFile(storagePath, data) {
  const storage = getStorage(app)
  return uploadBytes(ref(storage, storagePath), data)
}
