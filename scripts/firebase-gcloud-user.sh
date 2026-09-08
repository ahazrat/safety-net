#!/usr/bin/env bash
# Run firebase-tools with ADC from a gcloud user account instead of the
# stale tokens in ~/.config/configstore/firebase-tools.json (last login
# was fractalstrategies@gmail.com in 2021) or the default ADC
# (fire-ice quota project, refresh fails).
set -euo pipefail
ACCOUNT="${FIREBASE_GCLOUD_ACCOUNT:-asifhazrat@gmail.com}"
ADC="${HOME}/.config/gcloud/legacy_credentials/${ACCOUNT}/adc.json"
if [[ ! -f "$ADC" ]]; then
  echo "Missing gcloud ADC for ${ACCOUNT}: ${ADC}" >&2
  echo "Run: gcloud auth login ${ACCOUNT}" >&2
  exit 1
fi
export GOOGLE_APPLICATION_CREDENTIALS="$ADC"
export GOOGLE_CLOUD_QUOTA_PROJECT="${GOOGLE_CLOUD_QUOTA_PROJECT:-safety-net-2022}"
# Drop inherited ADC that points at the fire-ice SA / broken default ADC.
unset CLOUDSDK_AUTH_CREDENTIAL_FILE_OVERRIDE
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec "$ROOT/node_modules/.bin/firebase" "$@"
