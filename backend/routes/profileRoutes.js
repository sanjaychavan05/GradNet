import express from "express";
import multer from "multer";
import { ProfileController } from "../controllers/profileController.js";

const router = express.Router();

const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
];

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10mb
    files: 2
  },
  fileFilter(req, file, cb) {
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  }
});

router.get("/", ProfileController.getProfile);

router.post(
    "/update", 
    upload.fields([
        { name: 'profileImage', maxCount: 1 },
        { name: 'bannerImage', maxCount: 1 }
    ]), 
    ProfileController.updateProfile
);
router.get("/getUserPosts", ProfileController.getUserPosts)

router.get("/:handle", ProfileController.getProfileByHandle);
export default router;