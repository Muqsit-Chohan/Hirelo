import { setupStorage } from "../utils/supabaseStorage.js";

try {
  await setupStorage();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
