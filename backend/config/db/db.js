import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: new URL("../../.env", import.meta.url), quiet: true });

let client;
export function getSupabase() {
  if (!client) {
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env");
    }
    client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  }
  return client;
}

export async function connectDB() {
  for (const table of ["users", "jobs", "applications"]) {
    const { error } = await getSupabase().from(table).select("_id").limit(1);
    if (error?.code === "PGRST205" || error?.code === "42P01") {
      throw new Error(
        `Supabase table public.${table} is missing. Run backend/supabase/schema.sql ` +
        "in this project's Supabase SQL Editor, then restart the backend."
      );
    }
    if (error) throw new Error(`Supabase ${table} check failed: ${error.message}`);
  }
  console.log("Supabase database connected");
}

export async function queryData(query) {
  const { data, error } = await query;
  if (error) {
    const failure = new Error(error.message);
    failure.code = error.code;
    throw failure;
  }
  return data;
}

