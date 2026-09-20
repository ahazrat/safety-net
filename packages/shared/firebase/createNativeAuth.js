// Shared by auth.native.js. Keep this file free of react-native / firebase
// imports so Node tests can exercise the fallback policy.

function isAlreadyInitialized(err) {
  const code = err && err.code
  const message = String((err && err.message) || '')
  return (
    code === 'auth/already-initialized' ||
    /already (been )?initialized/i.test(message)
  )
}

function createNativeAuth(deps) {
  const { initializeAuth, getAuth, getReactNativePersistence, app, storage } = deps || {}
  if (typeof initializeAuth !== 'function' || typeof getAuth !== 'function') {
    throw new Error('createNativeAuth: missing Auth factory')
  }
  if (typeof getReactNativePersistence !== 'function') {
    throw new Error(
      'createNativeAuth: getReactNativePersistence is not a function (firebase/auth RN entry missing)'
    )
  }
  if (!storage) {
    throw new Error('createNativeAuth: AsyncStorage is required')
  }
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(storage),
    })
  } catch (err) {
    // Only reuse an existing Auth instance. Any other failure (missing
    // persistence, bad storage) must not fall through to getAuth(), which
    // is in-memory on React Native and signs the user out on process death.
    if (isAlreadyInitialized(err)) {
      return getAuth(app)
    }
    throw err
  }
}

module.exports = { createNativeAuth, isAlreadyInitialized }
