import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

pool
  .query("SELECT NOW()")
  .then((res) => console.log("DB connected at", res.rows[0].now))
  .catch((err) => {
    console.error("DB connection error:", err);
    process.exit(1);
  });

export default pool;
