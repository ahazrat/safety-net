import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { app } from './app'

// Default getAuth() on React Native does not restore the session after the
// process is killed. Persist the Firebase Auth user in AsyncStorage so
// Android/iOS stay signed in across backgrounding and cold starts.
function createAuth() {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    })
  } catch (err) {
    // Fast Refresh / a second import already initialized Auth.
    return getAuth(app)
  }
}

export const auth = createAuth()
