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
  Attribution: undefined;
  ForgotPassword: undefined;
  ChangePassword: undefined;
  Admin: undefined;
  Messages: { otherUid?: string } | undefined;
  Conversation: { conversationId: string; otherUid: string } | undefined;
  NotFound: undefined;
};
