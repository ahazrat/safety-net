/**
 * Web and native deep links. Paths must stay mounted even when the
 * matching drawer item is hidden (see navigation/index.tsx) or the URL
 * 404s after sign-in/out.
 */
import * as Linking from 'expo-linking';

export const linkingScreens = {
  Home: '',
  SignIn: 'signin',
  SignUp: 'signup',
  ForgotPassword: 'forgot-password',
  Services: 'services',
  Map: 'map',
  Scanners: 'scanners',
  Attribution: 'attribution',
  Listings: 'listings',
  Listing: 'listing/:listingId',
  ListingCreate: 'createlisting',
  Jobs: 'jobs',
  Messages: 'messages',
  Conversation: 'conversation/:conversationId',
  Account: 'account',
  ChangePassword: 'changepassword',
  Admin: 'admin',
  NotFound: '*',
};

function prefixes() {
  const list = [Linking.createURL('/')];
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    const origin = window.location.origin;
    if (list.indexOf(origin) === -1) list.push(origin);
  }
  return list;
}

export default {
  prefixes: prefixes(),
  config: {
    screens: linkingScreens,
  },
};
