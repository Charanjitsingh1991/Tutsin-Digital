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

  # Parse URL, resolve IPv4, and export PG* env vars to force IPv4 for node-postgres/drizzle
  eval $(URL_IN="$URL_WITH_SSL" node -e '
    (async () => {
      const { lookup } = require("dns").promises;
      const u = new URL(process.env.URL_IN);
      let host = u.hostname;
      try {
        const { address } = await lookup(host, { family: 4 });
        host = address;
      } catch {}
      const port = u.port || "5432";
      const user = decodeURIComponent(u.username);
      const pass = decodeURIComponent(u.password);
      const db = (u.pathname || "/postgres").replace(/^\//, "");
      const sslmode = (u.searchParams.get("sslmode") || "require");
      const out = [];
      out.push(`export PGHOST=${host}`);
      out.push(`export PGHOSTADDR=${host}`);
      out.push(`export PGPORT=${port}`);
      out.push(`export PGUSER=${JSON.stringify(user)}`);
      out.push(`export PGPASSWORD=${JSON.stringify(pass)}`);
      out.push(`export PGDATABASE=${JSON.stringify(db)}`);
      out.push(`export PGSSLMODE=${sslmode}`);
      // Also set DATABASE_HOST for app runtime
      out.push(`export DATABASE_HOST=${host}`);
      // Recompose normalized connection string using IPv4
      u.hostname = host;
      console.log(out.join("\n"));
      console.log(`export DATABASE_URL=${JSON.stringify(u.toString())}`);
    })();
  ')

  # Try to enable pgcrypto extension for gen_random_uuid()
  node -e "const { Client } = require('pg');(async()=>{const c=new Client({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:false}});try{await c.connect();await c.query('create extension if not exists pgcrypto');console.log('pgcrypto enabled or already present');}catch(e){console.error('pgcrypto enable skipped:', e.message);}finally{try{await c.end();}catch(e){}}})()" || true

  # Allow continue if already up-to-date
  npm run db:push || true
else
  echo "Skipping migrations (USE_DB!=true or DATABASE_URL missing)"
fi

echo "Starting application..."
exec npm run start