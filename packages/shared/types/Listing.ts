// Canonical Firestore shape for a "listing" — a scheduled security service
// request. Older documents (from before the apps/web + apps/mobile
// unification) may still hold web's ad hoc provider-profile shape
// (jobTitle/fullName/userImage/btcAdd, demo data via faker); those are
// legacy and read defensively where they still appear, not modeled here.
export interface Listing {
  id?: string
  ownerUid?: string
  createdAt?: unknown
  /** 'public' (map/listings) or 'private' (owner/admin only). Defaults to public. */
  visibility?: 'public' | 'private'
  /** Job lifecycle. Missing on legacy docs is treated as 'open'. */
  status?: 'open' | 'accepted' | 'in_progress' | 'done'
  /** Provider who accepted the job. Empty while status is 'open'. For a team, this is the captain. */
  assigneeUid?: string
  /**
   * How many providers the job needs. Missing means solo (1).
   * When greater than 1, assigneeUid is the captain and rosterUids is the roster.
   */
  teamSize?: number
  /** Provider uids. Index 0 is the captain. Empty until the first accept. */
  rosterUids?: string[]
  title: string
  /**
   * Canonical offering type. Missing or unknown on legacy docs is treated
   * as 'other', or inferred from title when it matches an offering name.
   */
  listingType?: 'watch' | 'event' | 'defense' | 'other'
  dateRange: {
    start: { year: number; month: number; day: number }
    end: { year: number; month: number; day: number }
  }
  timeSchedule: {
    start: { hour: number; minute: number }
    end: { hour: number; minute: number }
    repeat: { daysOfWeek: string }
  }[]
  requirements: {
    authentication: number
    proximity: number
    reputation: number
    stake: number
  }
  location?: {
    lat: number
    lng: number
    country?: string
    city?: string
  }
  /**
   * Optional USD cents the requester lists. Omit = no price set.
   * 0 = volunteer. Not stake. Clients cannot write paymentStatus / Stripe ids.
   */
  listedPriceCents?: number
  currency?: 'usd'
  /** Off-platform dual-ack. Clients write only their own pair; not executed/paymentStatus. */
  proposedExecutedPriceCentsOwner?: number
  proposedExecutedPriceCentsAssignee?: number
  executedPriceAckOwner?: boolean
  executedPriceAckAssignee?: boolean
}
