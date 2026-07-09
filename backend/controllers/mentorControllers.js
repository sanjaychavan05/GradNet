import { User } from "../models/User.js";
import {
    CreateMentor,
    UpdateMentor,
    CreateMentee,
    UpdateEnrollmentStatus,
    GetApplicationsForMentor,
    GetStudentApplications,
    GetAllActiveMentorships,
    ApproveMentorProfile,
    GetPendingMentorships,
    GetMentorshipById,
    DeleteById
} from "../models/Mentor.js";

export const createMentor = async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    try {
        const user = await User.findByUserId(userId);

        if (!user) return res.status(404).json({ success: false, message: `User doesn't exist!` });

        // Check for allowed roles
        const allowedRoles = ['alumni', 'faculty', 'admin'];
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ success: false, message: `Your role (${user.role}) is not eligible to be a mentor.` });
        }

        const mentorShipData = req.body;

        if (!mentorShipData.guidance_on || !mentorShipData.description) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        const result = await CreateMentor(userId, mentorShipData);

        return res.status(201).json({
            success: true,
            message: `Mentor profile created successfully. Please wait for faculty approval.`,
            data: result
        });

    } catch (err) {
        console.error("Controller Error:", err);
        res.status(500).json({ success: false, message: `Failed to create mentor. Please try again later.` });
    }
}

export const updateMentorProfile = async (req, res) => {
    const userId = req.session.userId;
    const { mentorship_id } = req.params;

    if (!userId) return res.status(401).json({ success: false, message: "Not authenticated" });

    try {
        const updatedProfile = await UpdateMentor(mentorship_id, userId, req.body);

        if (!updatedProfile) {
            return res.status(404).json({ success: false, message: "Profile not found or unauthorized." });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated and pending re-approval.",
            data: updatedProfile
        });

    } catch (err) {
        const statusCode = err.message === "No fields provided for update." ? 400 : 500;
        res.status(statusCode).json({ success: false, message: err.message });
    }
};

export const createMentee = async (req, res) => {
    const { mentorship_id } = req.params;

    // const mentorship = await GetMentorshipById(mentorship_id);
    // if (mentorship.mentor_id === userId) {
    //     return res.status(400).json({ success: false, message: "You cannot apply to your own mentorship program." });
    // }

    if (!mentorship_id) {
        return res.status(400).json({ success: false, message: `Mentorship profile ID is required.` });
    }

    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    try {
        const { request_message } = req.body;

        const result = await CreateMentee(mentorship_id, userId, request_message);

        return res.status(201).json({
            success: true,
            message: `Successfully applied! The mentor has been notified.`,
            data: result
        });

    } catch (error) {
        console.error("Controller Error:", error);

        if (error.message.includes("unique_enrollment")) {
            return res.status(409).json({ success: false, message: "You have already applied for this mentorship." });
        }

        res.status(500).json({ success: false, message: `Failed to submit application. Please try again later.` });
    }
}

export const handleApplication = async (req, res) => {
    const { enrollment_id } = req.params;
    const { status, mentor_notes } = req.body;
    const mentorId = req.session.userId;

    if (!mentorId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const validStatuses = ['accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status update." });
    }

    try {
        const result = await UpdateEnrollmentStatus(enrollment_id, mentorId, status, mentor_notes);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Application not found or you are not authorized to manage it."
            });
        }

        const message = status === 'accepted'
            ? "Student successfully accepted into mentorship!"
            : "Application has been rejected.";

        return res.status(200).json({
            success: true,
            message,
            data: result
        });

    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getMentorDashboard = async (req, res) => {
    const mentorId = req.session.userId;

    if (!mentorId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    try {
        const applications = await GetApplicationsForMentor(mentorId);

        return res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getStudentDashboard = async (req, res) => {
    const studentId = req.session.userId;

    if (!studentId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    try {
        const applications = await GetStudentApplications(studentId);

        return res.status(200).json({
            success: true,
            data: applications
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const browseMentorships = async (req, res) => {
    try {
        const { category, search, page = 1, limit = 10 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        const listings = await GetAllActiveMentorships({
            category,
            search,
            limit: parseInt(limit),
            offset
        });

        return res.status(200).json({
            success: true,
            count: listings.length,
            data: listings,
            page: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const moderateMentorship = async (req, res) => {
    const adminId = req.session.userId;
    const { mentorship_id } = req.params;
    const { status } = req.body;

    if (!adminId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    try {
        const user = await User.findByUserId(adminId);
        if (user.role !== 'faculty' && user.role !== 'admin') {
            return res.status(403).json({ success: false, message: "Unauthorized: Faculty only." });
        }

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status." });
        }

        const result = await ApproveMentorProfile(mentorship_id, adminId, status);

        if (!result) {
            return res.status(404).json({ success: false, message: "Mentorship profile not found." });
        }

        return res.status(200).json({
            success: true,
            message: `Profile has been ${status} and is ${status === 'approved' ? 'now live' : 'hidden'}.`,
            data: result
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPendingMentorships = async (req, res) => {
    const adminId = req.session.userId;

    try {
        const user = await User.findByUserId(adminId);
        if (!user || (user.role !== 'faculty' && user.role !== 'admin')) {
            return res.status(403).json({ success: false, message: "Unauthorized." });
        }

        const pending = await GetPendingMentorships();
        return res.status(200).json({ success: true, data: pending });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteMentorship = async (req, res) => {
    const { id } = req.params;
    const { userId, user } = req.session;

    try {
        if (!user) {
            return res.status(401).json({ success: false, message: 'Authentication required.' });
        }

        const mentorShip = await GetMentorshipById(id);

        if (!mentorShip) {
            return res.status(401).json({ success: false, message: 'Mentorship desnt exists or is already deleted' });
        }

        const isOwner = userId === mentorShip.mentor_id;

        if (!isOwner && user.role !== "admin" && user.role !== "faculty") {
            return res.status(401).json({ success: false, message: 'You are not authorized to delete this mentorship program.' });
        }

        await DeleteById(id);

        res.json({ success: true, message: 'Mentorship Program deleted successfully.' });

    } catch (error) {
        console.error("Error deleting mentorship program:", error);
        res.status(500).json({ success: false, message: "Server error while deleting mentorship program." });
    }
}