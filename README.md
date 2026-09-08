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
  trello/             Snapshot of the SafetyNet Trello board (ideas, not code)
```

## Development

```
cd apps/app
npm start        # or: npx expo start
npx expo start --web
```

Web routes are declared in `apps/app/navigation/LinkingConfiguration.ts`
(`/`, `/map`, `/listing/:listingId`, `/signin`, …). Every screen stays
mounted so those URLs keep working after sign-in or sign-out; the drawer
only hides items that do not apply. `npx expo start --web` then open
`http://localhost:8081/map` (port may vary).

The app shares one Firebase project (`safety-net-2022`, config in
`packages/shared/firebase/config.js`) for auth and Firestore.

Firestore Security Rules live in `firestore.rules` (project
`firebase.json` / `.firebaserc`). After editing rules:

```
npm run test:rules     # emulator + tests/firestore.rules.test.js
npm run deploy:rules   # deploy to safety-net-2022 via gcloud user ADC
```

`deploy:rules` uses `scripts/firebase-gcloud-user.sh`, which authenticates
firebase-tools with
`~/.config/gcloud/legacy_credentials/asifhazrat@gmail.com/adc.json` (override
with `FIREBASE_GCLOUD_ACCOUNT`). The Firebase CLI's own stored login was a
2021 `fractalstrategies@gmail.com` session that 401s; default ADC is a
fire-ice quota project that cannot refresh. Emulator tests do not need this.

Admin role is not self-serve. Sign-up always creates a `USER`. An existing
admin can grant or revoke `ADMIN` on other accounts from the Admin screen.
The first admin has to be bootstrapped in the Firebase console
(`users/{uid}.roles.ADMIN = "ADMIN"`).

Listings are public or private (`visibility`). Public listings are readable
by anyone (Home/Map pins). Private listings are owner/admin only. Creates
require a non-empty title, a `location.lat`/`lng`, and `ownerUid` matching
the signed-in user; `ownerUid` cannot be changed later. List queries must
filter (`visibility == 'public'`, `ownerUid == auth.uid`, or
`assigneeUid == auth.uid`) — use `listPublicListings` /
`listVisibleListings` / `listMyJobs` rather than scanning the collection.

A listing is also a job: `status` is `open`, `accepted`, `in_progress`, or
`done` (legacy docs without it are open). Creates start open with no
assignee. Anyone signed in except the owner can accept an open job
(sets `assigneeUid` to themselves). The assignee can move it to
`in_progress` / `done`; the owner can mark it done. Jobs screen lists
listings you own or are assigned to.

Verification badges (`packages/shared/constants/Badges.js`) live on
`users/{uid}.badges`. Sign-up creates an empty map; only an admin can grant
or revoke a known badge on someone else (Account shows yours; Admin toggles
them).

Direct messages live in `conversations/{minUid_maxUid}/messages`. Only the
two `participants` can read or write; list queries must use
`participants array-contains auth.uid`. Open a thread from Messages or
from a listing's "Message owner" button.

## Known gaps (not solved by this consolidation, left as follow-ups)

- **iOS Simulator not available in this dev environment**: `Xcode.app`
  itself isn't installed (only the command-line tools are), so
  `Map.native.tsx`'s WebView-embedded Leaflet map has never actually been
  verified on-device — only on web. Install Xcode from the Mac App Store,
  then `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`,
  then re-run the native check.

## Product plan

Value proposition, GTM, and ordered priorities live in
[`docs/ROADMAP.md`](docs/ROADMAP.md). Trello dump:
[`docs/trello/`](docs/trello/README.md).

Next (same order as the roadmap):

1. Android auth persistence + Map check
1. Chicago crime overlay on Map/Home
1. Public username + badges on jobs
1. Scanner catalogue (Chicago, links first)
1. Domain → web app
1. Hand-seeded Chicago station pins
1. One neighborhood roster (ops)
1. EAS iOS / stores once Xcode exists
1. Teams + listing types
1. Payments only after real completed jobs

Parked (still in Trello, not next): Django/second backend, title plant/MLS,
insurance, blockchain-as-homepage, national station import.

### Building the mobile app
- Android emulator: install Android Studio, Tools > AVD Manager, create/launch a device
- Local build: `expo run:android --variant release`
- Cloud build: `expo build:android -t apk`

### Creating a new screen
1. Create the screen component under `apps/app/components/`
1. Add it to `RootStackParamList` in `apps/app/types.tsx`
1. Add a path in `apps/app/navigation/LinkingConfiguration.ts`
1. Register it always in the drawer in `apps/app/navigation/index.tsx`
   (hide with `drawerItemStyle` if it should not appear in the menu)
