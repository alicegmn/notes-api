import jwt, { Secret, SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET as Secret;
const expiresIn = (process.env.JWT_EXPIRES_IN ??
  "1d") as SignOptions["expiresIn"];

export interface JWTPayload {
  id: number;
  email: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, secret) as JWTPayload;
}
