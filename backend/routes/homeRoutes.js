import express from "express";
import { upload } from "../middleware/upload.js";
import { HomeController } from "../controllers/homeController.js";

const router = express.Router();

router.get("/get-feed", HomeController.getFeed);

router.post(
  "/create-post",
  upload.array("postFiles", 4),
  HomeController.createPost
);

router.put("/update-post/:postId", HomeController.updatePost);
router.delete("/delete-post/:postId", HomeController.deletePost);

export default router;
