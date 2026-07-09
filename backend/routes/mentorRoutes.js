import express from "express";
import { 
    createMentor, 
    updateMentorProfile, 
    browseMentorships, 
    createMentee, 
    handleApplication,
    getMentorDashboard,
    getStudentDashboard,
    moderateMentorship,
    getPendingMentorships,
    deleteMentorship
} from "../controllers/mentorControllers.js";

const router = express.Router();

router.get("/browse", browseMentorships);

// Apply for a mentorship (Mentee side)
router.post("/apply/:mentorship_id", createMentee);

// View- My Applications (Mentee side)
router.get("/my-applications", getStudentDashboard);


// --- Mentor Routes ---
router.post("/profile", createMentor);
router.patch("/profile/:mentorship_id", updateMentorProfile);
router.get("/dashboard", getMentorDashboard);

router.patch("/application/:enrollment_id", handleApplication);


// --- Faculty/Admin Routes ---
router.get('/admin/pending', getPendingMentorships);
router.patch("/moderate/:mentorship_id", moderateMentorship);

router.delete("/delete-mentorship/:id", deleteMentorship)
export default router;