import { useContext } from 'react'
import { doSignOut } from '@safety-net/shared'
import { AuthUserContext } from '../../auth/session'

export default function Profile(props) {
  const authUser = useContext(AuthUserContext)

  if (!authUser) {
    return (
      <div>
        <h1>Profile</h1>
        <p>Not signed in.</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Email: {authUser.email}</p>
      <p>Username: {authUser.username}</p>
      <button onClick={() => doSignOut()}>Sign Out</button>
    </div>
  )
}
