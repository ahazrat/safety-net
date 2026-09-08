# safety-net

A decentralized marketplace for security.

<details>
<summary>Mission</summary>

A social system free of monopoly and taxation. Also described as: Natural
Order, Ordered Anarchy, Private Property Anarchism, Free Market Anarchism,
Anarcho-Capitalism, Auto-Government, Private Law Society, Pure Capitalism.
</details>

This is a monorepo. It consolidates what used to be four separate repos
(`safety-net`, `safety-net-expo`, `safety-net-db`, `polis`) into one, keeping
every feature that was actually working and dropping the rest (dead code,
tutorial scaffolding, an unused second backend, duplicate starter-template
boilerplate).

## Layout

```
apps/
  app/      Expo/React Native app (react-native-web) — single codebase for web + iOS + Android
packages/
  shared/   Firebase config, auth logic, domain constants and types used by the app
docs/
  design-reference/   Early mockups and mood-board imagery (no code)
```

## Development

```
cd apps/app
npm start        # or: npx expo start
npx expo start --web
```

The app shares one Firebase project (config in
`packages/shared/firebase/config.js`) for auth and Firestore.

## Known gaps (not solved by this consolidation, left as follow-ups)

- **SignUp's admin-toggle is a security smell**: the `Switch` on the sign-up
  form lets any new user grant themselves the admin role client-side (see
  the comment in `apps/app/components/SignUp/index.jsx`). Flagged, not
  fixed — needs a real server-side role-assignment flow.
- **Firebase Email/Password auth isn't enabled** on the project used for
  local dev, so SignUp currently fails with `auth/configuration-not-found`
  until that's turned on in the Firebase console.

## Roadmap / Todo

Carried over from the pre-monorepo README:

1. Read from a blockchain
1. User-specific data access
1. Project-task UI
1. Get web URL to show properly through all navigation
1. Shop for domain names around 'safety net'
1. Badge system (badge list already ported: `packages/shared/constants/Badges.ts`)
1. User-user messaging
1. Stronger password requirements on sign up
1. Email string validation
1. Live police/fire scanner + published crime & incident statistics feed, layered onto the
   Map/Home views to enrich a user's live risk profile (needs a data-source decision — e.g.
   Broadcastify/OpenMHz for scanner audio, a crime-stats API like data.police.uk-style municipal
   feeds — plus a design pass before implementation)
1. Police & fire station directory, mapped by state/county/town — seeded gradually over time
   (not a single bulk import), overlaid as pins on the Map component alongside listings

### Building the mobile app
- Android emulator: install Android Studio, Tools > AVD Manager, create/launch a device
- Local build: `expo run:android --variant release`
- Cloud build: `expo build:android -t apk`

### Creating a new screen
1. Create the screen component under `apps/app/components/`
1. Add it to `RootStackParamList` in `apps/app/types.tsx`
1. Register it in `apps/app/navigation/LinkingConfiguration.ts`
1. Add it to the drawer in `apps/app/navigation/index.tsx`
