import { connectDB } from "../config/db/db.js";

try {
  await connectDB();
} catch (error) {
  console.error(error.message);
  console.error("Check backend/.env and run backend/supabase/schema.sql in the Supabase SQL Editor.");
  process.exitCode = 1;
}
