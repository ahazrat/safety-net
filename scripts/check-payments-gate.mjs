#!/usr/bin/env node
// Read-only product-gate check for docs/payments.md:
// >=5 listings with status == 'done', distinct real owner/assignee,
// lat/lng inside the Chicago gate (packages/shared/chicago/geo.js CHICAGO_GATE_BOX).
// Uses gcloud user ADC (same account as scripts/firebase-gcloud-user.sh) via the
// Firestore REST API — no firebase-admin dependency added to the repo.
//
// Usage: node scripts/check-payments-gate.mjs

import { execSync } from 'node:child_process'

const PROJECT = process.env.FIRESTORE_PROJECT || 'safety-net-2022'
const ACCOUNT = process.env.FIREBASE_GCLOUD_ACCOUNT || 'asifhazrat@gmail.com'

// packages/shared/chicago/geo.js CHICAGO_GATE_BOX, kept in sync manually.
const CHICAGO_GATE_BOX = { south: 41.64, north: 42.08, west: -87.94, east: -87.5 }
function pointInBox(lat, lng, box = CHICAGO_GATE_BOX) {
  return lat >= box.south && lat <= box.north && lng >= box.west && lng <= box.east
}

function getAccessToken() {
  return execSync(`gcloud auth print-access-token --account ${ACCOUNT}`, {
    encoding: 'utf8',
  }).trim()
}

function unwrapValue(v) {
  if (v == null) return v
  if ('stringValue' in v) return v.stringValue
  if ('integerValue' in v) return Number(v.integerValue)
  if ('doubleValue' in v) return v.doubleValue
  if ('booleanValue' in v) return v.booleanValue
  if ('mapValue' in v) return unwrapFields(v.mapValue.fields || {})
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(unwrapValue)
  if ('nullValue' in v) return null
  if ('timestampValue' in v) return v.timestampValue
  return v
}

function unwrapFields(fields) {
  const out = {}
  for (const [k, v] of Object.entries(fields)) out[k] = unwrapValue(v)
  return out
}

async function main() {
  const token = getAccessToken()
  const url = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents:runQuery`
  const body = {
    structuredQuery: {
      from: [{ collectionId: 'listings' }],
      where: {
        fieldFilter: {
          field: { fieldPath: 'status' },
          op: 'EQUAL',
          value: { stringValue: 'done' },
        },
      },
    },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    console.error(`Firestore REST error: ${res.status} ${res.statusText}`)
    console.error(await res.text())
    process.exit(1)
  }

  const rows = await res.json()
  const listings = rows
    .filter(r => r.document)
    .map(r => {
      const name = r.document.name // .../documents/listings/{id}
      const id = name.split('/').pop()
      const fields = unwrapFields(r.document.fields || {})
      return { id, ...fields }
    })

  console.log(`Total status=='done' listings: ${listings.length}\n`)

  const seenPairs = new Set()
  const gateHits = []

  for (const l of listings) {
    const owner = l.ownerUid
    const assignee = l.assigneeUid
    const loc = l.location
    const lat = loc && typeof loc.lat === 'number' ? loc.lat : undefined
    const lng = loc && typeof loc.lng === 'number' ? loc.lng : undefined

    const distinctRealParties = owner && assignee && owner !== assignee
    const inGate = lat != null && lng != null && pointInBox(lat, lng)
    const pairKey = `${owner}|${assignee}`

    console.log(
      `${l.id}  owner=${owner || '—'}  assignee=${assignee || '—'}  ` +
        `lat/lng=${lat ?? '—'},${lng ?? '—'}  inChicagoBox=${inGate}  ` +
        `distinctParties=${!!distinctRealParties}`
    )

    if (distinctRealParties && inGate && !seenPairs.has(pairKey)) {
      seenPairs.add(pairKey)
      gateHits.push(l.id)
    }
  }

  console.log(
    `\nGate-qualifying done jobs (distinct owner/assignee pair, in Chicago box, deduped by pair): ${gateHits.length}`
  )
  console.log(`Gate requires >=5. Currently: ${gateHits.length >= 5 ? 'PASSES' : 'does NOT pass'}.`)
  console.log(
    `\nNote: this script cannot distinguish real users from known seed/faker uids —`,
    `docs/payments.md says manual review of the pin count is enough once this count is close to 5.`
  )
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
