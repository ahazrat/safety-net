const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const nativeAuth = fs.readFileSync(
  path.join(__dirname, '../packages/shared/firebase/auth.native.js'),
  'utf8',
)
const webAuth = fs.readFileSync(
  path.join(__dirname, '../packages/shared/firebase/auth.js'),
  'utf8',
)

test('native Auth uses AsyncStorage persistence', () => {
  assert.match(nativeAuth, /getReactNativePersistence/)
  assert.match(nativeAuth, /@react-native-async-storage\/async-storage/)
})

test('web Auth keeps default getAuth', () => {
  assert.match(webAuth, /getAuth/)
  assert.doesNotMatch(webAuth, /getReactNativePersistence/)
})
