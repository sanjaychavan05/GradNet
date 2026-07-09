import { User } from "../models/User.js";
import { uploadToS3 } from "../services/s3Upload.js";
export class ProfileController{
    static async getProfile(req, res){
       try {
        const userId = req.session.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }

        const user = await User.findByUserId(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        
        res.json({ user: user, success: true, message: "User profile retrieved successfully." });

        } catch (error) {
            console.error("Error getting user profile:", error);
            res.status(500).json({ success: false, message: 'Failed to to get profile.' });
        }
    }

    static async getProfileByHandle(req, res) {
        try {
            const handle = req.params.handle;
            const user = await User.findByHandle(handle);
    
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            
            const { password, email, ...publicProfile } = user;
    
            res.json({ user: publicProfile, success: true, message: "User profile retrieved successfully." });
    
        } catch (error) {
            console.error("Error getting user profile by handle:", error);
            res.status(500).json({ success: false, message: 'Failed to to get profile.' });
        }
    }

    static async updateProfile(req, res) {
        try {
            const userId = req.session.userId;
            const textData = req.body;
            const files = req.files;

            if (textData.position) {
                const userRole = req.session.user.role; 
                if (userRole !== 'admin' && userRole !== 'faculty') {
                    delete textData.position; 
                }
            }

            const profileDataToUpdate = { ...textData };

            if (files) {
                const uploadPromises = [];

                if (files.profileImage && files.profileImage[0]) {
                    const pFile = files.profileImage[0];
                    const pPromise = uploadToS3({
                        buffer: pFile.buffer,
                        mimetype: pFile.mimetype,
                        originalName: pFile.originalname,
                        folder: "profiles"
                    }).then(key => {
                        profileDataToUpdate.profile_picture_url = key;
                    });
                    uploadPromises.push(pPromise);
                }

                if (files.bannerImage && files.bannerImage[0]) {
                    const bFile = files.bannerImage[0];
                    const bPromise = uploadToS3({
                        buffer: bFile.buffer,
                        mimetype: bFile.mimetype,
                        originalName: bFile.originalname,
                        folder: "banners"
                    }).then(key => {
                        profileDataToUpdate.profile_banner_url = key;
                    });
                    uploadPromises.push(bPromise);
                }

                if (uploadPromises.length > 0) {
                    await Promise.all(uploadPromises);
                }
            }

            
            const updatedUser = await User.updateProfile(userId, profileDataToUpdate);
            
            
            const { password, ...profileData } = updatedUser; 
            
            req.session.user = {
                ...req.session.user,
                name: profileData.name,
                profile_image_url: profileData.profile_picture_url
            };
            
            res.json({ 
                success: true, 
                message: "Profile updated successfully.", 
                user: profileData 
            });

        } catch (error) {
            console.error("Error updating user profile:", error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to update profile.' 
            });
        }
}
    
    static async getUserPosts(req, res){
        try {
            const userId = req.query.userId || req.session.userId;
            
            if(!userId){
                return res.status(401).json({ success: false, message: "User not specified or not authenticated." });
            }
            const page = parseInt(req.query.page, 10) || 1;
            const result = await User.GetUserPosts(page, userId);
            if (!result) {
                return res.status(500).json({ success: false, message: "Error getting the feed" });
            }

            const hasMore = result.rows.length === 10;

            res.json({
                feed: result.rows,
                success: true,
                hasMore: hasMore
            });
        } catch (error) {
            console.error("Error getting user posts:", error);
            res.status(500).json({success: false, message: "Server error while getting user posts"});
        }
    }
}