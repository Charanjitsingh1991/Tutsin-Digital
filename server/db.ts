import { setDefaultResultOrder } from "node:dns";
setDefaultResultOrder("ipv4first");
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

// Prefer explicit IPv4 host override when provided to avoid IPv6 issues
let pool: Pool;
try {
  const url = new URL(process.env.DATABASE_URL);
  const explicitHost = process.env.DATABASE_HOST;
  if (explicitHost) {
    pool = new Pool({
      host: explicitHost,
      port: Number(url.port || 5432),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, "") || "postgres",
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    });
  } else {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
    });
  }
} catch {
  // Fallback to connection string if URL parsing fails
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  });
}

export const db = drizzle(pool, { schema });

