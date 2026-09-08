const { test } = require('node:test')
const assert = require('node:assert/strict')
const { chicagoScannerFeeds } = require('../packages/shared/chicago/scanners.js')

test('Chicago scanner catalogue is links only', () => {
  const feeds = chicagoScannerFeeds()
  assert.ok(feeds.length >= 10)
  const ids = new Set()
  for (const feed of feeds) {
    assert.ok(feed.id)
    assert.equal(ids.has(feed.id), false)
    ids.add(feed.id)
    assert.match(feed.url, /^https:\/\//)
    assert.equal(feed.autoplay, undefined)
    assert.equal(feed.streamUrl, undefined)
  }
  assert.ok(feeds.some(f => f.url.includes('openmhz.com')))
  assert.ok(feeds.some(f => f.url.includes('broadcastify.com')))
})
