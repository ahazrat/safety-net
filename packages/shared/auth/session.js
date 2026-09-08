// Ported from safety-net-expo's components/Session (context.jsx,
// withAuthentication.jsx, withAuthorization.jsx). withAuthentication was
// previously stubbed out (its body was commented out, never wired up); this
// implements it for real. Navigation is left to the caller via
// `onUnauthorized`, since different navigators navigate differently.
import React from 'react'
import { onAuthUserListener } from './firebaseAuth'

export const AuthUserContext = React.createContext(null)

export function withAuthentication(Component) {
  return function WithAuthentication(props) {
    const [authUser, setAuthUser] = React.useState(null)

    React.useEffect(() => {
      const unsubscribe = onAuthUserListener(
        data => setAuthUser(data.authUser),
        () => setAuthUser(null)
      )
      return unsubscribe
    }, [])

    return React.createElement(
      AuthUserContext.Provider,
      { value: authUser },
      React.createElement(Component, props)
    )
  }
}

export function withAuthorization(condition, onUnauthorized) {
  return function (Component) {
    return function WithAuthorization(props) {
      const authUser = React.useContext(AuthUserContext)

      React.useEffect(() => {
        if (!condition(authUser) && onUnauthorized) {
          onUnauthorized(props)
        }
      }, [authUser])

      return condition(authUser) ? React.createElement(Component, props) : null
    }
  }
}
