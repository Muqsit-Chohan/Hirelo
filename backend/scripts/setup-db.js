import dotenv from "dotenv";
import { readFile } from "node:fs/promises";
import pg from "pg";

dotenv.config({ path: new URL("../.env", import.meta.url), quiet: true });
let client;
try {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is missing in backend/.env");
  const url = new URL(process.env.DATABASE_URL);
  if (!["postgres:", "postgresql:"].includes(url.protocol)) throw new Error("DATABASE_URL must start with postgresql://");
  if (!url.password || /YOUR.PASSWORD/i.test(decodeURIComponent(url.password))) throw new Error("Replace the password placeholder in DATABASE_URL");
  const project = new URL(process.env.SUPABASE_URL).hostname.split(".")[0];
  if (!url.hostname.includes(project) && !decodeURIComponent(url.username).endsWith(`.${project}`)) {
    throw new Error("DATABASE_URL does not match the configured Supabase project");
  }
  // Use verified TLS; do not let URI SSL flags weaken certificate validation.
  for (const key of ["sslmode", "sslcert", "sslkey", "sslrootcert"]) url.searchParams.delete(key);
  const ca = await readFile(new URL("../supabase/prod-ca-2021.crt", import.meta.url), "utf8");
  client = new pg.Client({ connectionString: url.toString(), ssl: { rejectUnauthorized: true, ca }, connectionTimeoutMillis: 15000 });
  await client.connect();
  const existing = await client.query("select tablename from pg_tables where schemaname = 'public' and tablename = any($1)", [["users", "jobs", "applications"]]);
  if (existing.rows.length === 3) {
    console.log("All three application tables already exist; no schema changes made.");
  } else if (existing.rows.length) {
    throw new Error("Partial schema exists. Inspect existing tables before applying the initial schema.");
  } else {
    const schema = await readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8");
    await client.query(schema);
    console.log("Created users, jobs, applications, relationships, indexes and access restrictions.");
  }
  await client.query("NOTIFY pgrst, 'reload schema'");
  const tables = await client.query("select tablename, rowsecurity from pg_tables where schemaname = 'public' and tablename = any($1) order by tablename", [["users", "jobs", "applications"]]);
  for (const row of tables.rows) console.log(`${row.tablename}: ready, RLS ${row.rowsecurity ? 'enabled' : 'disabled'}`);
} catch (error) {
  // Connection errors may include credentials: only expose known messages/codes.
  const safe = /^(DATABASE_URL|Replace the password|Partial schema)/.test(error.message);
  console.error(safe ? error.message : `Database setup failed (${error.code || 'connection or SQL error'}). Credentials were not displayed.`);
  process.exitCode = 1;
} finally {
  await client?.end().catch(() => {});
}
