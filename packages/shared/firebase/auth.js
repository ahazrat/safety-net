import { getAuth } from 'firebase/auth'
import { app } from './app'

// Web (and Node tests): IndexedDB / in-memory persistence from getAuth.
export const auth = getAuth(app)
