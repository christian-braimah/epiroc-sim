// Importing required modules
import pgPromise from "pg-promise";
import dotenv from "dotenv";

// Loading environment variables
dotenv.config();

// Initialize pg-promise
const pgp = pgPromise({});

// Creating database connection
const db = pgp({
    connectionString: process.env.RDS_DATABASE_URL,
    // AWS RDS requires SSL
    ssl: {
        rejectUnauthorized: false,
    },
});

// Exporting database connection
export default db;