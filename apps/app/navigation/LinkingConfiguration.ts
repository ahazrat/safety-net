/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      SignUp: 'signup',
      SignIn: 'signin',
      Home: 'home',
      Account: 'account',
      Listings: 'listings',
      Listing: 'listing',
      ListingCreate: 'createlisting',
      Services: 'services',
      Map: 'map',
      Attribution: 'attribution',
      ForgotPassword: 'forgotpassword',
      ChangePassword: 'changepassword',
      Admin: 'admin',
      Messages: 'messages',
      Conversation: 'conversation',
      NotFound: '*',
    },
  },
};
