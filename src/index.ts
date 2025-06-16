import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./db/initDB.js";
import userRoutes from "./routes/users.js";
import notesRoutes from "./routes/notes.js";
import { setupSwagger } from "./swagger/swagger.js";

console.log("Server starting...");

process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("🔥 Unhandled Rejection:", reason);
});

// Load environment variables from .env file
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in .env");
}

// Initialize express application
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/notes", notesRoutes);
setupSwagger(app);

// Healthcheck
app.get("/api", (_req, res) => {
  res.send("Welcome to the Notes API!");
});

const PORT = process.env.PORT || 3000;

// Initialize the application
app.listen(PORT, async () => {
  await initDB();
  console.log(`Server is running on port http://localhost:${PORT}`);
});
