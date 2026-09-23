import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import {
  createJob,
  getAllJob,
  getJobById,
  getMyJobs,
  updateJobVisibility,
} from "../controllers/job.controller.js";
import jobCreateValidation from "../middleware/job.validation.middleware.js";
import { applyJobValidationResult } from "../middleware/applyJob.validator.js";
import {
  applyJob,
  checkUserApplied,
  getAppliedJobs,
  getCompanyApplications,
  getJobApplicantsCount,
  updateApplicationStatus,
} from "../controllers/application.controller.js";
import { authorizedRole } from "../middleware/authorizeRole.middleware.js";
import upload from "../middleware/multer.middleware.js";
const router = express.Router();

// All database identifiers are now PostgreSQL UUIDs.
for (const name of ["id", "jobId"]) {
  router.param(name, (req, res, next, value) => {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
      return res.status(400).json({ success: false, message: "Invalid identifier" });
    }
    next();
  });
}

router.post("/create",isAuthenticated, authorizedRole("company"), jobCreateValidation,createJob);
router.get("/get", getAllJob);
router.get("/myjobs", isAuthenticated, authorizedRole("company"), getMyJobs);

// applied jobs

router.get("/applied", isAuthenticated, getAppliedJobs);
router.get("/company/allapplications",isAuthenticated,authorizedRole("company"),getCompanyApplications)
// fetch jobapplicants count
router.get("/:jobId/checkapplication",isAuthenticated,checkUserApplied)
router.get("/company/applicants",isAuthenticated, authorizedRole("company"), getJobApplicantsCount);

// update the status

router.patch(
  "/application/:id/status",
  isAuthenticated,
  authorizedRole("company"),
  updateApplicationStatus,
);
// apply job router

router.post(
  "/:jobId/apply",
  isAuthenticated,
  authorizedRole("job Seeker"),
  upload.single("resume"),
  applyJobValidationResult,
  applyJob,
);
// get id by job
router.get("/:id", getJobById);
router.patch(`/:id/visibility`,isAuthenticated,authorizedRole("company"),updateJobVisibility)
export default router;
