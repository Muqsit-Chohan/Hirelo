import express from "express";
import { getCompanyProfile, getProfile, getSeekerProfile, updateProfile } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { authorizedRole } from "../middleware/authorizeRole.middleware.js";
import { profileValidation } from "../middleware/profile.validation.middleware.js";
import upload from "../middleware/multer.middleware.js";
import { generalLimiter, updateProfileLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();
router.use(generalLimiter)
router.param("id", (req, res, next, value) => {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
    return res.status(400).json({ success: false, message: "Invalid identifier" });
  }
  next();
});
router.get("/profile", isAuthenticated, getProfile);
router.get("/company/:id", getCompanyProfile);
// Candidate contact info & resume are private, so only logged-in companies may look them up.
router.get("/seeker/:id", isAuthenticated, authorizedRole("company"), getSeekerProfile);
router.put(
  "/profile/update",
  updateProfileLimiter,
  isAuthenticated,
  upload.fields([
    { name: "profilePhoto", maxCount: 1 }, // for profile image
    { name: "resume", maxCount: 1 },
  ]),
  profileValidation,
  updateProfile,
);
export default router;
