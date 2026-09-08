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

The app shares one Firebase project (`safety-net-2022`, config in
`packages/shared/firebase/config.js`) for auth and Firestore.

Firestore Security Rules live in `firestore.rules` (project
`firebase.json` / `.firebaserc`). After editing rules:

```
npm run test:rules     # emulator + tests/firestore.rules.test.js
npm run deploy:rules   # deploy to safety-net-2022 (needs Firebase CLI login)
```

Admin role is not self-serve. Sign-up always creates a `USER`. An existing
admin can grant or revoke `ADMIN` on other accounts from the Admin screen.
The first admin has to be bootstrapped in the Firebase console
(`users/{uid}.roles.ADMIN = "ADMIN"`).

Listings are public or private (`visibility`). Public listings are readable
by anyone (Home/Map pins). Private listings are owner/admin only. Creates
require a non-empty title, a `location.lat`/`lng`, and `ownerUid` matching
the signed-in user; `ownerUid` cannot be changed later. List queries must
filter (`visibility == 'public'` or `ownerUid == auth.uid`) — use
`listPublicListings` / `listVisibleListings` rather than scanning the
collection.

Verification badges (`packages/shared/constants/Badges.js`) live on
`users/{uid}.badges`. Sign-up creates an empty map; only an admin can grant
or revoke a known badge on someone else (Account shows yours; Admin toggles
them).

## Known gaps (not solved by this consolidation, left as follow-ups)

- **iOS Simulator not available in this dev environment**: `Xcode.app`
  itself isn't installed (only the command-line tools are), so
  `Map.native.tsx`'s WebView-embedded Leaflet map has never actually been
  verified on-device — only on web. Install Xcode from the Mac App Store,
  then `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`,
  then re-run the native check.

## Priorities

Roughly in the order they should be tackled — infrastructure/security
blockers first, then features:

1. User-user messaging
1. Project-task UI
1. Live police/fire scanner + published crime & incident statistics feed, layered onto the
   Map/Home views to enrich a user's live risk profile (needs a data-source decision — e.g.
   Broadcastify/OpenMHz for scanner audio, a crime-stats API like data.police.uk-style municipal
   feeds — plus a design pass before implementation)
1. Police & fire station directory, mapped by state/county/town — seeded gradually over time
   (not a single bulk import), overlaid as pins on the Map component alongside listings
1. Read from a blockchain
1. Get web URL to show properly through all navigation
1. Shop for domain names around 'safety net'
1. **Verify `Map.native.tsx` on a real iOS Simulator** once Xcode is
   installed — the WebView/Leaflet path has only been tested on web so far.

### Building the mobile app
- Android emulator: install Android Studio, Tools > AVD Manager, create/launch a device
- Local build: `expo run:android --variant release`
- Cloud build: `expo build:android -t apk`

### Creating a new screen
1. Create the screen component under `apps/app/components/`
1. Add it to `RootStackParamList` in `apps/app/types.tsx`
1. Register it in `apps/app/navigation/LinkingConfiguration.ts`
1. Add it to the drawer in `apps/app/navigation/index.tsx`
