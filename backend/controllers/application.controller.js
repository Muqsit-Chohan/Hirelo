// import { application } from "express";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { Storage } from "../utils/supabaseStorage.js";
import { applicationStatusMailer } from "../utils/sendEmail.js";
import { whatsAppMailer } from "../utils/sendWhatsApp.js";

async function notifyStatusChange(application, status) {
  const applicantName = application.applicant?.fullName || "there";
  const jobTitle = application.job?.jobTitle || "the role";
  const companyName = application.job?.postedBy?.companyName || application.job?.postedBy?.fullName || "The employer";
  const whatsAppText = status === "accepted"
    ? `Congratulations ${applicantName}! ${companyName} has accepted your application for ${jobTitle} on Hirelo. They may reach out to you directly with next steps.`
    : `Hi ${applicantName}, ${companyName} has reviewed your application for ${jobTitle} on Hirelo and decided not to move forward at this time. Thank you for your interest — we encourage you to keep exploring other opportunities on Hirelo.`;

  if (application.applicant?.email) {
    try {
      await applicationStatusMailer.send(application.applicant.email, {
        applicantName, jobTitle, companyName, status,
      });
    } catch (error) {
      console.error(`${status} email failed:`, error.code || error.message);
    }
  }

  if (application.applicant?.phoneNumber) {
    try {
      await whatsAppMailer.send(application.applicant.phoneNumber, whatsAppText);
    } catch (error) {
      console.error(`${status} WhatsApp message failed:`, error.code || error.message);
    }
  }
}

export const applyJob = async (req, res) => {
  let upload;
  let saved = false;
  try {
    
    const userId = req.user.userId;
    const jobId = req.params.jobId;
    const  letter  = req.body.letter;
    if (!jobId) {
      return res.status(400).json({
        message: "job id required",
        success: false,
      });
    }
    if(!req.file){
      return res.status(400).json({
    message: "Resume file is required",
    success: false,
  });
    }
    const job = await Job.findById(jobId);
    if (!job || !job.visibility) {
      return res.status(400).json({
        message: "job not found",
        success: false,
      });
    }
    const existingApplication = await Application.findExisting(jobId, userId);

    if (existingApplication) {
      return res.status(400).json({
        message: "you have alerady applied for this job",
        success: false,
      });
    }
    // const folder="resume"
    upload = await Storage.upload(req.file, "resumes", userId);
    const application = await Application.create({
      job: jobId,
      applicant: userId,
      letter,
      resume:{
        url:upload.url,
        public_id:upload.path,
      }
    });
    saved = true;
    return res.status(201).json({
      message: "Application submitted successfully",
      application: await Storage.applicationResponse(application),
    });
  } catch (error) {
    if (upload && !saved) await Storage.cleanup([upload]);
    console.log(error);
    if (error.code === "23505") {
      return res.status(409).json({ success: false, message: "You have already applied for this job" });
    }
    return res.status(error.status || 500).json({
      message: error.status === 400 ? error.message : "Server error",
    });
  }
};


export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.user.userId;

    const applications = await Application.findByApplicant(userId);
    res.status(200).json({
      success: true,
      applications: await Promise.all(applications.map(Storage.applicationResponse)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getJobApplicantsCount = async (req, res) => {
  try {
    const companyId = req.user.userId;

    const jobs = await Job.findByCompany(companyId);
    if (!jobs.length) {
      return res.status(200).json({
        success: true,
        message: "no jobs posted yet",
        data: [],
      });
    }
    const result = await Promise.all(
      jobs.map(async (job) => {
        const count = await Application.countForJob(job._id);
        return {
          job,
          applicants: count,
        };
      }),
    );

    return res.status(200).json({
      message: "job applicant fetch successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const status  = req.body.status;
    const applicationId = req.params.id;
    const validStatus = ["pending", "accepted", "rejected"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "invalid status",
      });
    }
    const application = await Application.updateStatus(applicationId, req.user.userId, status);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    res.json({
      success: true,
      data: await Storage.applicationResponse(application),
    });

    if (status === "accepted" || status === "rejected") {
      notifyStatusChange(application, status).catch((error) => console.error(`${status} notification failed:`, error.message));
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkUserApplied =async (req,res) => {
  try {
    const {jobId} = req.params;
    const userId = req.user.userId;

    if(!jobId){
      return res.status(400).json({
        message:"jobId is required",
      })
    }
    const existingApplication = await Application.findExisting(jobId, userId);
    return res.status(200).json({
      applied:!!existingApplication,
    })
  } catch (error) {
    res.status(500).json({
      success:false,
      message:error.message
    })
  }
}

export const getCompanyApplications =async (req,res)=>{
  try {
    const companyId =req.user.userId
    
    const applications = await Application.findByCompany(companyId);

    return res.status(200).json({
      applications: await Promise.all(applications.map(Storage.applicationResponse)),
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:error.message
    })
  }
}
