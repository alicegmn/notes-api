import { Request, Response } from "express";
import pool from "../db/pool.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import { SignupSchema, LoginSchema } from "../schemas/userSchema.js";

// GET all users
export async function getUsers(req: Request, res: Response) {
  try {
    const result = await pool.query(
      `SELECT id, name, email, created_at FROM users ORDER BY created_at DESC`
    );

    return res.json({
      success: true,
      users: result.rows,
    });
  } catch (err) {
    console.error("Get users error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
}

// Sign up
export async function signupUser(req: Request, res: Response) {
  const parsed = SignupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  }

  const { name, email, password } = parsed.data;

  try {
    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, hashed]
    );

    return res.status(201).json({
      success: true,
      message: "User created",
      user: result.rows[0],
    });
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({
        success: false,
        message: "Email already in use",
        fieldErrors: { email: "Already exists" },
      });
    }

    console.error("Signup error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

//Log in
export async function loginUser(req: Request, res: Response) {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  }

  const { email, password } = parsed.data;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
        fieldErrors: { email: "No user found" },
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Wrong password",
        fieldErrors: { password: "Invalid password" },
      });
    }

    const token = generateToken({ id: user.id, email: user.email });
    const { id, name, created_at } = user;

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id, name, email, created_at },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, message: "Internal error" });
  }
}

// GET me
export async function getMe(req: Request, res: Response) {
  const userId = req.user!.id;

  try {
    const result = await pool.query(
      "SELECT id, name, email, created_at FROM users WHERE id = $1",
      [userId]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({ success: true, user });
  } catch (err) {
    console.error("Get /me error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
