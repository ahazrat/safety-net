import { calcCrow } from '../utils/GeoUtils.js'

/** Default Chicago product-gate box (city proper + inner suburbs). */
export const CHICAGO_GATE_BOX = {
  kind: 'box',
  south: 41.64,
  north: 42.08,
  west: -87.94,
  east: -87.5,
}

export function pointInBox(lat, lng, box = CHICAGO_GATE_BOX) {
  return lat >= box.south && lat <= box.north && lng >= box.west && lng <= box.east
}

/** Circle: center lat/lng and radiusKm. Uses GeoUtils crow-flies km. */
export function pointInCircle(lat, lng, circle) {
  if (!circle || circle.lat == null || circle.lng == null || !(circle.radiusKm > 0)) {
    return false
  }
  const km = Number(calcCrow([circle.lat, circle.lng], [lat, lng]))
  return km <= circle.radiusKm
}

/** Ray-casting. `ring` is [{lat, lng}, ...] or [[lat, lng], ...], not closed. */
export function pointInPolygon(lat, lng, ring) {
  if (!Array.isArray(ring) || ring.length < 3) return false
  const pts = ring.map(p => (Array.isArray(p) ? { lat: p[0], lng: p[1] } : p))
  let inside = false
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const yi = pts[i].lat
    const xi = pts[i].lng
    const yj = pts[j].lat
    const xj = pts[j].lng
    const intersect =
      yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi + 0) + xi
    if (intersect) inside = !inside
  }
  return inside
}

/**
 * Ambiguous Chicago gate: default box, optional circle radius, optional polygon.
 * `spec.kind` is 'box' | 'circle' | 'polygon'. Unknown kind is not in gate.
 */
export function pointInChicagoGate(lat, lng, spec = CHICAGO_GATE_BOX) {
  if (typeof lat !== 'number' || typeof lng !== 'number' || Number.isNaN(lat) || Number.isNaN(lng)) {
    return false
  }
  const kind = (spec && spec.kind) || 'box'
  if (kind === 'box') return pointInBox(lat, lng, spec.south != null ? spec : CHICAGO_GATE_BOX)
  if (kind === 'circle') return pointInCircle(lat, lng, spec)
  if (kind === 'polygon') return pointInPolygon(lat, lng, spec.ring || spec.points)
  return false
}
