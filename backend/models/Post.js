import db from "../config/database.js";
import { attachUserSignedUrls } from "../services/GetProfileSignedUrl.js";

export default class Post {
    static async getPostsByTopicId(topicId, page = 1, userId) { 
        try {
            const limit = 20;
            const offset = (page - 1) * limit;
            const query = `
                SELECT
                    p.id,
                    p.content,
                    p.created_at,
                    p.is_edited,
                    p.like_count,
                    p.reply_count,
                    u.id AS author_id,
                    u.name AS author_name,
                    u.handle,
                    u.profile_picture_url,
                    (CASE WHEN b.user_id IS NOT NULL THEN true ELSE false END) AS is_bookmarked
                FROM forum_posts p
                INNER JOIN users u ON p.author_id = u.id
                LEFT JOIN public.bookmarks b
                    ON b.bookmarkable_id = p.id
                    AND b.user_id = $4
                    AND b.bookmarkable_type = 'forum_post'
                WHERE p.topic_id = $1
                ORDER BY p.created_at ASC
                LIMIT $2 OFFSET $3
            `;
            
            const result = await db.query(query, [topicId, limit, offset, userId]);
            await attachUserSignedUrls(result.rows);
            return result;
        } catch (error) {
            throw new Error(`Error getting posts: ${error.message}`);
        }
    }

    static async createPost(topicId, userId, content) {
        try {
            const query = `
                INSERT INTO forum_posts (topic_id, author_id, content)
                VALUES ($1, $2, $3)
                RETURNING *
            `;
            const result = await db.query(query, [topicId, userId, content]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating post: ${error.message}`);
        }
    }
}