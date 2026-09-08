const { test } = require('node:test')
const assert = require('node:assert/strict')

const Routes = require('../packages/shared/constants/Routes')

test('public and auth routes are absolute paths', () => {
  assert.equal(Routes.HOME, '/')
  assert.equal(Routes.SIGN_IN, '/signin')
  assert.equal(Routes.SIGN_UP, '/signup')
  assert.equal(Routes.FORGOT_PASSWORD, '/forgot-password')
  assert.equal(Routes.LISTINGS, '/listings')
  assert.equal(Routes.listingPath('abc'), '/listing/abc')
  assert.equal(Routes.conversationPath('a_b'), '/conversation/a_b')
  assert.equal(Routes.JOBS, '/jobs')
  assert.equal(Routes.MESSAGES, '/messages')
  assert.equal(Routes.MAP, '/map')
})
