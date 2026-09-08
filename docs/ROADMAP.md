# SafetyNet — value, roadmap, GTM

This document is the working product plan. It folds together:

- What the **app actually does today** (`apps/app`, Firestore, this README)
- The **Trello board** snapshot in [`docs/trello/`](trello/README.md)
- Early mockups in [`docs/design-reference/`](design-reference/README.md)
- The Services screen copy in the app

Trello is an idea archive, not the backlog. Items below that are **parked** are still in Trello; they are not next work.

---

## Value proposition

**SafetyNet is a marketplace for local civil and security work**, with a public map so people can see what is happening around them and hire someone nearby.

One sentence for users:

> Post a job on a map (watch this block, staff this door, walk with me). A local person with a verified badge accepts it. You message them, they do the work, you mark it done.

One sentence for the mission (from the README / Trello Purpose card):

> A social system of protection without a tax-funded monopoly — people contract with each other for surveillance, presence, and judgment.

**Why it is not “another cop app.”** The map may overlay public crime and scanner data, but the product is **private supply**: listings, badges, jobs, and messages. Public data is context. The contract is the product.

**Jobs to be done** (Trello Use Cases + Services screen):

| Buyer needs | Offering already named in the app |
| --- | --- |
| Watch a property or street for a window of time | Neighborhood watch |
| Human presence at an event / door | Event security |
| Someone trained when it is not a drill | Physical defense |
| Identity, notary, ride, credit, arbiter, assessment | Pay-per-contract extras (not built yet) |

The Minneapolis / “street captain + green-light patrol” note on Trello is the **reference community**: neighbors who already organize, radios, rosters, and a rule of “presence first, don’t become the felony.” SafetyNet should make that roster and that contract **legible on a map**, not replace the people.

**Pricing idea already in the app:** listings carry requirement scores (authentication, proximity, reputation, stake). A later Price API would publish going rates. There is no payments rail yet — GTM must not promise payouts until that exists.

---

## Who it is for

**Beachhead (next 12 months):** one metro, starting with **Chicago** — Trello already pointed at `bigquery-public-data.chicago_crime`, CPD statistics, and Chicago.gov district pages. Do not seed “every county in the US” until one city has real jobs.

**Two user roles (already in the data model):**

1. **Requester** — owns a listing (`ownerUid`), wants a time window and a pin on the map.
2. **Provider** — accepts the job (`assigneeUid`), holds badges (CPR, de-escalation, weapons, etc.).

**Not the first customer:** title plants, MLS scrapers, probate court, insurance carriers, LCaaS. Those are long-horizon “civil stack” ideas on Trello. They dilute a watch-and-hire marketplace.

---

## What is true in the product today

Canonical app: this monorepo, Expo / React Native / react-native-web, Firebase project **`safety-net-2022`**.

| Capability | Status |
| --- | --- |
| Email/password auth, stronger passwords, email format check | Shipped |
| User docs; ADMIN granted only by an existing admin | Shipped |
| Public map pins from listings with lat/lng | Shipped (web verified; iOS simulator not) |
| Create listing (title, schedule, location, public/private) | Shipped |
| Job lifecycle: open → accepted → in_progress → done + assignee | Shipped |
| Jobs screen (owned or assigned) | Shipped |
| Admin-granted verification badges | Shipped |
| Direct messages (two-party conversations) | Shipped |
| Message owner from a listing | Shipped |
| Firestore rules + `npm run deploy:rules` | Shipped |
| Teams of providers | Copy only |
| Public username + badges on jobs | Shipped (`publicProfiles/{uid}`) |
| Payments / stake / BTC | Not built |
| Live scanner audio on the map | Not built (streaming) |
| Scanner catalogue (Chicago links) | Shipped: Broadcastify official CPD zones + OpenMHz, no autoplay |
| Crime stats overlay | Shipped: 30-day community-area counts from Chicago Data Portal (SODA). Not raw incidents. |
| Station directory | Not built |
| Blockchain reads | Not built |
| Store listings / iOS EAS production | Trello: Android EAS tested; iOS not |
| Django + Cloud SQL second backend | Explicitly dropped in the consolidation |

**Known product bugs from Trello (still relevant or maybe stale):**

- Android session drop when leaving the app
- Firebase Auth console warning
- Map blank / screenshot bugs (Oct 2023 — re-verify on current Map)
- “Find Services” duplicates (old UI; current Services screen is static cards)

---

## What we are not doing next

Parked on purpose so they stop competing with the marketplace:

- **Django API, Redis, Nginx, Cloud SQL `safetynet-postgresql`, GCP project `safety-net-398016`.** The live app is Firebase. A second backend was unused; do not revive it to “feel like infrastructure.”
- **Title plant, SN MLS, chain of title, parcel/deed/will/trust schema.** Civil registry is a different company.
- **Insurance contract engine, Real World Assets inventory, Aggressor entity.**
- **Identity document (DOB, birthplace, gender as required fields).** Badges + uid are enough for v1.
- **Faker-data button.** Create real listings; don’t seed junk onto the public map.
- **Immigration / LCA / I-129** — ops for a person, not the product.
- **“Read from a blockchain”** until there is a specific chain, contract, and user-visible fact to display.

Keep Trello as history; do not copy these into the README priority list.

---

## Product roadmap

### Now — make the loop usable (GTM-blocking)

The loop is: **see map → create or accept a job → message → start → done.**

1. **Persist Android auth** (Trello bug). A provider who backgrounded the app cannot be your launch story if they are signed out.
2. **Re-test Map on Android and, when Xcode exists, iOS Simulator** (`Map.native.tsx`).

Optional but high leverage: show **badge chips on listings / jobs**, not only on Account/Admin, so a requester can see who they hired.

### Next — situational map (the free hook)

This is the README item that was next after jobs, and it matches Trello Data Sources + Radio Scanner.

1. **Crime layer (Chicago first).** Done as 30-day **community-area counts** from the [City of Chicago Data Portal](https://data.cityofchicago.org/Public-Safety/Crimes-2001-to-Present/ijzp-q8t2) (same CPD source as `bigquery-public-data.chicago_crime`). Circles on Map/Home; toggle on Map. In-memory 6h cache. Later: weekly Cloud Function rollup if SODA rate-limits.
2. **Scanner.** Catalogue shipped (`/scanners`): Broadcastify official CPD zones, CFD, Cook County directory, OpenMHz CPD. Links only, no autoplay. Streaming into the map is a later pass.
3. **Stations.** Seed **Chicago** police/fire houses as map pins, by hand, not a national bulk import.

This layer is the **unsigned-in homepage value**: you can open SafetyNet and see risk and presence without posting a job.

### Then — marketplace density

1. **Teams** (Services copy): a listing can require N people; a captain assigns a roster (Minneapolis model).
2. **Offerings as listing types** (watch / event / defense) instead of a free-text title only.
3. **Price signal:** show requirement scores and, later, last-done rates. No in-app payment until a rail is chosen (BTC was on old web listings; do not pretend it works).
4. **Provider profile that others can read** — shipped as `publicProfiles/{uid}` (username + badges). Email and roles stay private on `users/{uid}`. Shown on Listing and Jobs.
5. **Domain** — Trello has `safety-net.us`; also shop names around “safety net.” Point it at the web app. Web paths (`/`, `/map`, `/listing/:id`, …) are wired; they still need a host. Ops (buy + DNS), not app code.

### Later — civil stack (Trello Concepts)

Only after there are real jobs in one city:

- Property / owner-as-of-date (narrow: “this pin is this parcel,” not a title company)
- Arbiter offering
- Notary / ID verification as paid listings
- Checksums / append-only log if there is something worth proving

Blockchain belongs here, as a **proof backend**, not a homepage feature.

### Distribution / engineering hygiene (parallel, not a product theme)

- EAS iOS + Play/App Store artifacts (Jacob Build card)
- GitHub Actions for `test:rules` / `test:validation`
- Code quality (eslint warnings)
- First admin bootstrap remains a console step unless we add an invite flow

---

## Go-to-market

### Position

Lead with **utility**, not ideology, in public channels.

- **Headline:** “Hire a neighbor to watch the block. See jobs and risk on a map.”
- **Subhead:** Private contracts. Public map. No dispatch monopoly.
- **Mission page** (existing slideshow + README mission) stays for people who want Hoppe / Hayek / “man on the spot.” Do not put the full anarcho-capitalist essay in the App Store subtitle.

The Trello slideshow and LinkedIn company page ([safety-net-marketplace](https://www.linkedin.com/company/safety-net-marketplace)) are the public face. Treat the unused `safety-net-market` LinkedIn URL as dead.

### Beachhead motion

1. **Chicago overlay** so the map is not an empty Leaflet (shareable even on Expo web).
2. **One real roster:** find a street-captain style group (the GoldandBlack / Minneapolis pattern, or a Chicago watch). Onboard 5–10 providers with **manually granted badges**. Seed 5 listings.
3. **Walk the loop on a call:** create → appear on map → accept → DM → start → done.
4. **Public web URL** (domain + existing deep links) once the overlay and a roster exist. Neighborhood organizers still will not install TestFlight to “look at a map.”
5. **Only then** talk App Store. Android EAS already had a test; iOS is still blocked on Xcode / store assets.

### Channels (in order)

| Channel | Why |
| --- | --- |
| Web app + domain | Zero-install demo |
| LinkedIn org | The existing company page; post map screenshots, not philosophy walls |
| Direct outreach to neighborhood watches / business corridors in one city | Matches the captain model |
| Crime/scanner map as SEO/share bait | Unsigned traffic |
| App stores | After the web loop works |
| Twitter/X, Facebook (Trello org checklist) | After LinkedIn + one city, not before |

Do not spend on national ads. Density on one map is the product.

### Trust and compliance (say this out loud in GTM)

Providers are **independent contractors**, not SafetyNet employees and not police. Copy should never imply 911 replacement. Badges are **admin-attested**, not state licenses, until you add a real credential check. Weapons-related badges are a store-policy and legal landmine — keep them in the data model but **do not market lethal-weapons matching** in v1 public listing.

### Pricing / capture (honest)

Today there is **no take rate**, because there is no payment. GTM can be: free to post and accept. Later: optional featured pin, or a percent of a recorded contract price once a rail exists. Stake-as-bond is in the listing requirements object; it is not money until you define the asset.

### Narrative assets you already have

- Figma: logo + dashboard wireframe (Trello Design)
- Lucid: user–agent–contract, node architecture, big picture
- Google Slides deck
- Services screen copy (marketplace, map, badges, teams, watch/event/defense)
- `docs/design-reference` mockups (listing pin, live tracking)

GTM near-term: **one landing page** (map + three offerings + “post a watch”) using the Figma logo, not a new brand exercise.

---

## Priorities (do in this order)

Engineering and GTM are the same list for the next stretch.

1. **Android auth persistence** + Map sanity check.
2. **Domain** (`safety-net.us` or better) → web app. Paths are wired; pick a host.
3. **Hand-seeded Chicago station pins.**
4. **LinkedIn + one neighborhood roster** (ops, not code).
5. **EAS iOS** once Xcode is installed; then store listing.
6. **Teams** and listing types.
7. **Payments / stake** only after a roster produced real completed jobs.

iOS Simulator verification stays last among *dev-environment* tasks; it should not block web GTM.

---

## How this maps to Trello lists

| Trello list | Fate |
| --- | --- |
| Purpose, Use Cases, Community example, Philosophy | Absorbed into value prop above |
| Features: Web app, Maps, Android, iOS, Domain, Radio scanner | Active roadmap |
| Data Sources (Chicago crime, scanners, CPD) | Active, Chicago-first |
| Bugs | Active if still reproducible |
| Design (Figma, Lucid) | Use for landing + GTM; no new infra diagrams |
| Jacob CI/CD, Cloud Functions, Build | Parallel hygiene after web URL |
| Django, Redis, Nginx, Title plant, MLS, Insurance, Identity stack | Parked |
| How to Make an App | Process history; skip |
| Org setup (GitHub, LinkedIn) | LinkedIn is GTM; GitHub is this repo |

Raw cards remain in [`docs/trello/`](trello/README.md). Change **this file** when priorities change, not Trello.
