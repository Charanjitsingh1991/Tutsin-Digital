#!/bin/sh
set -e

# Run database migrations if configured to use DB
if [ "${USE_DB}" = "true" ] && [ -n "${DATABASE_URL}" ]; then
  echo "Running database migrations (drizzle-kit push)..."
  # Ensure sslmode=require is present for Supabase/managed Postgres
  if echo "$DATABASE_URL" | grep -q "?"; then
    export DATABASE_URL_WITH_SSL="${DATABASE_URL}&sslmode=require"
  else
    export DATABASE_URL_WITH_SSL="${DATABASE_URL}?sslmode=require"
  fi

  # Try to enable pgcrypto extension for gen_random_uuid()
  node -e "const { Client } = require('pg');(async()=>{const c=new Client({connectionString:process.env.DATABASE_URL_WITH_SSL,ssl:{rejectUnauthorized:false}});try{await c.connect();await c.query('create extension if not exists pgcrypto');console.log('pgcrypto enabled or already present');}catch(e){console.error('pgcrypto enable skipped:', e.message);}finally{try{await c.end();}catch(e){}}})()" || true

  # Allow continue if already up-to-date
  DATABASE_URL=\"$DATABASE_URL_WITH_SSL\" npm run db:push || true
else
  echo "Skipping migrations (USE_DB!=true or DATABASE_URL missing)"
fi

echo "Starting application..."
exec npm run start