import { app } from "./app.js";
import { connectDB } from "./config/db/db.js";

const PORT = process.env.PORT || 5000;
try {
  if (!process.env.SECRET_KEY) throw new Error("Set SECRET_KEY in backend/.env for JWT authentication");
  await connectDB();
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
} catch (error) {
  console.error("Startup failed:", error.message);
  process.exitCode = 1;
}

