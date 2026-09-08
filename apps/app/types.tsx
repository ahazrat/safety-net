/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  SignUp: undefined;
  SignIn: undefined;
  Home: undefined;
  Account: undefined;
  Listings: undefined;
  Listing: { listingId: string } | undefined;
  ListingCreate: undefined;
  Services: undefined;
  Map: undefined;
  ForgotPassword: undefined;
  ChangePassword: undefined;
  Admin: undefined;
  NotFound: undefined;
};
