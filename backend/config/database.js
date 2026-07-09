import pg from "pg";
import dotenv from "dotenv";

dotenv.config();


const isProduction = process.env.NODE_ENV === "production";

const db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,

    ssl: {
        rejectUnauthorized: false
    },

    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
export default db;










// import pg from "pg";
// import dotenv from "dotenv";
// dotenv.config();

// const db = new pg.Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_NAME,
//     password: process.env.DB_PASSWORD,
//     port: process.env.DB_PORT,
// });


// export default db;