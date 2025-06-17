import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initDB } from "./db/initDB.js";
import userRoutes from "./routes/users.js";
import notesRoutes from "./routes/notes.js";
import { setupSwagger } from "./swagger/swagger.js";

console.log("Server starting...");

// Handle uncaught exceptions to prevent server crash
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});

// Handle unhandled promise rejections globally
process.on("unhandledRejection", (reason, promise) => {
  console.error("🔥 Unhandled Rejection:", reason);
});

// Load environment variables from .env file
dotenv.config();

// Ensure JWT secret is set before starting the server
if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in .env");
}

// Initialize the Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all requests
app.use(cors());

// Register user and note routes under /api
app.use("/api/users", userRoutes);
app.use("/api/notes", notesRoutes);

// Set up Swagger API documentation at /api/docs
setupSwagger(app);

// Healthcheck endpoint for simple API up check
app.get("/api", (_req, res) => {
  res.send("Welcome to the Notes API!");
});

const PORT = process.env.PORT || 3000;

// Start the server and initialize the database on launch
app.listen(PORT, async () => {
  await initDB();
  console.log(`Server is running on port http://localhost:${PORT}`);
});
