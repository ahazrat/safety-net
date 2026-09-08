// Ported from safety-net-expo's components/Firebase/firebase.js (Firebase v8
// namespaced class) to the v9 modular SDK, matching what the web app already
// uses. Platform-agnostic: no react-native or DOM imports, usable from both
// apps/web and apps/mobile.
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updatePassword,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc, setDoc, collection, getDocs, updateDoc, deleteField } from 'firebase/firestore'
import { db } from '../firebase/app'
import { auth } from '../firebase/auth'
import Roles from '../constants/Roles'

export function doCreateUserWithEmailAndPassword(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}

export function doSignInWithEmailAndPassword(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function doSignOut() {
  return signOut(auth)
}

export function doPasswordReset(email) {
  return sendPasswordResetEmail(auth, email)
}

export function doPasswordUpdate(password) {
  return updatePassword(auth.currentUser, password)
}

function publicProfilePayload(userData, badges = {}) {
  return {
    username: userData.username,
    badges,
  }
}

export async function createUser(userData) {
  // Never write ADMIN here — that role is granted only by an existing
  // admin (setUserAdminRole) or by a console bootstrap of the first admin.
  await setDoc(doc(db, 'users', userData.uid), {
    uid: userData.uid,
    username: userData.username,
    email: userData.email,
    roles: { [Roles.USER]: Roles.USER },
    badges: {},
  })
  await setDoc(doc(db, 'publicProfiles', userData.uid), publicProfilePayload(userData, {}))
}

export async function setUserBadge(uid, badge, grant) {
  const userRef = doc(db, 'users', uid)
  const publicRef = doc(db, 'publicProfiles', uid)
  const badgeUpdate = grant
    ? { [`badges.${badge}`]: badge }
    : { [`badges.${badge}`]: deleteField() }
  await updateDoc(userRef, badgeUpdate)
  try {
    await updateDoc(publicRef, badgeUpdate)
  } catch (err) {
    const snap = await getDoc(userRef)
    const username = (snap.data() && snap.data().username) || uid
    const badges = { ...((snap.data() && snap.data().badges) || {}) }
    if (grant) badges[badge] = badge
    else delete badges[badge]
    await setDoc(publicRef, { username, badges })
  }
}

export async function getPublicProfile(uid) {
  if (!uid) return null
  const snap = await getDoc(doc(db, 'publicProfiles', uid))
  return snap.exists() ? { uid, ...snap.data() } : null
}

export function setUserAdminRole(uid, grant) {
  const userRef = doc(db, 'users', uid)
  if (grant) {
    return updateDoc(userRef, { [`roles.${Roles.ADMIN}`]: Roles.ADMIN })
  }
  return updateDoc(userRef, { [`roles.${Roles.ADMIN}`]: deleteField() })
}

export async function getUser(uid) {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.data()
}

export async function getUsersArr() {
  const snapshot = await getDocs(collection(db, 'users'))
  return snapshot.docs.map(d => ({ ...d.data(), id: d.id }))
}

// Subscribes to auth state, enriching the Firebase auth user with the
// matching Firestore user doc (roles, username). Calls `next(authUser)` when
// signed in, `fallback()` when signed out. Returns the unsubscribe function.
export function onAuthUserListener(next, fallback) {
  return onAuthStateChanged(auth, async firebaseUser => {
    if (firebaseUser) {
      // getUser reads packages/shared/firebase/firestore.js `users/{uid}`, which
      // can fail (missing doc, security rules) independently of a successful
      // sign-in — don't let that failure hide a real auth state from the app.
      let userDoc = {}
      try {
        userDoc = (await getUser(firebaseUser.uid)) || {}
      } catch (err) {
        console.warn('onAuthUserListener: failed to load user doc', err)
      }
      if (!userDoc.roles) userDoc.roles = {}
      next({
        authUser: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          creationTime: firebaseUser.metadata.creationTime,
          lastSignInTime: firebaseUser.metadata.lastSignInTime,
          ...userDoc,
        },
      })
    } else {
      fallback()
    }
  })
}
