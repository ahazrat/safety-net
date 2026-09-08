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
  deleteDoc,
  collection,
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

test('signed-out visitors can read listings (public map)', async () => {
  await seed(db => setDoc(doc(db, 'listings', 'l1'), { title: 'Patrol', ownerUid: 'alice' }))
  await assertSucceeds(getDoc(doc(unauth(), 'listings', 'l1')))
  await assertSucceeds(getDocs(collection(unauth(), 'listings')))
})

test('signed-out visitors cannot create listings', async () => {
  await assertFails(
    addDoc(collection(unauth(), 'listings'), { title: 'Nope', ownerUid: 'alice' })
  )
})

test('signed-in user can create a listing they own', async () => {
  await assertSucceeds(
    addDoc(collection(asUser('alice'), 'listings'), { title: 'Night watch', ownerUid: 'alice' })
  )
})

test('signed-in user cannot create a listing owned by someone else', async () => {
  await assertFails(
    addDoc(collection(asUser('alice'), 'listings'), { title: 'Stolen', ownerUid: 'bob' })
  )
})

test('owner can delete their listing; another user cannot', async () => {
  await seed(db => setDoc(doc(db, 'listings', 'l1'), { title: 'Mine', ownerUid: 'alice' }))
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
    await setDoc(doc(db, 'listings', 'l1'), { title: 'Old', ownerUid: 'alice' })
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

test('unknown collections are denied', async () => {
  await assertFails(getDoc(doc(asUser('alice'), 'secrets', 'x')))
  await assertFails(setDoc(doc(asUser('alice'), 'secrets', 'x'), { n: 1 }))
})
