# UX audit — web, 2026-09-23

Web-first walk of https://safetynet-us.web.app after the light navy theme, landing, tour, and feedback shipped. Native is a short note at the end. Lens: easy browse, clear post and hire, honest off-platform price, badges as trust not a gate. Do not imply a 911 replacement.

## Blockers

None in the UI itself. The empty marketplace is an ops gap, not a broken screen: `/listings` has no open jobs until a real roster exists ([`ROSTER-OPS-CHICAGO.md`](ROSTER-OPS-CHICAGO.md)). `safety-net.us` is not Asif’s domain ([`ops-chicago.md`](ops-chicago.md)).

## High

1. **Signed-in Home was a developer stub.** It said the page was “accessible by every single signed in user” and hid Post a watch. Signed-in users are the people who hire. Same headline and primary button as the public landing.
2. **Sign-in was drawer-only on the landing.** A first visitor on a wide web window can miss the menu. Sign in sits next to Post a watch.
3. **Empty listings did not offer the next action.** The sentence “be the first to post one” had no button. Post a watch is on that empty state. Create still requires sign-in, which is correct.

## Medium

1. **Create, messages, and feedback are gates without a preview.** Signed-out `/createlisting` and `/feedback` only say sign in. The tour explains type and price, but the live form is hidden. A later slice can show the type chips and the $5 example as read-only until sign-in, without accepting a post.
2. **Map chrome is a wrap of switches.** Crime, police, fire, and Scanners compete with the map on a phone-width browser. Group the layers under one “Layers” control later. Do not remove the counts caption: circles are community-area totals, not incidents.
3. **Services is a second catalog.** Home already offers Watch, Event, and Defense. Services repeats them as cards plus later offerings (ID, rides, notary) with empty blurbs. Keep Services, but do not add more cards until one corridor has five real listings.
4. **Price language is split.** Create says “Listed price USD (optional; 0 = volunteer).” The tour says off-platform, no Stripe. Put one line under the price field everywhere: “Listed USD. You agree the amount off-platform. No card charge.”
5. **Badges on an empty directory teach nothing.** Chips appear only after an admin grant and a listing exists. On Account, one sentence already fits: badges are admin-attested trust marks, not a license and not required to post.

## Polish

1. Tour spotlight and Replay tour are easy to miss under the landing fold. Leave them. `?demo=block-watch` is the share link.
2. Feedback success is inline text, not a toast. Fine for v1.
3. Admin “Feedback reports” is easy to find once you are an admin. The first admin is still a console step.
4. Inter loads from Google Fonts on web. Native stays on the system font. Acceptable.

## Patterns that fit

- **One primary action per screen.** Post a watch on Home and on empty Listings. Other offerings stay outlined buttons.
- **Public map, private contract.** Browse and the crime layer stay signed-out. Post, accept, message, and feedback stay signed-in.
- **Example pins, not fake accounts.** The block-walk tour is the right way to show density before a roster exists.
- **Progressive disclosure for layers.** A single map control beats four always-on switches.

## Native

Android auth persistence and a Map retest are still the device blockers in the roadmap. This pass did not exercise a phone. Do not treat the web drawer and the native drawer as the same until that retest.

## Tiny fixes in this slice

- Signed-out Home: Sign in beside Post a watch.
- Signed-in Home: “Hire a neighbor” and Post a watch. Removed the developer sentence.
- Empty listings: Post a watch button.
