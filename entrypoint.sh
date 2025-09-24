#!/bin/sh
set -e

# Run database migrations if configured to use DB
if [ "${USE_DB}" = "true" ] && [ -n "${DATABASE_URL}" ]; then
  echo "Running database migrations (drizzle-kit push)..."
  # Allow continue if already up-to-date
  npm run db:push || true
else
  echo "Skipping migrations (USE_DB!=true or DATABASE_URL missing)"
fi

echo "Starting application..."
exec npm run start