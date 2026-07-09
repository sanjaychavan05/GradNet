import db from "../config/database.js";
import { attachUserSignedUrls } from "../services/GetProfileSignedUrl.js";

export class Jobs {
    static async getJobs(page = 1, userId) {
        try {
            const limit = 15;
            const offset = (page - 1) * limit;
            const query = `
                SELECT 
                    j.id,
                    j.title,
                    j.company,
                    j.location,
                    j.job_type,
                    j.salary_range,
                    j.description,
                    j.requirements,
                    j.application_deadline,
                    j.external_link,
                    j.updated_at,
                    j.work_location,
                    j.posted_by,
                    u.name AS author_name,
                    u.handle,
                    u.profile_picture_url,

                    (CASE WHEN b.user_id IS NOT NULL THEN true ELSE false END) AS is_bookmarked

                FROM job_posts j
                INNER JOIN users u ON j.posted_by = u.id

                LEFT JOIN public.bookmarks b 
                    ON b.bookmarkable_id = j.id
                    AND b.user_id = $3
                    AND b.bookmarkable_type = 'job'

                WHERE j.is_active = true
                ORDER BY j.updated_at DESC
                LIMIT $1 OFFSET $2
            `;
            const result = await db.query(query, [limit, offset, userId]);
            await attachUserSignedUrls(result.rows);
            return result;
        } catch (error) {
            throw new Error(`Error getting jobs from DB: ${error.message}`);
        }
    }

    static async findById(id, userId) {
        try {
           const query = `
                SELECT 
                    j.id,
                    j.title,
                    j.company,
                    j.location,
                    j.job_type,
                    j.salary_range,
                    j.description,
                    j.requirements,
                    j.application_deadline,
                    j.external_link,
                    j.updated_at,
                    j.work_location,
                    j.posted_by,
                    u.name AS author_name,
                    u.handle,
                    u.profile_picture_url,

                    (CASE WHEN b.user_id IS NOT NULL THEN true ELSE false END) AS is_bookmarked

                FROM job_posts j
                INNER JOIN users u ON j.posted_by = u.id

                LEFT JOIN public.bookmarks b 
                    ON b.bookmarkable_id = j.id
                    AND b.user_id = $2
                    AND b.bookmarkable_type = 'job'

                WHERE j.is_active = true AND j.id = $1
            `;
            const result = await db.query(query, [id, userId]);
            await attachUserSignedUrls(result.rows);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error finding job by ID: ${error.message}`);
        }
    }

    static async createJob(jobData) {
        const {
            posted_by,
            title,
            company,
            location,
            job_type,
            salary_range,
            description,
            requirements,
            application_deadline,
            external_link,
            work_location
        } = jobData;

        try {
            const query = `
                INSERT INTO job_posts (
                    posted_by, title, company, location, job_type, salary_range, 
                    description, requirements, application_deadline, external_link, work_location
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                RETURNING *;
            `;
            const values = [
                posted_by, title, company, location, job_type, salary_range,
                description, requirements, application_deadline, external_link, work_location
            ];
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error creating job in DB: ${error.message}`);
        }
    }

    static async updateJob(id, jobData) {
        const {
            title,
            company,
            location,
            job_type,
            salary_range,
            description,
            requirements,
            application_deadline,
            external_link,
            work_location
        } = jobData;

        try {
            const query = `
                UPDATE job_posts 
                SET 
                    title = $1,
                    company = $2,
                    location = $3,
                    job_type = $4,
                    salary_range = $5,
                    description = $6,
                    requirements = $7,
                    application_deadline = $8,
                    external_link = $9,
                    work_location = $10,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $11
                RETURNING *;
            `;
            const values = [
                title, company, location, job_type, salary_range,
                description, requirements, application_deadline, external_link, work_location, id
            ];
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error updating job in DB: ${error.message}`);
        }
    }

    static async deleteById(id) {
        try {
            const query = 'UPDATE job_posts SET is_active = false WHERE id = $1 RETURNING id';
            const result = await db.query(query, [id]);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error deleting job by ID: ${error.message}`);
        }
    }
}