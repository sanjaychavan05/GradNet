import db from "../config/database.js";
import { attachUserSignedUrls } from "../services/GetProfileSignedUrl.js";

export default class Forum {
    static async getAllForums(page = 1, userId) { 
        try {
            const limit = 10;
            const offset = (page - 1) * limit;
            const query = `
                SELECT 
                    f.id,
                    f.name,
                    f.description,
                    f.color,
                    f.created_by,
                    f.created_at,
                    u.name AS author_name,
                    u.handle,
                    u.profile_picture_url,
                    (CASE WHEN b.user_id IS NOT NULL THEN true ELSE false END) AS is_bookmarked
                FROM forum_categories f
                INNER JOIN users u ON f.created_by = u.id
                LEFT JOIN public.bookmarks b
                    ON b.bookmarkable_id = f.id
                    AND b.user_id = $3
                    AND b.bookmarkable_type = 'forum'
                WHERE f.is_active = true 
                ORDER BY f.created_at DESC
                LIMIT $1 OFFSET $2
            `;
            
            const result = await db.query(query, [limit, offset, userId]);
            await attachUserSignedUrls(result.rows)
            return result;
        } catch (error) {
            throw new Error(`Error getting forums: ${error.message}`)
        }
    }

    static async findById(id, userId){
        try {
            const query = `
                SELECT 
                    f.id,
                    f.name,
                    f.description,
                    f.color,
                    f.created_by,
                    f.created_at,
                    u.name AS author_name,
                    u.handle,
                    u.profile_picture_url,
                    (CASE WHEN b.user_id IS NOT NULL THEN true ELSE false END) AS is_bookmarked
                FROM forum_categories f
                INNER JOIN users u ON f.created_by = u.id
                LEFT JOIN public.bookmarks b
                    ON b.bookmarkable_id = f.id
                    AND b.user_id = $2
                    AND b.bookmarkable_type = 'forum'
                WHERE f.is_active = true AND f.id = $1
            `;
            const result = await db.query(query, [id, userId])
            await attachUserSignedUrls(result.rows)
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error getting the forum: ${error.message}`)
        }
    }

    static async create(name, description, color, createdBy) {
        try {
            const query = `
                INSERT INTO forum_categories (name, description, color, created_by)
                VALUES ($1, $2, $3, $4)
                RETURNING *;
            `;
            const result = await db.query(query, [name, description, color, createdBy]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating forum category: ${error.message}`);
        }
    }

    static async delete(id) {
        try {
            const query = 'UPDATE forum_categories SET is_active = false WHERE id = $1 RETURNING *';
            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error deleting forum: ${error.message}`);
        }
    }
}