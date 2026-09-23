import {body,param,validationResult} from 'express-validator'

export const applyJobValidationResult = [
    param("jobId")
    .notEmpty()
    .withMessage("Job id is required")
    .isUUID()
    .withMessage("Invalid job id"),

    body("letter")
    .notEmpty()
    .withMessage("Letter is required")
    .isLength({min:50})
    .withMessage("Letter must be at least 50 characters"),

    // body("resume")
    // .notEmpty()
    // .withMessage("Resume is required")
    // .isURL()
    // .withMessage("Resume must be a valid URL"),

    (req,res,next)=>{
        const errors=validationResult(req);
        if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    };
    next();
    }
]
