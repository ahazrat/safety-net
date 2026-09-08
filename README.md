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
  web/      React (CRA) web app — MUI, Leaflet map, Firestore-backed listings
  mobile/   Expo/React Native app — same auth + listings, native shell
packages/
  shared/   Firebase config, auth logic, domain constants and types used by both apps
docs/
  design-reference/   Early mockups and mood-board imagery (no code)
```

## Development

### Web
```
cd apps/web
npm start
```

### Mobile
```
cd apps/mobile
npm start        # or: npx expo start
```

Both apps share one Firebase project (config in
`packages/shared/firebase/config.js`) for auth and Firestore.

## Known gaps (not solved by this consolidation, left as follow-ups)

- **Framework versions differ**: web is React 18 + CRA 5; mobile is React
  16.13 + RN 0.63 + Expo 42 (2021-era). Upgrading mobile's toolchain is a
  separate project. The root `package.json` pins `react`/`react-dom` to
  `^18.2.0` deliberately, so npm hoists React 18 to the workspace root and
  gives mobile its own nested 16.13 copy instead — without this, CRA's
  tooling (which resolves `react` from the workspace root) detects React
  16.13, which predates the `react/jsx-runtime` automatic JSX transform, and
  silently falls back to the classic transform everywhere in web. Because
  the two apps need different React instances, `packages/shared` only holds
  React-*free* code (Firebase calls, constants, types); the small
  hooks/context auth adapter (`withAuthentication`/`withAuthorization`/
  `AuthUserContext`) is duplicated once per app (`apps/web/src/auth/session.js`,
  `apps/mobile/auth/session.js`) rather than shared, since a hooks-based
  module resolving a different React instance than its consumer breaks
  hooks outright.
- **Listing data shape differs between apps**: web writes a provider-profile
  shape (`jobTitle`/`fullName`/`userImage`, demo data via faker); mobile
  writes a scheduled-service-request shape (`dateRange`/`requirements`) modeled
  on the old Mongoose schema. Both are read defensively (see
  `packages/shared/types/Listing.ts`), but they're not the same shape yet —
  unifying them is a product decision, not a repo-cleanup one.

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

### Building the mobile app
- Android emulator: install Android Studio, Tools > AVD Manager, create/launch a device
- Local build: `expo run:android --variant release`
- Cloud build: `expo build:android -t apk`

### Creating a new mobile screen
1. Create the screen component under `apps/mobile/components/`
1. Add it to `RootStackParamList` in `apps/mobile/types.tsx`
1. Register it in `apps/mobile/navigation/LinkingConfiguration.ts`
1. Add it to the stack in `apps/mobile/navigation/index.tsx`
