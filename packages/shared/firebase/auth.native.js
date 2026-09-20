import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { app } from './app'
import { createNativeAuth } from './createNativeAuth'

// Default getAuth() on React Native does not restore the session after the
// process is killed. Persist the Firebase Auth user in AsyncStorage so
// Android/iOS stay signed in across backgrounding and cold starts.
export const auth = createNativeAuth({
  initializeAuth,
  getAuth,
  getReactNativePersistence,
  app,
  storage: AsyncStorage,
})
