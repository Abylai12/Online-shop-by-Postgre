import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

export const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: "require",
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

export const connectDB = async () => {
  try {
    const result = await sql`SELECT 1 AS test;`;
    console.log("Connection successful:", result);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};
