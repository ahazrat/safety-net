// A "listing" is stored schema-less in Firestore, and web and mobile
// currently populate it with two different shapes (web: a provider profile
// card with demo/faker data; mobile: a scheduled service request modeled on
// the old Mongoose schema, with authentication/proximity/reputation/stake
// requirements). This type is deliberately loose — it documents both shapes
// rather than forcing one, since unifying them is a product decision, not a
// repo-cleanup one. Every field is optional; read defensively.
export interface Listing {
  id?: string
  createdAt?: unknown

  // web shape
  jobTitle?: string
  userName?: string
  fullName?: string
  userImage?: string
  btcAdd?: string

  // mobile shape
  title?: string
  dateRange?: {
    start?: { year?: number; month?: number; day?: number }
    end?: { year?: number; month?: number; day?: number }
  }
  requirements?: {
    authentication?: number
    proximity?: number
    reputation?: number
    stake?: number
  }

  // shared
  location?: {
    lat?: number
    lng?: number
    latLng?: [number, number]
    country?: string
    city?: string
  }
}
