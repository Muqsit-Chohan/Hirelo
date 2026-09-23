import { User, mergeProfileUpdate } from "../models/user.model.js";
import { Storage } from "../utils/supabaseStorage.js";

export const updateProfile = async (req, res) => {
  const uploads = [];
  let saved = false;
  try {
    console.log(req.body, "REQ BODY 🔥");

    const userId = req.user.userId;
    const current = await User.findById(userId);
    if (!current) return res.status(404).json({ success: false, message: "User not found" });
    const updateData = {};

    // =========================
    // ✅ PARSE DATA (IMPORTANT)
    // =========================
    let mainData = null;
    let profileData = null;
    let companyData = null;

    try {
      // Company wala main
      if (req.body.main) {
        mainData = JSON.parse(req.body.main);
      }

      // Seeker + Company profile
      if (req.body.profile) {
        profileData =
          typeof req.body.profile === "string"
            ? JSON.parse(req.body.profile)
            : req.body.profile;
      }
      // Company profile
      if (req.body.companyProfile) {
        companyData = JSON.parse(req.body.companyProfile);
      }
      
      console.log(mainData, "MAIN ✅");
      console.log(profileData, "PROFILE ✅");
      console.log(companyData, "COMPANY ✅");
    } catch (err) {
      console.log("Parse error ❌", err);
    }
    
    const finalProfile = profileData || mainData?.profile;
    // =========================
    // ✅ TOP LEVEL FIELDS
    // =========================
    const topFields = ["fullName", "email","companyName", "phoneNumber", "location", "about"];

    // 👉 Seeker direct fields
    topFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // 👉 Company mainData
    if (mainData) {
      topFields.forEach((field) => {
        if (mainData[field] !== undefined) {
          updateData[field] = mainData[field];
        }
      });
    }

    // =========================
    // ✅ PROFILE DATA (Seeker + Company)
    // =========================
    if (finalProfile) {
      const profileFields = ["age","tagline", "title"];

      profileFields.forEach((field) => {
        if (finalProfile[field] !== undefined) {
          updateData[`profile.${field}`] = finalProfile[field];
        }
      });

      // ✅ Skills
      if (finalProfile.skills !== undefined) {
        let skillArray = [];

        if (Array.isArray(finalProfile.skills)) {
          skillArray = finalProfile.skills
            .map((s) =>
              typeof s === "string" ? s.trim() : s.name?.trim()
            )
            .filter(Boolean);
        }

        updateData["profile.skills"] = skillArray;
      }

      // ✅ Education
      if (finalProfile.education !== undefined) {
        updateData["profile.education"] = finalProfile.education;
      }

      // ✅ Experience
      if (finalProfile.experience !== undefined) {
        updateData["profile.experience"] = finalProfile.experience;
      }
    }

    // =========================
    // ✅ COMPANY PROFILE
    // =========================
    if (companyData) {
      const companyFields = [
        "companySize",
        "foundedYear",
        "industry",
        "mission",
        "vision",
        "website",
      ];

      companyFields.forEach((field) => {
        if (companyData[field] !== undefined) {
          updateData[`companyProfile.${field}`] = companyData[field];
        }
      });

      // ✅ Social Links
      if (companyData.socialLinks) {
        Object.keys(companyData.socialLinks).forEach((key) => {
          updateData[`companyProfile.socialLinks.${key}`] =
            companyData.socialLinks[key];
        });
      }
    }

    // =========================
    // ✅ FILE UPLOADS
    // =========================
    if (req.files?.profilePhoto) {
      const file = req.files.profilePhoto[0];

      const result = await Storage.upload(file, "photos", userId);
      uploads.push(result);
      updateData["profile.profilePhoto"] = result.url;
    }

    if (req.files?.resume) {
      const resumeFile = req.files.resume[0];

      const result = await Storage.upload(resumeFile, "resumes", userId);
      uploads.push(result);
      updateData["profile.resume"] = result.url;
      updateData["profile.resumeOrignalName"] =
        resumeFile.originalname;
    }

    // =========================
    // ✅ UPDATE DATABASE
    // =========================
    const user = current
      ? await User.update(userId, mergeProfileUpdate(current, updateData))
      : null;

    if (!user) {
      await Storage.cleanup(uploads);
      return res.status(400).json({
        message: "user not found",
        success: false,
      });
    }

    saved = true;
    return res.status(200).json({
      message: "profile update successfully",
      success: true,
      user: await Storage.userResponse(user),
    });

  } catch (error) {
    if (!saved) await Storage.cleanup(uploads);
    console.log("SERVER ERROR ❌", error);

    return res.status(error.status || 500).json({
      message: error.status === 400 ? error.message : "Server error",
      success: false,
    });
  }
};
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    return res.status(200).json({
      message: "profile fetch successfully",
      success: true,
      data: await Storage.userResponse(user),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};
export const getCompanyProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user || user.role !== "company") {
      return res.status(404).json({ success: false, message: "Company not found" });
    }
    return res.status(200).json({
      success: true,
      data: await Storage.userResponse(user),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
export const getSeekerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user || user.role !== "job Seeker") {
      return res.status(404).json({ success: false, message: "Candidate not found" });
    }
    return res.status(200).json({
      success: true,
      data: await Storage.userResponse(user),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
