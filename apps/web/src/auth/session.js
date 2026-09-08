// Ported from safety-net-expo's components/Session (context.jsx,
// withAuthentication.jsx, withAuthorization.jsx). withAuthentication was
// previously stubbed out (its body was commented out, never wired up); this
// implements it for real. Navigation is left to the caller via
// `onUnauthorized`, since web (react-router) and mobile (react-navigation)
// navigate differently.
//
// This file is intentionally duplicated in apps/web and apps/mobile rather
// than living in packages/shared: web and mobile pin incompatible React
// majors (18 vs 16.13, see README "Known gaps"), and npm workspaces hoists
// one React copy to the repo root — so a shared module using hooks/context
// would resolve a different React instance than whichever app didn't get
// the hoisted copy, breaking hooks ("Invalid hook call"). Everything
// React-free (firebaseAuth.js, constants, types) is still shared normally.
import React from 'react'
import { onAuthUserListener } from '@safety-net/shared'

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
