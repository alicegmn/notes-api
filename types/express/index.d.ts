import type { JWTPayload } from "../../src/utils/jwt";

// Extend the Express Request interface to include an optional 'user' property
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

// Export an empty object to make this a module
export {};
