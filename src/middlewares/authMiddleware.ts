import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";

// Middleware to require authentication via JWT
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Get the Authorization header from the request
  const authHeader = req.headers.authorization;

  // Check that the header exists and is in the correct format
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Missing or malformed authorization header",
    });
  }

  // Extract the token from the header
  const token = authHeader.split(" ")[1];

  try {
    // Verify the JWT token
    const decoded = verifyToken(token);
    // Attach decoded user info to the request object
    // @ts-ignore: Add user property to req
    req.user = decoded;
    next();
  } catch {
    // Token is invalid or expired
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
