const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const { createNativeAuth, isAlreadyInitialized } = require(
  '../packages/shared/firebase/createNativeAuth'
)

const nativeAuth = fs.readFileSync(
  path.join(__dirname, '../packages/shared/firebase/auth.native.js'),
  'utf8',
)
const webAuth = fs.readFileSync(
  path.join(__dirname, '../packages/shared/firebase/auth.js'),
  'utf8',
)
const sharedPkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../packages/shared/package.json'), 'utf8'),
)
const metro = fs.readFileSync(
  path.join(__dirname, '../apps/app/metro.config.js'),
  'utf8',
)

test('native Auth uses AsyncStorage persistence', () => {
  assert.match(nativeAuth, /getReactNativePersistence/)
  assert.match(nativeAuth, /@react-native-async-storage\/async-storage/)
  assert.match(nativeAuth, /createNativeAuth/)
})

test('web Auth keeps default getAuth', () => {
  assert.match(webAuth, /getAuth/)
  assert.doesNotMatch(webAuth, /getReactNativePersistence/)
  assert.doesNotMatch(webAuth, /createNativeAuth/)
})

test('shared package declares AsyncStorage as a peer', () => {
  assert.ok(sharedPkg.peerDependencies['@react-native-async-storage/async-storage'])
})

test('Metro looks up workspace node_modules for shared native auth', () => {
  assert.match(metro, /watchFolders/)
  assert.match(metro, /nodeModulesPaths/)
})

test('createNativeAuth initializes with RN persistence', () => {
  const persistence = { type: 'LOCAL' }
  const instance = { kind: 'persisted' }
  const got = createNativeAuth({
    initializeAuth: (app, opts) => {
      assert.equal(app, 'app')
      assert.equal(opts.persistence, persistence)
      return instance
    },
    getAuth: () => {
      throw new Error('getAuth should not run on success')
    },
    getReactNativePersistence: storage => {
      assert.equal(storage, 'async-storage')
      return persistence
    },
    app: 'app',
    storage: 'async-storage',
  })
  assert.equal(got, instance)
})

test('createNativeAuth reuses getAuth only when already initialized', () => {
  const existing = { kind: 'existing' }
  const got = createNativeAuth({
    initializeAuth: () => {
      const err = new Error('FirebaseError')
      err.code = 'auth/already-initialized'
      throw err
    },
    getAuth: app => {
      assert.equal(app, 'app')
      return existing
    },
    getReactNativePersistence: () => ({ type: 'LOCAL' }),
    app: 'app',
    storage: 'async-storage',
  })
  assert.equal(got, existing)
})

test('createNativeAuth does not fall back to in-memory getAuth on other errors', () => {
  assert.throws(
    () =>
      createNativeAuth({
        initializeAuth: () => {
          throw new Error('storage unavailable')
        },
        getAuth: () => ({ kind: 'memory' }),
        getReactNativePersistence: () => ({ type: 'LOCAL' }),
        app: 'app',
        storage: 'async-storage',
      }),
    /storage unavailable/,
  )
})

test('createNativeAuth fails closed if RN persistence helper is missing', () => {
  assert.throws(
    () =>
      createNativeAuth({
        initializeAuth: () => ({}),
        getAuth: () => ({ kind: 'memory' }),
        getReactNativePersistence: undefined,
        app: 'app',
        storage: 'async-storage',
      }),
    /getReactNativePersistence is not a function/,
  )
})

test('isAlreadyInitialized matches firebase codes and messages', () => {
  assert.equal(isAlreadyInitialized({ code: 'auth/already-initialized' }), true)
  assert.equal(isAlreadyInitialized({ message: 'Auth has already been initialized' }), true)
  assert.equal(isAlreadyInitialized({ code: 'auth/internal-error' }), false)
})
