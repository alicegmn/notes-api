import jwt, { Secret, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Get JWT secret and expiration from environment variables
const secret = process.env.JWT_SECRET as Secret;
const expiresIn = (process.env.JWT_EXPIRES_IN ??
  "1d") as SignOptions["expiresIn"];

// Define the expected shape of the JWT payload
export interface JWTPayload {
  id: number;
  email: string;
}

// Generate a signed JWT token with the provided payload
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, secret, { expiresIn });
}

// Verify a JWT token and return its payload
export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, secret) as JWTPayload;
}
