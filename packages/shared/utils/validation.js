export const PASSWORD_MIN_LENGTH = 8

export const PASSWORD_REQUIREMENTS =
  'At least 8 characters, with uppercase, lowercase, and a number'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email) {
  const trimmed = (email || '').trim()
  if (!trimmed) return 'Email is required'
  if (!EMAIL_PATTERN.test(trimmed)) return 'Enter a valid email address'
  return null
}

export function validatePassword(password) {
  if (!password) return 'Password is required'
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
  }
  if (!/[a-z]/.test(password)) return 'Password must include a lowercase letter'
  if (!/[A-Z]/.test(password)) return 'Password must include an uppercase letter'
  if (!/[0-9]/.test(password)) return 'Password must include a number'
  return null
}

export function validatePasswordConfirm(password, confirm) {
  const passwordError = validatePassword(password)
  if (passwordError) return passwordError
  if (password !== confirm) return 'Passwords do not match'
  return null
}
