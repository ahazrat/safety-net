const { test } = require('node:test')
const assert = require('node:assert/strict')
const {
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  PASSWORD_MIN_LENGTH,
} = require('../packages/shared/utils/validation')

test('validateEmail rejects empty and malformed addresses', () => {
  assert.equal(validateEmail(''), 'Email is required')
  assert.equal(validateEmail('   '), 'Email is required')
  assert.equal(validateEmail('not-an-email'), 'Enter a valid email address')
  assert.equal(validateEmail('missing@tld'), 'Enter a valid email address')
  assert.equal(validateEmail('spaces emma@x.com'), 'Enter a valid email address')
})

test('validateEmail accepts a normal address and trims it', () => {
  assert.equal(validateEmail('user@example.com'), null)
  assert.equal(validateEmail('  user@example.com  '), null)
})

test('validatePassword enforces length and character classes', () => {
  assert.equal(validatePassword(''), 'Password is required')
  assert.equal(
    validatePassword('Ab1'),
    `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
  )
  assert.equal(validatePassword('abcdefgh'), 'Password must include an uppercase letter')
  assert.equal(validatePassword('ABCDEFGH'), 'Password must include a lowercase letter')
  assert.equal(validatePassword('Abcdefgh'), 'Password must include a number')
  assert.equal(validatePassword('Abcdefg1'), null)
})

test('validatePasswordConfirm checks match after strength', () => {
  assert.equal(validatePasswordConfirm('Abcdefg1', 'Abcdefg1'), null)
  assert.equal(validatePasswordConfirm('Abcdefg1', 'Abcdefg2'), 'Passwords do not match')
  assert.equal(
    validatePasswordConfirm('short', 'short'),
    `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
  )
})
