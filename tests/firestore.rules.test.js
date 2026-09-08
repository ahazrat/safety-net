const { readFileSync } = require('fs')
const { resolve } = require('path')
const { test, before, after, beforeEach } = require('node:test')
const {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} = require('@firebase/rules-unit-testing')
const {
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField,
  collection,
  query,
  where,
} = require('firebase/firestore')

const RULES = readFileSync(resolve(__dirname, '../firestore.rules'), 'utf8')

let testEnv

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'safety-net-test',
    firestore: { rules: RULES, host: '127.0.0.1', port: 8080 },
  })
})

after(async () => {
  if (testEnv) await testEnv.cleanup()
})

beforeEach(async () => {
  await testEnv.clearFirestore()
})

function unauth() {
  return testEnv.unauthenticatedContext().firestore()
}

function asUser(uid, email = `${uid}@example.com`) {
  return testEnv.authenticatedContext(uid, { email }).firestore()
}

async function seed(writer) {
  await testEnv.withSecurityRulesDisabled(async context => {
    await writer(context.firestore())
  })
}

function validListing(overrides = {}) {
  return {
    title: 'Night watch',
    ownerUid: 'alice',
    visibility: 'public',
    location: { lat: 41.8, lng: -87.6 },
    ...overrides,
  }
}

test('signed-out visitors can read public listings (public map)', async () => {
  await seed(db => setDoc(doc(db, 'listings', 'l1'), validListing()))
  await assertSucceeds(getDoc(doc(unauth(), 'listings', 'l1')))
  await assertSucceeds(
    getDocs(query(collection(unauth(), 'listings'), where('visibility', '==', 'public')))
  )
})

test('public listing query succeeds for signed-out visitors', async () => {
  await seed(db =>
    setDoc(doc(db, 'listings', 'pub'), validListing({ title: 'Pub' }))
  )
  await assertSucceeds(
    getDocs(query(collection(unauth(), 'listings'), where('visibility', '==', 'public')))
  )
})

test('signed-out visitors cannot create listings', async () => {
  await assertFails(
    addDoc(collection(unauth(), 'listings'), validListing())
  )
})

test('signed-in user can create a listing they own', async () => {
  await assertSucceeds(
    addDoc(collection(asUser('alice'), 'listings'), validListing())
  )
})

test('signed-in user cannot create a listing owned by someone else', async () => {
  await assertFails(
    addDoc(collection(asUser('alice'), 'listings'), validListing({ ownerUid: 'bob' }))
  )
})

test('create requires a non-empty title and lat/lng', async () => {
  const alice = asUser('alice')
  await assertFails(
    addDoc(collection(alice, 'listings'), validListing({ title: '' }))
  )
  await assertFails(
    addDoc(collection(alice, 'listings'), validListing({ location: { lat: 'x', lng: 1 } }))
  )
  await assertFails(
    addDoc(collection(alice, 'listings'), { title: 'No loc', ownerUid: 'alice', visibility: 'public' })
  )
})

test('create rejects unknown visibility', async () => {
  await assertFails(
    addDoc(
      collection(asUser('alice'), 'listings'),
      validListing({ visibility: 'friends' })
    )
  )
})

test('private listings are hidden from others; owner and admin can read', async () => {
  await seed(async db => {
    await setDoc(doc(db, 'users', 'admin'), {
      uid: 'admin',
      username: 'boss',
      email: 'admin@example.com',
      roles: { ADMIN: 'ADMIN' },
    })
    await setDoc(
      doc(db, 'listings', 'priv'),
      validListing({ title: 'Secret', visibility: 'private' })
    )
  })
  await assertFails(getDoc(doc(unauth(), 'listings', 'priv')))
  await assertFails(getDoc(doc(asUser('bob'), 'listings', 'priv')))
  await assertSucceeds(getDoc(doc(asUser('alice'), 'listings', 'priv')))
  await assertSucceeds(getDoc(doc(asUser('admin'), 'listings', 'priv')))
})

test('owner can list their own listings including private', async () => {
  await seed(db =>
    setDoc(
      doc(db, 'listings', 'priv'),
      validListing({ visibility: 'private' })
    )
  )
  await assertSucceeds(
    getDocs(query(collection(asUser('alice'), 'listings'), where('ownerUid', '==', 'alice')))
  )
})

test('owner cannot change ownerUid on update', async () => {
  await seed(db => setDoc(doc(db, 'listings', 'l1'), validListing()))
  await assertFails(
    updateDoc(doc(asUser('alice'), 'listings', 'l1'), { ownerUid: 'bob' })
  )
  await assertSucceeds(
    updateDoc(doc(asUser('alice'), 'listings', 'l1'), { title: 'Renamed' })
  )
})

test('owner can delete their listing; another user cannot', async () => {
  await seed(db => setDoc(doc(db, 'listings', 'l1'), validListing({ title: 'Mine' })))
  await assertFails(deleteDoc(doc(asUser('bob'), 'listings', 'l1')))
  await assertSucceeds(deleteDoc(doc(asUser('alice'), 'listings', 'l1')))
})

test('admin can delete someone else\'s listing', async () => {
  await seed(async db => {
    await setDoc(doc(db, 'users', 'admin'), {
      uid: 'admin',
      username: 'boss',
      email: 'admin@example.com',
      roles: { ADMIN: 'ADMIN' },
    })
    await setDoc(doc(db, 'listings', 'l1'), validListing({ title: 'Old' }))
  })
  await assertSucceeds(deleteDoc(doc(asUser('admin'), 'listings', 'l1')))
})

test('user can create and read their own profile', async () => {
  const alice = asUser('alice')
  await assertSucceeds(
    setDoc(doc(alice, 'users', 'alice'), {
      uid: 'alice',
      username: 'alice',
      email: 'alice@example.com',
      roles: { USER: 'USER' },
    })
  )
  await assertSucceeds(getDoc(doc(alice, 'users', 'alice')))
})

test('user cannot create a profile for another uid', async () => {
  await assertFails(
    setDoc(doc(asUser('alice'), 'users', 'bob'), {
      uid: 'bob',
      username: 'bob',
      email: 'bob@example.com',
      roles: { USER: 'USER' },
    })
  )
})

test('user cannot read another user\'s profile', async () => {
  await seed(db =>
    setDoc(doc(db, 'users', 'alice'), {
      uid: 'alice',
      username: 'alice',
      email: 'alice@example.com',
      roles: { USER: 'USER' },
    })
  )
  await assertFails(getDoc(doc(asUser('bob'), 'users', 'alice')))
})

test('non-admin cannot list users; admin can', async () => {
  await seed(async db => {
    await setDoc(doc(db, 'users', 'alice'), {
      uid: 'alice',
      username: 'alice',
      email: 'alice@example.com',
      roles: { USER: 'USER' },
    })
    await setDoc(doc(db, 'users', 'admin'), {
      uid: 'admin',
      username: 'boss',
      email: 'admin@example.com',
      roles: { ADMIN: 'ADMIN' },
    })
  })
  await assertFails(getDocs(collection(asUser('alice'), 'users')))
  await assertSucceeds(getDocs(collection(asUser('admin'), 'users')))
})

test('user cannot create their own profile with ADMIN', async () => {
  await assertFails(
    setDoc(doc(asUser('alice'), 'users', 'alice'), {
      uid: 'alice',
      username: 'alice',
      email: 'alice@example.com',
      roles: { USER: 'USER', ADMIN: 'ADMIN' },
    })
  )
})

test('user cannot grant themselves ADMIN after create', async () => {
  await seed(db =>
    setDoc(doc(db, 'users', 'alice'), {
      uid: 'alice',
      username: 'alice',
      email: 'alice@example.com',
      roles: { USER: 'USER' },
    })
  )
  await assertFails(
    updateDoc(doc(asUser('alice'), 'users', 'alice'), { 'roles.ADMIN': 'ADMIN' })
  )
})

test('admin can grant and revoke ADMIN on another user', async () => {
  await seed(async db => {
    await setDoc(doc(db, 'users', 'admin'), {
      uid: 'admin',
      username: 'boss',
      email: 'admin@example.com',
      roles: { ADMIN: 'ADMIN' },
    })
    await setDoc(doc(db, 'users', 'alice'), {
      uid: 'alice',
      username: 'alice',
      email: 'alice@example.com',
      roles: { USER: 'USER' },
    })
  })
  const adminDb = asUser('admin')
  await assertSucceeds(
    updateDoc(doc(adminDb, 'users', 'alice'), { 'roles.ADMIN': 'ADMIN' })
  )
  await assertSucceeds(
    updateDoc(doc(adminDb, 'users', 'alice'), { 'roles.ADMIN': deleteField() })
  )
})

test('admin cannot strip their own ADMIN role', async () => {
  await seed(db =>
    setDoc(doc(db, 'users', 'admin'), {
      uid: 'admin',
      username: 'boss',
      email: 'admin@example.com',
      roles: { ADMIN: 'ADMIN' },
    })
  )
  await assertFails(
    updateDoc(doc(asUser('admin'), 'users', 'admin'), { 'roles.ADMIN': deleteField() })
  )
})

test('user cannot grant themselves a badge', async () => {
  await seed(db =>
    setDoc(doc(db, 'users', 'alice'), {
      uid: 'alice',
      username: 'alice',
      email: 'alice@example.com',
      roles: { USER: 'USER' },
    })
  )
  await assertFails(
    updateDoc(doc(asUser('alice'), 'users', 'alice'), { 'badges.cpr': 'cpr' })
  )
})

test('user cannot create a profile with badges', async () => {
  await assertFails(
    setDoc(doc(asUser('alice'), 'users', 'alice'), {
      uid: 'alice',
      username: 'alice',
      email: 'alice@example.com',
      roles: { USER: 'USER' },
      badges: { cpr: 'cpr' },
    })
  )
})

test('admin can grant and revoke a badge on another user', async () => {
  await seed(async db => {
    await setDoc(doc(db, 'users', 'admin'), {
      uid: 'admin',
      username: 'boss',
      email: 'admin@example.com',
      roles: { ADMIN: 'ADMIN' },
    })
    await setDoc(doc(db, 'users', 'alice'), {
      uid: 'alice',
      username: 'alice',
      email: 'alice@example.com',
      roles: { USER: 'USER' },
    })
  })
  const adminDb = asUser('admin')
  await assertSucceeds(
    updateDoc(doc(adminDb, 'users', 'alice'), { 'badges.cpr': 'cpr' })
  )
  await assertSucceeds(
    updateDoc(doc(adminDb, 'users', 'alice'), { 'badges.cpr': deleteField() })
  )
})

test('admin cannot grant an unknown badge', async () => {
  await seed(async db => {
    await setDoc(doc(db, 'users', 'admin'), {
      uid: 'admin',
      username: 'boss',
      email: 'admin@example.com',
      roles: { ADMIN: 'ADMIN' },
    })
    await setDoc(doc(db, 'users', 'alice'), {
      uid: 'alice',
      username: 'alice',
      email: 'alice@example.com',
      roles: { USER: 'USER' },
    })
  })
  await assertFails(
    updateDoc(doc(asUser('admin'), 'users', 'alice'), { 'badges.wizard': 'wizard' })
  )
})

test('participants can create and read a conversation; outsiders cannot', async () => {
  const convo = {
    participants: ['alice', 'bob'],
  }
  await assertSucceeds(setDoc(doc(asUser('alice'), 'conversations', 'alice_bob'), convo))
  await assertSucceeds(getDoc(doc(asUser('alice'), 'conversations', 'alice_bob')))
  await assertSucceeds(getDoc(doc(asUser('bob'), 'conversations', 'alice_bob')))
  await assertFails(getDoc(doc(asUser('carol'), 'conversations', 'alice_bob')))
  await assertFails(getDoc(doc(unauth(), 'conversations', 'alice_bob')))
})

test('cannot create a conversation without being a participant', async () => {
  await assertFails(
    setDoc(doc(asUser('alice'), 'conversations', 'bob_carol'), {
      participants: ['bob', 'carol'],
    })
  )
})

test('participant can send a message; outsider cannot read or write', async () => {
  await seed(async db => {
    await setDoc(doc(db, 'conversations', 'alice_bob'), { participants: ['alice', 'bob'] })
    await setDoc(doc(db, 'conversations', 'alice_bob', 'messages', 'm1'), {
      fromUid: 'alice',
      text: 'Hello',
      participants: ['alice', 'bob'],
    })
  })
  await assertSucceeds(
    addDoc(collection(asUser('alice'), 'conversations', 'alice_bob', 'messages'), {
      fromUid: 'alice',
      text: 'Follow up',
      participants: ['alice', 'bob'],
    })
  )
  await assertFails(
    addDoc(collection(asUser('carol'), 'conversations', 'alice_bob', 'messages'), {
      fromUid: 'carol',
      text: 'Nope',
      participants: ['alice', 'bob'],
    })
  )
  await assertFails(
    addDoc(collection(asUser('alice'), 'conversations', 'alice_bob', 'messages'), {
      fromUid: 'alice',
      text: '',
      participants: ['alice', 'bob'],
    })
  )
  await assertSucceeds(getDoc(doc(asUser('alice'), 'conversations', 'alice_bob', 'messages', 'm1')))
  await assertFails(getDoc(doc(asUser('carol'), 'conversations', 'alice_bob', 'messages', 'm1')))
  await assertSucceeds(
    getDocs(
      query(
        collection(asUser('alice'), 'conversations', 'alice_bob', 'messages'),
        where('participants', 'array-contains', 'alice')
      )
    )
  )
})

test('unknown collections are denied', async () => {
  await assertFails(getDoc(doc(asUser('alice'), 'secrets', 'x')))
  await assertFails(setDoc(doc(asUser('alice'), 'secrets', 'x'), { n: 1 }))
})
