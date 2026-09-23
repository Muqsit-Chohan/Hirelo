import * as yup from "yup";

const JobSchema = yup.object({
  // 🧩 STEP 1: Basic Info
  jobTitle: yup
    .string()
    .trim()
    .required("Job title is required")
    .min(3, "Job title must be at least 3 characters long")
    .max(100, "Job title cannot exceed 100 characters"),

  jobCategory: yup.string().required("Please select a job category"),

  jobType: yup
    .string()
    .oneOf(["Full-Time",
      "Part-Time",
      "Contract",
      "Internship",
      "Remote",
      "Freelance",
    ], "Invalid job type")
    .required("Job type is required"),

  location: yup
    .string()
    .trim()
    .required("Job location is required")
    .max(100, "Location cannot exceed 100 characters"),

  numberOpening: yup
    .number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : Number(originalValue)))
    .typeError("Openings must be a valid number")
    .integer("Openings must be a whole number")
    .min(1, "At least one opening is required")
    .max(500, "Openings cannot exceed 500 positions")
    .required("Number of openings is required"),

  // 🧩 STEP 2: Job Details
  description: yup
    .string()
    .trim()
    .required("Job description is required")
    .min(30, "Description should be at least 30 characters long")
    .max(3000, "Description cannot exceed 3000 characters"),

  responsibilities: yup
    .array()
    .of(
      yup
        .string()
        .trim()
        .min(5, "Each responsibility must be at least 5 characters long")
        .max(200, "Each responsibility cannot exceed 200 characters")
        .required("Each responsibility is required")
    )
    .min(1, "At least one responsibility is required")
    .required("Please provide job responsibilities"),

  requirements: yup
    .array()
    .of(
      yup
        .string()
        .trim()
        .min(5, "Each requirement must be at least 5 characters long")
        .max(200, "Each requirement cannot exceed 200 characters")
        .required("Each requirement is required")
    )
    .min(1, "At least one requirement is required")
    .required("Please provide job requirements"),

  ExperienceLevel: yup
    .string()
    .required("Please select an experience level"),

  EducationRequirement: yup
    .string()
    .required("Please select an education level"),

  skills: yup
    .array()
    .of(yup.string().trim())
    .min(1, "Please add at least one skill")
    .required("Skills are required"),

  // 🧩 STEP 3: Salary & Benefits
  MinimumSalary: yup
    .number()
    .typeError("Minimum salary must be a valid number")
    .min(1000, "Minimum salary should be at least 1000")
    .required("Minimum salary is required"),

  MaximumSalary: yup
    .number()
    .typeError("Maximum salary must be a valid number")
    .required("Maximum salary is required")
    .when("MinimumSalary", (MinimumSalary, schema) =>
      MinimumSalary
        ? schema.min(MinimumSalary, "Maximum salary must be greater than minimum salary")
        : schema
    ),

  currency: yup
    .string()
    .required("Currency selection is required"),

  negotiable: yup
    .boolean()
    .default(false),

  perks: yup
    .array()
    .of(yup.string().trim())
    .min(1, "Select at least one perk or benefit")
    .required("At least one perk is required"),

  workSchedule: yup
    .string()
    .required("Please select a work schedule"),

  // 🧩 STEP 4: Application Settings
  applyMethod: yup
    .string()
    .required("Please select how applicants should apply"),

  applicationUrl: yup
    .string()
    .when("applyMethod", {
      is: "external",
      then: (schema) =>
        schema
          .matches(
            /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
            "Please enter a valid URL (e.g., https://example.com)"
          )
          .required("Application URL is required for external applications"),
      otherwise: (schema) => schema.notRequired(),
    }),

  contactEmail: yup
    .string()
    .trim()
    .matches(
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please enter a valid email address (e.g., hr@example.com)"
    )
    .required("Contact email is required"),

  deadline: yup
    .date()
    .typeError("Please enter a valid date (YYYY-MM-DD)")
    .min(new Date(), "Deadline cannot be in the past")
    .required("Application deadline is required"),

  visibility: yup.string().required("Visibility option is required"),
});

export default JobSchema;
