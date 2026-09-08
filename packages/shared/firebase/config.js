// Single Firebase project for the whole monorepo (web + mobile).
// Previously web and mobile pointed at two different Firebase projects
// (safety-net-2022 vs safety-net-2021); this consolidates on the one
// actually in use by the live web app.
export const firebaseConfig = {
  apiKey: 'AIzaSyDoTCzMO1Gg0mjuAk8_ie1Yy7uXus2hpic',
  authDomain: 'safety-net-2022.firebaseapp.com',
  projectId: 'safety-net-2022',
  storageBucket: 'safety-net-2022.appspot.com',
  messagingSenderId: '192593256362',
  appId: '1:192593256362:web:d65c7d7c0f789ff1dbd5d3',
  measurementId: 'G-TKKV85SWQX',
}
