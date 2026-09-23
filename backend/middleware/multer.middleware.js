import multer from "multer";
import { MAX_FILE_SIZE, PHOTO_TYPES, RESUME_TYPES } from "../utils/supabaseStorage.js";

const storage = multer.memoryStorage();

const fileFilter = (req,file,cb)=>{
    const allowedTypes = file.fieldname === "profilePhoto" ? PHOTO_TYPES : RESUME_TYPES;
  if(allowedTypes.includes(file.mimetype)){
    cb(null,true);
  }else{
    cb(Object.assign(new Error("Profile photos must be JPG/PNG; resumes must be PDF/DOC/DOCX"), { status: 400 }),false);
  }
  
}
const upload = multer({
    storage,
    fileFilter,
    limits:{fileSize:MAX_FILE_SIZE, files:2}
  })
export default upload;
