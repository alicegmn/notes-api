import { z } from "zod";

// Schema for user signup/registration
export const SignupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name can be at most 50 characters"),
  email: z.string().email("Must be a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password can be at most 100 characters"),
});

// Schema for user login
export const LoginSchema = z.object({
  email: z.string().email("Must be a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Types for request bodies (optional, for use in TypeScript)
export type SignupDTO = z.infer<typeof SignupSchema>;
export type LoginDTO = z.infer<typeof LoginSchema>;
