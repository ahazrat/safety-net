# Payments — remaining plan

Full spec: [`design-payment-processing.md`](design-payment-processing.md). Stake (`requirements.stake`) is a **score**, not money. BTC is dead. Illinois: **no sales tax on services**. SafetyNet is not the employer.

## Shipped (Phase 0)

| | |
| --- | --- |
| **PR 1** | Optional `listedPriceCents` (blank = no price, `0` = volunteer). Clients cannot write `paymentStatus` / Stripe ids / `executedPriceCents`. Job status is forward-only after accept. |
| **PR 2** | Off-platform dual-ack: each party writes only their proposed cents + ack. Matching acks show “We agreed $X off-platform.” That is **not** paid in Firestore. |

Stay here if volume stays tiny or Blaze is off. GTM stays free to post/accept.

## Do not build yet

**Product gate:** ≥5 `done` jobs, distinct real owner/assignee, lat/lng in Chicago (**box** default; **circle** / **polygon** in `packages/shared/chicago/geo.js`).  
**Ops gate:** Firebase **Blaze** + Functions API on `safety-net-2022` (unverified). Do not deploy HTTP Functions until both pass.

## Remaining PRs (after gates)

| PR | What | Blockers |
| --- | --- | --- |
| **3** | 2nd-gen Functions `us-central1`. Stripe webhook: verify signature on raw body **before** handlers; unsigned → 400. Callable `confirmOffPlatformPrice`: both acks, equal cents, caller is owner or assignee, no live PI → write `executedPriceCents` + `recorded_off_platform`. `config/payments` `{ stripeEnabled: false, platformFeeBps: 0 }` (signed-in get, no client write). | Blaze |
| **4** | Stripe Connect **Express** Account Links on Account. State in `connectAccounts/{uid}` (no client write; never trust client account ids). ToS: independent contractor, not 911. | PR 3 |
| **5** | Web **Checkout Session**, PaymentIntent **manual capture**, `transfer_data.destination`. Native: open Checkout URL in `expo-web-browser` (no Payment Sheet). Accept **never** charges. Pay is a follow-up; skip if cents 0/omitted or Connect missing. Capture **once** per PI when `done` and `authorized`. Auth TTL: scheduler cancel (Chicago EOD after `dateRange.end` or PI age > 7d) — no PI `cancel_at`. Omit `application_fee_amount` while bps is 0. | Dashboard: Express destination charges work. No Pay in an iOS store binary until EAS listing. If Express cannot destination-charge: **stop**, do not swap rails in-PR. |
| **6** | Flip `stripeEnabled` after the Chicago gate + ToS. Store review notes: labor is not IAP. | PR 5 + gate + EAS if iOS |
| **7** | Optional take rate (`platformFeeBps` server-only) or featured pin. Not IAP for labor. | Volume |

## Money writers

Only Admin SDK / Functions write `executedPriceCents` and `paymentStatus`. Stripe is source of truth for cards. Off-platform executed price is the PR 3 callable, not client `paid: true`.

## Open

MTL / 1099-K: counsel. Native Checkout: `expo-web-browser` vs system browser at App Review.
