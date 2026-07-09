import { Home } from "../models/Home.js"
import { uploadToS3 } from "../services/s3Upload.js";

export class HomeController{
    static async getFeed(req, res) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const { userId, user } = req.session;

            if (!user) {
                return res.status(401).json({ success: false, message: 'Authentication required.' });
            }

            const result = await Home.GetFeed(page, userId);

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
            console.error("Error in getFeed controller:", error);
            res.status(500).json({ success: false, message: "Server error while getting feed." });
        }
    }
    
    static async createPost(req, res) {
        try {
            const { title, description } = req.body;
            const userId = req.session.userId;
            const files = req.files;

            if (!title && !description) {
                return res.status(400).json({
                    success: false,
                    message: "Post content is required."
                });
            }

            const postData = {
                title,
                description,
                posted_by: userId
            };

            // Upload files to S3
            const fileData = [];

            if (files && files.length > 0) {
                for (const file of files) {
                    const key = await uploadToS3({
                        buffer: file.buffer,
                        mimetype: file.mimetype,
                        originalName: file.originalname,
                        folder: "posts"
                    });

                    fileData.push({
                        key,
                        mimeType: file.mimetype
                    });
                }
            }

            const newPostRaw = await Home.createWithFiles(postData, fileData);

            const fullPost = await Home.findById(newPostRaw.id, userId);

            res.status(201).json({
                success: true,
                message: "Post created successfully",
                post: fullPost
            });

        } catch (error) {
            console.error("Error creating post:", error);
            res.status(500).json({
                success: false,
                message: "Server error while creating post."
            });
        }
}

    static async updatePost(req, res) {
        try {
            const { postId } = req.params;
            const { title, description } = req.body;
            const { userId, user } = req.session;

            if (!user) {
                return res.status(401).json({ success: false, message: 'Authentication required.' });
            }

            const post = await Home.findById(postId, userId);

            if (!post) {
                return res.status(404).json({ success: false, message: 'Post not found.' });
            }

            if (post.posted_by !== userId && user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'You are not authorized to update this post.' });
            }

            if (!title && !description) {
                return res.status(400).json({ success: false, message: "Post content is required." });
            }

            const updatedPost = await Home.updateById(postId, { title, description });

            res.json({ success: true, message: 'Post updated successfully.', post: updatedPost });
        } catch (error) {
            console.error("Error updating post:", error);
            res.status(500).json({ success: false, message: "Server error while updating post." });
        }
    }

    static async deletePost(req, res) {
        try {
            const { postId } = req.params;
            const { userId, user } = req.session;

            if (!user) {
                return res.status(401).json({ success: false, message: 'Authentication required.' });
            }

            const post = await Home.findById(postId);

            if (!post) {
                return res.status(404).json({ success: false, message: 'Post not found.' });
            }

            if (post.posted_by !== userId && user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'You are not authorized to delete this post.' });
            }

            await Home.deleteById(postId);

            res.json({ success: true, message: 'Post deleted successfully.' });
        } catch (error) {
            console.error("Error deleting post:", error);
            res.status(500).json({ success: false, message: "Server error while deleting post." });
        }
    }
}