#!/bin/sh
set -e

# Run database migrations if configured to use DB
if [ "${USE_DB}" = "true" ] && [ -n "${DATABASE_URL}" ]; then
  echo "Running database migrations (drizzle-kit push)..."
  # Ensure sslmode=require is present for Supabase/managed Postgres and normalize scheme to postgres://
  if echo "$DATABASE_URL" | grep -q "?"; then
    URL_WITH_SSL="${DATABASE_URL}&sslmode=require"
  else
    URL_WITH_SSL="${DATABASE_URL}?sslmode=require"
  fi
  URL_WITH_SSL=$(printf "%s" "$URL_WITH_SSL" | sed 's#^postgresql://#postgres://#')

  # Resolve hostname to IPv4 and replace host to avoid IPv6 ENETUNREACH
  RESOLVED_URL=$(URL_IN="$URL_WITH_SSL" node -e "
    const { lookup } = require('dns').promises; 
    const u = new URL(process.env.URL_IN);
    (async () => {
      try {
        const { address } = await lookup(u.hostname, { family: 4 });
        u.hostname = address;
        process.stdout.write(u.toString());
      } catch {
        process.stdout.write(process.env.URL_IN);
      }
    })();
  ")
  export DATABASE_URL="$RESOLVED_URL"

  # Try to enable pgcrypto extension for gen_random_uuid()
  node -e "const { Client } = require('pg');(async()=>{const c=new Client({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:false}});try{await c.connect();await c.query('create extension if not exists pgcrypto');console.log('pgcrypto enabled or already present');}catch(e){console.error('pgcrypto enable skipped:', e.message);}finally{try{await c.end();}catch(e){}}})()" || true

  # Allow continue if already up-to-date
  npm run db:push || true
else
  echo "Skipping migrations (USE_DB!=true or DATABASE_URL missing)"
fi

echo "Starting application..."
exec npm run start