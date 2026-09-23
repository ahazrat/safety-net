import { collection, doc, getDoc, getDocs, addDoc, setDoc, updateDoc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore'
import { getStorage, ref, uploadBytes } from 'firebase/storage'
import { db, app } from './app'
import { auth } from './auth'
import { normalizeListingType } from '../utils/listingType'
import { normalizeTeamSize, teamSizeOf, rosterOf, isRosterFull } from '../utils/team'

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
  const {
    assigneeUid: _ignored,
    paymentStatus: _ps,
    executedPriceCents: _ex,
    stripePaymentIntentId: _pi,
    stripeCheckoutSessionId: _cs,
    stripeConnectAccountId: _ca,
    btcAdd: _btc,
    proposedExecutedPriceCentsOwner: _po,
    proposedExecutedPriceCentsAssignee: _pa,
    executedPriceAckOwner: _ao,
    executedPriceAckAssignee: _aa,
    rosterUids: _roster,
    ...rest
  } = data
  const listing = {
    ...rest,
    visibility,
    status: 'open',
    listingType: normalizeListingType(rest.listingType, rest.title),
    teamSize: normalizeTeamSize(rest.teamSize),
    ownerUid: uid,
    createdAt: serverTimestamp(),
  }
  if (listing.listedPriceCents != null && listing.listedPriceCents !== '') {
    const cents = Number(listing.listedPriceCents)
    if (!Number.isInteger(cents) || cents < 0) {
      throw new Error('listedPriceCents must be an integer >= 0')
    }
    listing.listedPriceCents = cents
  } else {
    delete listing.listedPriceCents
  }
  return createNewDoc('listings', listing)
}

export const LISTING_STATUSES = ['open', 'accepted', 'in_progress', 'done']

export function listingStatusOf(listing) {
  const status = listing && listing.status
  return LISTING_STATUSES.includes(status) ? status : 'open'
}

export async function listAssignedListings() {
  const uid = auth.currentUser && auth.currentUser.uid
  if (!uid) return []
  const snapshot = await getDocs(
    query(collection(db, 'listings'), where('assigneeUid', '==', uid))
  )
  return mapDocs(snapshot)
}

export async function listRosterListings() {
  const uid = auth.currentUser && auth.currentUser.uid
  if (!uid) return []
  const snapshot = await getDocs(
    query(collection(db, 'listings'), where('rosterUids', 'array-contains', uid))
  )
  return mapDocs(snapshot)
}

export async function listMyJobs() {
  const mine = await listMyListings()
  const assigned = await listAssignedListings()
  const roster = await listRosterListings()
  const byId = new Map()
  for (const listing of mine.concat(assigned, roster)) {
    byId.set(listing.id, listing)
  }
  return Array.from(byId.values())
}

export async function acceptListing(listingId) {
  const uid = auth.currentUser && auth.currentUser.uid
  if (!uid) throw new Error('Must be signed in to accept a job')
  const listing = await getDocument('listings', listingId)
  if (!listing) throw new Error('Listing not found')
  if (listing.ownerUid === uid) throw new Error('You cannot accept your own listing')
  const size = teamSizeOf(listing)
  const status = listingStatusOf(listing)
  if (status !== 'open') throw new Error('This job is no longer open')
  await updateDoc(doc(db, 'listings', listingId), {
    status: 'accepted',
    assigneeUid: uid,
  })
  if (size > 1) {
    await updateDoc(doc(db, 'listings', listingId), {
      rosterUids: [uid],
    })
  }
}

export async function requestToJoin(listingId) {
  const uid = auth.currentUser && auth.currentUser.uid
  if (!uid) throw new Error('Must be signed in to join a team')
  const listing = await getDocument('listings', listingId)
  if (!listing) throw new Error('Listing not found')
  if (listing.ownerUid === uid) throw new Error('You cannot join your own listing')
  if (teamSizeOf(listing) <= 1) throw new Error('This is a solo job')
  if (listing.assigneeUid === uid || rosterOf(listing).includes(uid)) {
    throw new Error('You are already on this roster')
  }
  if (isRosterFull(listing)) throw new Error('This team is full')
  const status = listingStatusOf(listing)
  if (status !== 'accepted') throw new Error('Wait until a captain accepts this job')
  await setDoc(doc(db, 'listings', listingId, 'joinRequests', uid), { uid })
}

export async function listJoinRequests(listingId) {
  const snapshot = await getDocs(collection(db, 'listings', listingId, 'joinRequests'))
  return mapDocs(snapshot)
}

export async function addRosterMember(listingId, memberUid) {
  const uid = auth.currentUser && auth.currentUser.uid
  if (!uid) throw new Error('Must be signed in')
  const listing = await getDocument('listings', listingId)
  if (!listing) throw new Error('Listing not found')
  if (listing.assigneeUid !== uid) throw new Error('Only the captain can change the roster')
  if (!memberUid || memberUid === uid) throw new Error('The captain is already on the roster')
  const roster = rosterOf(listing)
  const base = roster.length ? roster : [uid]
  if (base.includes(memberUid)) throw new Error('That person is already on the roster')
  if (base.length >= teamSizeOf(listing)) throw new Error('This team is full')
  await updateDoc(doc(db, 'listings', listingId), {
    rosterUids: base.concat(memberUid),
  })
  await deleteDoc(doc(db, 'listings', listingId, 'joinRequests', memberUid))
}

export async function removeRosterMember(listingId, memberUid) {
  const uid = auth.currentUser && auth.currentUser.uid
  if (!uid) throw new Error('Must be signed in')
  const listing = await getDocument('listings', listingId)
  if (!listing) throw new Error('Listing not found')
  if (listing.assigneeUid !== uid) throw new Error('Only the captain can change the roster')
  if (!memberUid || memberUid === uid) throw new Error('The captain stays on the roster')
  const roster = rosterOf(listing)
  if (!roster.includes(memberUid)) throw new Error('That person is not on the roster')
  const next = roster.filter(id => id !== memberUid)
  if (!next.length || next[0] !== uid) throw new Error('The captain stays on the roster')
  await updateDoc(doc(db, 'listings', listingId), { rosterUids: next })
}

function offPlatformParty(listing) {
  const uid = auth.currentUser && auth.currentUser.uid
  if (!uid) throw new Error('Must be signed in')
  if (listing && listing.ownerUid === uid) return 'owner'
  if (listing && listing.assigneeUid === uid) return 'assignee'
  throw new Error('Only the poster or assignee can record an off-platform price')
}

export async function proposeOffPlatformPrice(listingId, cents) {
  const n = Number(cents)
  if (!Number.isInteger(n) || n < 0) {
    throw new Error('Price must be a whole number of cents')
  }
  const listing = await getDocument('listings', listingId)
  if (!listing) throw new Error('Listing not found')
  const party = offPlatformParty(listing)
  const patch = party === 'owner'
    ? { proposedExecutedPriceCentsOwner: n, executedPriceAckOwner: false }
    : { proposedExecutedPriceCentsAssignee: n, executedPriceAckAssignee: false }
  await updateDoc(doc(db, 'listings', listingId), patch)
}

export async function ackOffPlatformPrice(listingId) {
  const listing = await getDocument('listings', listingId)
  if (!listing) throw new Error('Listing not found')
  const party = offPlatformParty(listing)
  const cents = party === 'owner'
    ? listing.proposedExecutedPriceCentsOwner
    : listing.proposedExecutedPriceCentsAssignee
  if (!Number.isInteger(cents) || cents < 0) {
    throw new Error('Propose a price before agreeing')
  }
  const patch = party === 'owner'
    ? { executedPriceAckOwner: true }
    : { executedPriceAckAssignee: true }
  await updateDoc(doc(db, 'listings', listingId), patch)
}

export async function setListingStatus(listingId, status) {
  if (!LISTING_STATUSES.includes(status)) {
    throw new Error('Unknown job status')
  }
  const uid = auth.currentUser && auth.currentUser.uid
  if (!uid) throw new Error('Must be signed in')
  if (status === 'in_progress') {
    const listing = await getDocument('listings', listingId)
    if (listing && teamSizeOf(listing) > 1 && !isRosterFull(listing)) {
      throw new Error('Fill the roster before starting this job')
    }
  }
  await updateDoc(doc(db, 'listings', listingId), { status })
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
