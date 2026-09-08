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
  /** Provider who accepted the job. Empty while status is 'open'. */
  assigneeUid?: string
  title: string
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
}
